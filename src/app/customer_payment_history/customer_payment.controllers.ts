import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import {
  customerPaymentSearchableField,
  ICustomerPaymentInterface,
} from "./customer_payment.interface";
import CustomerPaymentModel from "./customer_payment.model";
import { findACustomerPaymentHistoryServices } from "./customer_payment.services";

// Find A CustomerPayment history
export const findACustomerPaymentHistory: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICustomerPaymentInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ICustomerPaymentInterface[] | any =
      await findACustomerPaymentHistoryServices(
        limitNumber,
        skip,
        searchTerm
      );
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: customerPaymentSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await CustomerPaymentModel.countDocuments(whereCondition);
    return sendResponse<ICustomerPaymentInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "CustomerPayment Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};
