import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import {
  customerSearchableField,
  ICustomerInterface,
} from "./customer.interface";
import {
  findAllActiveCustomerServices,
  findAllDashboardCustomerServices,
  postCustomerServices,
  updateCustomerServices,
} from "./customer.services";
import CustomerModel from "./customer.model";

// Add A Customer
export const postCustomer: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICustomerInterface | any> => {
  try {
    const requestData = req.body;
    const checkCustomerExist = await CustomerModel.findOne({
      customer_phone: requestData?.customer_phone,
    });
    if (checkCustomerExist) {
      throw new ApiError(400, "Customer Already Exist !");
    }
    const result: ICustomerInterface | {} = await postCustomerServices(
      requestData
    );
    if (result) {
      return sendResponse<ICustomerInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Customer Added Successfully !",
      });
    } else {
      throw new ApiError(400, "Customer Added Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// find all active customer
export const findAllActiveCustomer: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICustomerInterface | any> => {
  try {
    const result: ICustomerInterface[] | [] | any =
      await findAllActiveCustomerServices();
    return sendResponse<ICustomerInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Customer Added Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All dashboard Customer
export const findAllDashboardCustomer: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICustomerInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ICustomerInterface[] | any =
      await findAllDashboardCustomerServices(limitNumber, skip, searchTerm);
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: customerSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await CustomerModel.countDocuments(whereCondition);
    return sendResponse<ICustomerInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Customer Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A Customer
export const updateCustomer: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICustomerInterface | any> => {
  try {
    const requestData = req.body;
    const checkCustomerExist = await CustomerModel.findOne({
      customer_phone: requestData?.customer_phone,
    });
    if (
      checkCustomerExist &&
      requestData?._id !== checkCustomerExist?._id?.toString()
    ) {
      throw new ApiError(400, "Customer Already Exist !");
    }
    const result: ICustomerInterface | any = await updateCustomerServices(
      requestData,
      requestData?._id
    );
    if (result?.modifiedCount > 0) {
      return sendResponse<ICustomerInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Customer Update Successfully !",
      });
    } else {
      throw new ApiError(400, "Customer Update Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};
