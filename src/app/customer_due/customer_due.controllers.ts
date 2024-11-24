import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { customerDueSearchableField, ICustomerDueInterface } from "./customer_due.interface";
import { findAllDashboardCustomerDueServices, postCustomerDueServices, updateCustomerDueServices } from "./customer_due.services";
import CustomerDueModel from "./customer_due.model";

// Add A CustomerDue
export const postCustomerDue: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICustomerDueInterface | any> => {
  try {
      const requestData = req.body;
      const result: ICustomerDueInterface | {} = await postCustomerDueServices(requestData);
      if (result) {
        return sendResponse<ICustomerDueInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "CustomerDue Added Successfully !",
        });
      } else {
        throw new ApiError(400, "CustomerDue Added Failed !");
      }
    
  } catch (error: any) {
    next(error);
  }
};

// Find All dashboard CustomerDue
export const findAllDashboardCustomerDue: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICustomerDueInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ICustomerDueInterface[] | any =
      await findAllDashboardCustomerDueServices(limitNumber, skip, searchTerm);
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: customerDueSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await CustomerDueModel.countDocuments(whereCondition);
    return sendResponse<ICustomerDueInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "CustomerDue Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A CustomerDue
export const updateCustomerDue: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICustomerDueInterface | any> => {
  try {
      const requestData = req.body;
      const result: ICustomerDueInterface | any = await updateCustomerDueServices(
        requestData,
        requestData?._id
      );
      if (result?.modifiedCount > 0) {
        return sendResponse<ICustomerDueInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "CustomerDue Update Successfully !",
        });
      } else {
        throw new ApiError(400, "CustomerDue Update Failed !");
      }
  } catch (error: any) {
    next(error);
  }
};

