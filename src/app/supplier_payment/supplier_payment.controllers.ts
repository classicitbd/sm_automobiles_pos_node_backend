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
import mongoose, { Types } from "mongoose";
import { postBankOutServices } from "../bank_out/bank_out.services";
import BankModel from "../bank/bank.model";
import SupplierModel from "../supplier/supplier.model";
import { postExpenseWhenProductStockAddServices } from "../expense/expense.services";

// Add A SupplierPayment
export const postSupplierPayment: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISupplierPaymentInterface | any> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const requestData = req.body;

    const checkBankWithRefNoExist = await SupplierPaymentModel.findOne({
      reference_id: requestData?.reference_id,
      payment_bank_id: requestData?.payment_bank_id,
    }).session(session);

    if (checkBankWithRefNoExist) {
      throw new ApiError(
        400,
        "Supplier Payment Already Exist With This Ref No !"
      );
    }
    const result: ISupplierPaymentInterface | {} =
      await postSupplierPaymentServices(requestData, session);
    if (!result) {
      throw new ApiError(400, "Supplier Payment Added Failed !");
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return sendResponse<ISupplierPaymentInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Supplier Payment Added Successfully !",
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
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

// update supplierPayment
export const updateSupplierPayment: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISupplierPaymentInterface | any> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const requestData = req.body;
    const _id = requestData?._id;

    const result: ISupplierPaymentInterface | {} =
      await updateSupplierPaymentServices(requestData, _id, session);
    if (!result) {
      throw new ApiError(400, "Supplier Payment Added Failed !");
    }

    const bankOutData = {
      bank_id: requestData?.payment_bank_id,
      bank_out_amount: requestData?.supplier_payment_amount,
      bank_out_title: requestData?.supplier_payment_title,
      bank_out_ref_no: requestData?.reference_id,
      bank_out_publisher_id: requestData?.supplier_payment_publisher_id,
    };
    // create a bank out data
    await postBankOutServices(bankOutData, session);

    // deduct amount from bank account
    await BankModel.updateOne(
      { _id: requestData?.payment_bank_id },
      { $inc: { bank_balance: -requestData?.supplier_payment_amount } },
      {
        session,
        runValidators: true,
      }
    );

    // add amount in Supplier wallet
    await SupplierModel.updateOne(
      { _id: requestData?.supplier_id },
      {
        $inc: { supplier_wallet_amount: +requestData?.supplier_payment_amount },
      },
      {
        session,
        runValidators: true,
      }
    );

    // add document in expense collection
    const sendDataInExpenceCreate = {
      expense_title: "Supplier Money Send",
      expense_amount: requestData?.supplier_payment_amount,
      expense_supplier_id: requestData?.supplier_id,
      expense_bank_id: requestData?.payment_bank_id,
      expense_publisher_id: requestData?.supplier_payment_publisher_id,
    };
    await postExpenseWhenProductStockAddServices(
      sendDataInExpenceCreate,
      session
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return sendResponse<ISupplierPaymentInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Supplier Payment Added Successfully !",
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
