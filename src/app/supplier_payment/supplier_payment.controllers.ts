import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import {
  ISupplierPaymentInterface,
  supplierPaymentSearchableField,
} from "./supplier_payment.interface";
import {
  findAllCheckInSupplierPaymentServices,
  findAllDashboardSupplierPaymentServices,
  findAllPaidSupplierPaymentServices,
  findAllUnPaidSupplierPaymentServices,
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
import StockManageModel from "../stock_manage/stock_manage.model";

// Generate a unique trnxId
const generatetrnxId = async () => {
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
    const existingOrder = await SupplierPaymentModel.findOne({
      transaction_id: uniquetrnxId,
    });

    // If no existing order found, mark the transaction_id as unique
    if (!existingOrder) {
      isUnique = true;
    }
  }

  return uniquetrnxId;
};

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

    if (
      requestData?.supplier_payment_method == "check" &&
      requestData?.reference_id &&
      requestData?.payment_bank_id
    ) {
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
    }

    const transaction_id = await generatetrnxId();
    requestData.transaction_id = transaction_id;

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

// Find All Paid SupplierPayment
export const findAllPaidSupplierPayment: RequestHandler = async (
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
      await findAllPaidSupplierPaymentServices(limitNumber, skip, searchTerm);
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
    andCondition.push({ supplier_payment_status: "paid" });
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

// Find All UnPaid SupplierPayment
export const findAllUnPaidSupplierPayment: RequestHandler = async (
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
      await findAllUnPaidSupplierPaymentServices(limitNumber, skip, searchTerm);
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
    andCondition.push({ supplier_payment_status: "unpaid" });
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

// Find all CheckIn SupplierPayment
export const findAllCheckInSupplierPayment: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISupplierPaymentInterface | any> => {
  try {
    const { page, limit, searchTerm, supplier_payment_method }: any = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ISupplierPaymentInterface[] | any =
      await findAllCheckInSupplierPaymentServices(
        limitNumber,
        skip,
        searchTerm,
        supplier_payment_method
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
    andCondition.push({ supplier_payment_method: supplier_payment_method });
    andCondition.push({ supplier_payment_status: "paid" });
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

    const updatedStatus = {
      supplier_payment_status: requestData?.supplier_payment_status,
      supplier_payment_updated_by: requestData?.supplier_payment_updated_by,
    };

    const result: ISupplierPaymentInterface | {} | any =
      await updateSupplierPaymentServices(updatedStatus, _id, session);
    if (result?.modifiedCount < 1) {
      throw new ApiError(400, "Supplier Payment Added Failed !");
    }

    if (requestData?.supplier_payment_method == "check") {
      const bankOutData = {
        bank_id: requestData?.payment_bank_id,
        bank_out_amount: requestData?.supplier_payment_amount,
        bank_out_title: requestData?.supplier_payment_title,
        bank_out_ref_no: requestData?.reference_id,
        bank_out_publisher_id: requestData?.supplier_payment_updated_by,
        invoice_id: requestData?.invoice_id,
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
    }

    // add document in expense collection
    const sendDataInExpenceCreate: any = {
      expense_title: "Supplier Money Send",
      expense_amount: requestData?.supplier_payment_amount,
      expense_supplier_id: requestData?.supplier_id,
      expense_publisher_id: requestData?.supplier_payment_updated_by,
      expence_supplier_payment_invoice_id: requestData?.invoice_id,
    };
    if (requestData?.supplier_payment_method == "check") {
      (sendDataInExpenceCreate.expense_bank_id = requestData?.payment_bank_id),
        (sendDataInExpenceCreate.reference_id = requestData?.reference_id);
    }

    await postExpenseWhenProductStockAddServices(
      sendDataInExpenceCreate,
      session
    );

    // decrease amount from stck purchase invoice and update status
    const stockManageDetails = await StockManageModel.findOne({
      _id: requestData?.invoice_id,
    }).session(session);
    if (!stockManageDetails) {
      throw new ApiError(400, "Stock Manage Details Not Found !");
    }
    const stockUpdateData = {
      due_amount:
        stockManageDetails?.due_amount - requestData?.supplier_payment_amount,
      paid_amount:
        stockManageDetails?.paid_amount + requestData?.supplier_payment_amount,
      payment_status:
        stockManageDetails?.due_amount - requestData?.supplier_payment_amount ==
        0
          ? "paid"
          : "unpaid",
      stock_updated_by: requestData?.supplier_payment_updated_by,
    };
    await StockManageModel.updateOne({ _id: requestData?.invoice_id }, stockUpdateData, {
      session,
      runValidators: true,
    });

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
