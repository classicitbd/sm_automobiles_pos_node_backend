import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { ISalaryInterface, salarySearchableField } from "./salary.interface";
import SalaryModel from "./salary.model";
import SaleTargetModel from "../sale_target/sale_target.model";
import mongoose from "mongoose";
import {
  findAllDashboardSalaryServices,
  findAUserAllSalaryServices,
  findAUserASalaryDetailsServices,
  postSalaryServices,
  updateSalaryServices,
} from "./salary.service";
import UserModel from "../user/user.model";

// Add A Salary
export const postSalary: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISalaryInterface | any> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const requestData = req.body;
    const { user_id, salary_month } = requestData;

    const alreadySalaryGenerate = await SalaryModel.exists({
      user_id,
      salary_month,
    }).session(session);
    if (alreadySalaryGenerate) {
      throw new ApiError(400, "Salary Already Generated");
    }

    // Get the first day of the salary month
    const startOfSalaryMonth = new Date(`${salary_month}-01T00:00:00Z`);

    // Get the last day of the salary month
    const endOfSalaryMonth = new Date(
      startOfSalaryMonth.getUTCFullYear(),
      startOfSalaryMonth.getUTCMonth() + 1,
      0
    );

    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date) => {
      const year = date?.getFullYear();
      const month = String(date?.getMonth() + 1).padStart(2, "0");
      const day = String(date?.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Query the database for overlapping ranges
    const saleTarget = await SaleTargetModel.findOne({
      user_id: user_id, // Match the user ID
      $or: [
        {
          // Start date falls within the salary month
          sale_target_start_date: {
            $gte: formatDate(startOfSalaryMonth),
            $lte: formatDate(endOfSalaryMonth),
          },
        },
        {
          // End date falls within the salary month
          sale_target_end_date: {
            $gte: formatDate(startOfSalaryMonth),
            $lte: formatDate(endOfSalaryMonth),
          },
        },
        {
          // Target period spans the entire month
          sale_target_start_date: { $lte: formatDate(startOfSalaryMonth) },
          sale_target_end_date: { $gte: formatDate(endOfSalaryMonth) },
        },
      ],
    }).session(session);

    if (saleTarget) {
      requestData.commision_id = saleTarget?._id;
      // Extract necessary values from saleTarget
      const {
        brand_sale_target,
        sale_target,
        brand_sale_target_success,
        sale_target_success,
        first_half_amount_per_unit,
        second_half_amount_per_unit,
      } = saleTarget;
      // Check if both targets are successful
      if (brand_sale_target_success && sale_target_success) {
        // Calculate the total target
        const totalTarget = brand_sale_target + sale_target;

        // Calculate the 50% split
        const firstHalf = totalTarget / 2;
        const secondHalf = totalTarget - firstHalf;

        // Calculate the commission
        requestData.commision_amount =
          firstHalf * first_half_amount_per_unit +
          secondHalf * second_half_amount_per_unit;
        requestData.grand_total_amount =
          requestData?.commision_amount + requestData?.basic_salary;
        requestData.due_amount = requestData?.grand_total_amount;
      } else {
        requestData.grand_total_amount = requestData?.basic_salary;
        requestData.due_amount = requestData?.grand_total_amount;
      }
    } else {
      requestData.grand_total_amount = requestData?.basic_salary;
      requestData.due_amount = requestData?.grand_total_amount;
    }

    const result = await postSalaryServices(requestData, session);

    if (!result) {
      throw new ApiError(400, "Salary Generate Failed!");
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return sendResponse<ISalaryInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Salary Added Successfully!",
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// Add MultipleUserSalary
export const postMultipleUserSalary: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISalaryInterface | any> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const requestData = req.body;
    const { users } = requestData;

    for (const user of users) {
      const { user_id, salary_month } = user;

      const alreadySalaryGenerate = await SalaryModel.exists({
        user_id,
        salary_month,
      }).session(session);
      if (alreadySalaryGenerate) {
        continue;
      }

      // Get the first day of the salary month
      const startOfSalaryMonth = new Date(`${salary_month}-01T00:00:00Z`);

      // Get the last day of the salary month
      const endOfSalaryMonth = new Date(
        startOfSalaryMonth.getUTCFullYear(),
        startOfSalaryMonth.getUTCMonth() + 1,
        0
      );

      // Format dates as YYYY-MM-DD
      const formatDate = (date: Date) => {
        const year = date?.getFullYear();
        const month = String(date?.getMonth() + 1).padStart(2, "0");
        const day = String(date?.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      // Query the database for overlapping ranges
      const saleTarget = await SaleTargetModel.findOne({
        user_id: user_id, // Match the user ID
        $or: [
          {
            // Start date falls within the salary month
            sale_target_start_date: {
              $gte: formatDate(startOfSalaryMonth),
              $lte: formatDate(endOfSalaryMonth),
            },
          },
          {
            // End date falls within the salary month
            sale_target_end_date: {
              $gte: formatDate(startOfSalaryMonth),
              $lte: formatDate(endOfSalaryMonth),
            },
          },
          {
            // Target period spans the entire month
            sale_target_start_date: { $lte: formatDate(startOfSalaryMonth) },
            sale_target_end_date: { $gte: formatDate(endOfSalaryMonth) },
          },
        ],
      }).session(session);

      if (saleTarget) {
        user.commision_id = saleTarget?._id;
        // Extract necessary values from saleTarget
        const {
          brand_sale_target,
          sale_target,
          brand_sale_target_success,
          sale_target_success,
          first_half_amount_per_unit,
          second_half_amount_per_unit,
        } = saleTarget;
        // Check if both targets are successful
        if (brand_sale_target_success && sale_target_success) {
          // Calculate the total target
          const totalTarget = brand_sale_target + sale_target;

          // Calculate the 50% split
          const firstHalf = totalTarget / 2;
          const secondHalf = totalTarget - firstHalf;

          // Calculate the commission
          user.commision_amount =
            firstHalf * first_half_amount_per_unit +
            secondHalf * second_half_amount_per_unit;
          user.grand_total_amount = user?.commision_amount + user?.basic_salary;
          user.due_amount = user?.grand_total_amount;
        } else {
          user.grand_total_amount = user?.basic_salary;
          user.due_amount = user?.grand_total_amount;
        }
      } else {
        user.grand_total_amount = user?.basic_salary;
        user.due_amount = user?.grand_total_amount;
      }

      const result = await postSalaryServices(user, session);

      if (!result) {
        throw new ApiError(400, "Some One Salary Generate Failed!");
      }
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return sendResponse<ISalaryInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Salary Added Successfully!",
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// Add AllUserSalary
export const postAllUserSalary: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISalaryInterface | any> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const requestData = req.body;
    const { salary_month, salary_publisher_id } = requestData;

    const users = await UserModel.find({ user_status: "active" }).session(
      session
    );
    if (!users) {
      throw new ApiError(400, "User Not Found!");
    }

    for (const user of users) {
      const sendData: any = {
        user_id: user?._id,
        user_phone: user?.user_phone,
        salary_month,
        basic_salary: user?.user_salary,
        salary_publisher_id,
      };

      const alreadySalaryGenerate: any = await SalaryModel.exists({
        user_id: user?._id,
        salary_month,
      }).session(session);
      if (alreadySalaryGenerate) {
        continue;
      }

      // Get the first day of the salary month
      const startOfSalaryMonth = new Date(`${salary_month}-01T00:00:00Z`);

      // Get the last day of the salary month
      const endOfSalaryMonth = new Date(
        startOfSalaryMonth.getUTCFullYear(),
        startOfSalaryMonth.getUTCMonth() + 1,
        0
      );

      // Format dates as YYYY-MM-DD
      const formatDate = (date: Date) => {
        const year = date?.getFullYear();
        const month = String(date?.getMonth() + 1).padStart(2, "0");
        const day = String(date?.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      // Query the database for overlapping ranges
      const saleTarget = await SaleTargetModel.findOne({
        user_id: sendData?.user_id, // Match the user ID
        $or: [
          {
            // Start date falls within the salary month
            sale_target_start_date: {
              $gte: formatDate(startOfSalaryMonth),
              $lte: formatDate(endOfSalaryMonth),
            },
          },
          {
            // End date falls within the salary month
            sale_target_end_date: {
              $gte: formatDate(startOfSalaryMonth),
              $lte: formatDate(endOfSalaryMonth),
            },
          },
          {
            // Target period spans the entire month
            sale_target_start_date: { $lte: formatDate(startOfSalaryMonth) },
            sale_target_end_date: { $gte: formatDate(endOfSalaryMonth) },
          },
        ],
      }).session(session);

      if (saleTarget) {
        sendData.commision_id = saleTarget?._id;
        // Extract necessary values from saleTarget
        const {
          brand_sale_target,
          sale_target,
          brand_sale_target_success,
          sale_target_success,
          first_half_amount_per_unit,
          second_half_amount_per_unit,
        } = saleTarget;
        // Check if both targets are successful
        if (brand_sale_target_success && sale_target_success) {
          // Calculate the total target
          const totalTarget = brand_sale_target + sale_target;

          // Calculate the 50% split
          const firstHalf = totalTarget / 2;
          const secondHalf = totalTarget - firstHalf;

          // Calculate the commission
          sendData.commision_amount =
            firstHalf * first_half_amount_per_unit +
            secondHalf * second_half_amount_per_unit;
          sendData.grand_total_amount =
            sendData?.commision_amount + sendData?.basic_salary;
          sendData.due_amount = sendData?.grand_total_amount;
        } else {
          sendData.grand_total_amount = sendData?.basic_salary;
          sendData.due_amount = sendData?.grand_total_amount;
        }
      } else {
        sendData.grand_total_amount = sendData?.basic_salary;
        sendData.due_amount = sendData?.grand_total_amount;
      }

      const result = await postSalaryServices(sendData, session);

      if (!result) {
        throw new ApiError(400, "Some One Salary Generate Failed!");
      }
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return sendResponse<ISalaryInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Salary Added Successfully!",
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// Find All Dashboard Salary
export const findAllDashboardSalary: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISalaryInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ISalaryInterface[] | any =
      await findAllDashboardSalaryServices(limitNumber, skip, searchTerm);
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: salarySearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await SalaryModel.countDocuments(whereCondition);
    return sendResponse<ISalaryInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Salary Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find AUserAllSalary
export const findAUserAllSalary: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISalaryInterface | any> => {
  try {
    const { page, limit, searchTerm, user_id }: any = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ISalaryInterface[] | any = await findAUserAllSalaryServices(
      limitNumber,
      skip,
      searchTerm,
      user_id
    );
    const total = await SalaryModel.countDocuments({ user_id: user_id });
    return sendResponse<ISalaryInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Salary Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find AUserA SalaryDetails
export const findAUserASalaryDetails: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISalaryInterface | any> => {
  try {
    const salary_id = req.query?.salary_id;
    const result: ISalaryInterface[] | any =
      await findAUserASalaryDetailsServices(salary_id);
    return sendResponse<ISalaryInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Salary Found Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A Salary
export const updateSalary: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISalaryInterface | any> => {
  try {
    const requestData = req.body;
    const result: ISalaryInterface | any = await updateSalaryServices(
      requestData,
      requestData?._id
    );
    if (result?.modifiedCount > 0) {
      return sendResponse<ISalaryInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Salary Update Successfully !",
      });
    } else {
      throw new ApiError(400, "Salary Update Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};
