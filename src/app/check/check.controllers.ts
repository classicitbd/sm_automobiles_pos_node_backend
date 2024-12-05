import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { checkSearchableField, ICheckInterface } from "./check.interface";
import CheckModel from "./check.model";
import {
  findAllDashboardCheckServices,
  findAllDueDashboardCheckServices,
  findAllTodayDashboardCheckServices,
  postCheckServices,
  updateCheckServices,
} from "./check.services";

// Add A Check
export const postCheck: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICheckInterface | any> => {
  try {
    const requestData = req.body;
    if (requestData?.check_number) {
      const checkCheckExist = await CheckModel.findOne({
        check_number: requestData?.check_number,
      });
      if (checkCheckExist) {
        throw new ApiError(400, "Check No Already Exist !");
      }
    }
    const checkThisOrderPaymentPendingExist = await CheckModel.findOne({
      order_id: requestData?.order_id,
      check_status: "pending",
    });
    if (checkThisOrderPaymentPendingExist) {
      throw new ApiError(400, "This Order Has Payment Pending Exist !");
    }

    const result: ICheckInterface | {} = await postCheckServices(requestData);
    if (result) {
      return sendResponse<ICheckInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Check Added Successfully !",
      });
    } else {
      throw new ApiError(400, "Check Added Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// Find All dashboard Check
export const findAllDashboardCheck: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICheckInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ICheckInterface[] | any = await findAllDashboardCheckServices(
      limitNumber,
      skip,
      searchTerm
    );
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: checkSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await CheckModel.countDocuments(whereCondition);
    return sendResponse<ICheckInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Check Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All Todaydashboard Check
export const findAllTodayDashboardCheck: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICheckInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ICheckInterface[] | any =
      await findAllTodayDashboardCheckServices(limitNumber, skip, searchTerm);
    const todayDate = new Date().toISOString().split("T")[0];
    const andCondition: any = [{ check_withdraw_date: todayDate }];
    if (searchTerm) {
      andCondition.push({
        $or: checkSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await CheckModel.countDocuments(whereCondition);
    return sendResponse<ICheckInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Check Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All Duedashboard Check
export const findAllDueDashboardCheck: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICheckInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ICheckInterface[] | any =
      await findAllDueDashboardCheckServices(limitNumber, skip, searchTerm);
    const today = new Date();
    const previousDay = new Date(today.setDate(today.getDate() - 1))
      .toISOString()
      .split("T")[0];

    const andCondition: any = [{ check_withdraw_date: previousDay }];
    if (searchTerm) {
      andCondition.push({
        $or: checkSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await CheckModel.countDocuments(whereCondition);
    return sendResponse<ICheckInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Check Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A Check
export const updateCheck: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICheckInterface | any> => {
  try {
    const requestData = req.body;
    const result: ICheckInterface | any = await updateCheckServices(
      requestData,
      requestData?._id
    );
    if (result?.modifiedCount > 0) {
      return sendResponse<ICheckInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Check Update Successfully !",
      });
    } else {
      throw new ApiError(400, "Check Update Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};
