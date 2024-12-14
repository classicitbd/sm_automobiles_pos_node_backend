import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { checkSearchableField, ICheckInterface } from "./check.interface";
import CheckModel from "./check.model";
import {
  findAllACustomerCheckServices,
  findAllCheckInPaymentServices,
  findAllCheckPublishAUserServices,
  findAllDashboardCheckServices,
  findAllDueDashboardCheckServices,
  findAllTodayDashboardCheckServices,
  postCheckServices,
  updateCheckServices,
} from "./check.services";
import mongoose from "mongoose";
import { postBankInServices } from "../bank_in/bank_in.services";
import BankModel from "../bank/bank.model";
import CustomerModel from "../customer/customer.model";
import OrderModel from "../order/order.model";
import { postIncomeWhenCustomerPaymentAddServices } from "../income/income.services";

// Generate a unique trnxId
export const generateChecktrnxId = async () => {
  let isUnique = false;
  let uniquetrnxId;

  while (!isUnique) {
    // Generate a random alphanumeric string of length 8
    uniquetrnxId = Array.from({ length: 8 }, () =>
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
        Math.floor(Math.random() * 62)
      )
    ).join("");

    // Check if the generated transaction_id is unique in the database
    const existingOrder = await CheckModel.findOne({
      transaction_id: uniquetrnxId,
    });

    // If no existing order found, mark the transaction_id as unique
    if (!existingOrder) {
      isUnique = true;
    }
  }

  return uniquetrnxId;
};

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
    const transaction_id = await generateChecktrnxId();
    requestData.transaction_id = transaction_id;
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

// Find All ACustomer Check
export const findAllACustomerCheck: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICheckInterface | any> => {
  try {
    const { page, limit, searchTerm, customer_id }: any = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ICheckInterface[] | any = await findAllACustomerCheckServices(
      limitNumber,
      skip,
      searchTerm,
      customer_id
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
    andCondition.push({ customer_id: customer_id });
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

// Find all  Check publish a user
export const findAllCheckPublishAUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICheckInterface | any> => {
  try {
    const { page, limit, searchTerm, check_publisher_id }: any = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ICheckInterface[] | any =
      await findAllCheckPublishAUserServices(
        limitNumber,
        skip,
        searchTerm,
        check_publisher_id
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
    andCondition.push({ check_publisher_id: check_publisher_id });
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

// Find All Check in payment
export const findAllCheckInPayment: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICheckInterface | any> => {
  try {
    const { page, limit, searchTerm, payment_method }: any = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ICheckInterface[] | any = await findAllCheckInPaymentServices(
      limitNumber,
      skip,
      searchTerm,
      payment_method
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
    andCondition.push({ payment_method: payment_method });
    andCondition.push({ check_status: "approved" });
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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const requestData = req.body;
    const updateStatusData = {
      check_status: requestData?.check_status,
    };
    const result: ICheckInterface | any = await updateCheckServices(
      updateStatusData,
      requestData?._id,
      session
    );
    if (result?.modifiedCount < 1) {
      throw new ApiError(400, "Check Status Update Failed !");
    }

    if (requestData?.check_status == "approved") {
      if (requestData?.payment_method == "check") {
        const bankOutData = {
          bank_id: requestData?.bank_id,
          bank_in_amount: requestData?.pay_amount,
          bank_in_title: requestData?.payment_note,
          bank_in_ref_no: requestData?.check_number,
          customer_id: requestData?.customer_id,
          bank_in_publisher_id: requestData?.check_updated_by,
        };
        // create a bank in data
        await postBankInServices(bankOutData, session);

        // add amount from bank account
        await BankModel.updateOne(
          { _id: requestData?.bank_id },
          { $inc: { bank_balance: +requestData?.pay_amount } },
          {
            session,
            runValidators: true,
          }
        );
      }

      // payment add in income list
      const incomeData = {
        income_title: requestData?.payment_note || "Customer payment",
        income_amount: requestData?.pay_amount,
        income_customer_id: requestData?.customer_id,
        customer_phone: requestData?.customer_phone,
        income_bank_id: requestData?.bank_id,
        reference_id: requestData?.check_number,
        income_order_id: requestData?.order_id,
        income_invoice_number: requestData?.invoice_number,
        income_publisher_id: requestData?.check_updated_by,
      };
      await postIncomeWhenCustomerPaymentAddServices(incomeData, session);

      // // add amount in Customer wallet
      // await CustomerModel.updateOne(
      //   { _id: requestData?.customer_id },
      //   {
      //     $inc: { customer_wallet: +requestData?.pay_amount },
      //   },
      //   {
      //     session,
      //     runValidators: true,
      //   }
      // );

      // deduct amount from order total ammount
      await OrderModel.updateOne(
        { _id: requestData?.order_id },
        {
          $inc: {
            received_amount: +requestData?.pay_amount,
            due_amount: -requestData?.pay_amount,
          },
        },
        {
          session,
          runValidators: true,
        }
      );
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return sendResponse<ICheckInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Check Update Successfully !",
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
