import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import {
  ISupplierPaymentInterface,
  supplierPaymentSearchableField,
} from "./supplier_payment.interface";
import {
  findAllDashboardSupplierPaymentServices,
  findASupplierPaymentHistoryServices,
  postSupplierPaymentServices,
  updateSupplierPaymentServices,
} from "./supplier_payment.services";
import ApiError from "../../errors/ApiError";
import SupplierPaymentModel from "./supplier_payment.model";
import { Types } from "mongoose";

// Add A SupplierPayment
export const postSupplierPayment: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISupplierPaymentInterface | any> => {
  try {
    const requestData = req.body;
    const result: ISupplierPaymentInterface | {} =
      await postSupplierPaymentServices(requestData);
    if (result) {
      return sendResponse<ISupplierPaymentInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Supplier Payment Added Successfully !",
      });
    } else {
      throw new ApiError(400, "Supplier Payment Added Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// Find A SupplierPaymentHistory
export const findASupplierPaymentHistory: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISupplierPaymentInterface | any> => {
  try {
    const { page, limit, searchTerm, supplier_id }: any = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ISupplierPaymentInterface[] | any =
      await findASupplierPaymentHistoryServices(
        limitNumber,
        skip,
        searchTerm,
        supplier_id
      );
    const supplierObjectId = Types.ObjectId.isValid(supplier_id)
      ? { supplier_id: new Types.ObjectId(supplier_id) }
      : { supplier_id };

    const andCondition: any[] = [supplierObjectId];
    if (searchTerm) {
      andCondition.push({
        $or: supplierPaymentSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await SupplierPaymentModel.countDocuments(whereCondition);
    return sendResponse<ISupplierPaymentInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Supplier Payment Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All dashboard SupplierPayment
export const findAllDashboardSupplierPayment: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISupplierPaymentInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ISupplierPaymentInterface[] | any =
      await findAllDashboardSupplierPaymentServices(
        limitNumber,
        skip,
        searchTerm
      );
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: supplierPaymentSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await SupplierPaymentModel.countDocuments(whereCondition);
    return sendResponse<ISupplierPaymentInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Supplier Payment Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A SupplierPayment
export const updateSupplierPayment: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISupplierPaymentInterface | any> => {
  try {
    const requestData = req.body;
    const result: ISupplierPaymentInterface | any =
      await updateSupplierPaymentServices(requestData, requestData?._id);
    if (result?.modifiedCount > 0) {
      return sendResponse<ISupplierPaymentInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Supplier Payment Update Successfully !",
      });
    } else {
      throw new ApiError(400, "Supplier Payment Update Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};
