import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { Types } from "mongoose";
import {
  ISupplierDueInterface,
  supplierDueSearchableField,
} from "./supplier_due.interface";
import {
  findAllDashboardSupplierDueServices,
  findASupplierDueHistoryServices,
  postSupplierDueServices,
  updateSupplierDueServices,
} from "./supplier_due.services";
import SupplierDueModel from "./supplier_due.model";

// Add A SupplierDue
export const postSupplierDue: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISupplierDueInterface | any> => {
  try {
    const requestData = req.body;
    const result: ISupplierDueInterface | {} = await postSupplierDueServices(
      requestData
    );
    if (result) {
      return sendResponse<ISupplierDueInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Supplier Due Added Successfully !",
      });
    } else {
      throw new ApiError(400, "Supplier Due Added Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// Find A SupplierDueHistory
export const findASupplierDueHistory: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISupplierDueInterface | any> => {
  try {
    const { page, limit, searchTerm, supplier_id }: any = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ISupplierDueInterface[] | any =
      await findASupplierDueHistoryServices(
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
        $or: supplierDueSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await SupplierDueModel.countDocuments(whereCondition);
    return sendResponse<ISupplierDueInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Supplier Due Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All dashboard SupplierDue
export const findAllDashboardSupplierDue: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISupplierDueInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ISupplierDueInterface[] | any =
      await findAllDashboardSupplierDueServices(limitNumber, skip, searchTerm);
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: supplierDueSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await SupplierDueModel.countDocuments(whereCondition);
    return sendResponse<ISupplierDueInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Supplier Due Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A SupplierDue
export const updateSupplierDue: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISupplierDueInterface | any> => {
  try {
    const requestData = req.body;
    const result: ISupplierDueInterface | any = await updateSupplierDueServices(
      requestData,
      requestData?._id
    );
    if (result?.modifiedCount > 0) {
      return sendResponse<ISupplierDueInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Supplier Due Update Successfully !",
      });
    } else {
      throw new ApiError(400, "Supplier Due Update Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};
