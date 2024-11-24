import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { customerPaymentSearchableField, ICustomerPaymentInterface } from "./customer_payment.interface";
import { findAllDashboardCustomerPaymentServices, postCustomerPaymentServices, updateCustomerPaymentServices } from "./customer_payment.services";
import CustomerPaymentModel from "./customer_payment.model";

// Add A CustomerPayment
export const postCustomerPayment: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICustomerPaymentInterface | any> => {
  try {
      const requestData = req.body;
      const result: ICustomerPaymentInterface | {} = await postCustomerPaymentServices(requestData);
      if (result) {
        return sendResponse<ICustomerPaymentInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "CustomerPayment Added Successfully !",
        });
      } else {
        throw new ApiError(400, "CustomerPayment Added Failed !");
      }
    
  } catch (error: any) {
    next(error);
  }
};

// Find All dashboard CustomerPayment
export const findAllDashboardCustomerPayment: RequestHandler = async (
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
      await findAllDashboardCustomerPaymentServices(limitNumber, skip, searchTerm);
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

// Update A CustomerPayment
export const updateCustomerPayment: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICustomerPaymentInterface | any> => {
  try {
      const requestData = req.body;
      const result: ICustomerPaymentInterface | any = await updateCustomerPaymentServices(
        requestData,
        requestData?._id
      );
      if (result?.modifiedCount > 0) {
        return sendResponse<ICustomerPaymentInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "CustomerPayment Update Successfully !",
        });
      } else {
        throw new ApiError(400, "CustomerPayment Update Failed !");
      }
  } catch (error: any) {
    next(error);
  }
};

