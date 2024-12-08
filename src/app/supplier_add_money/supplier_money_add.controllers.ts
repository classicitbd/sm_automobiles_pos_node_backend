import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import{ Types } from "mongoose";
import { findASupplierMoneyAddHistoryServices } from "./supplier_money_add.services";
import { ISupplierMoneyAddInterface } from "./supplier_money_add.interface";
import { supplierPaymentSearchableField } from "../supplier_payment/supplier_payment.interface";
import SupplierMoneyAddModel from "./supplier_money_add.model";


// Find A SupplierMoneyAddHistory
export const findASupplierMoneyAddHistory: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISupplierMoneyAddInterface | any> => {
  try {
    const { page, limit, searchTerm, supplier_id }: any = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ISupplierMoneyAddInterface[] | any =
      await findASupplierMoneyAddHistoryServices(
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
    const total = await SupplierMoneyAddModel.countDocuments(whereCondition);
    return sendResponse<ISupplierMoneyAddInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Supplier Money Add History Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};
