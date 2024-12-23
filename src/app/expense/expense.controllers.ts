import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { expenseSearchableField, IExpenseInterface } from "./expense.interface";
import ExpenseModel from "./expense.model";
import {
  findAllExpenseServices,
  postExpenseServices,
} from "./expense.services";
import ApiError from "../../errors/ApiError";
import { FileUploadHelper } from "../../helpers/image.upload";
import mongoose from "mongoose";
import { postLedgerServices } from "../ledger/ledger.service";
import LedgerModel from "../ledger/ledger.model";

// Add A Expense
export const postExpense: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IExpenseInterface | any> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (req.files && "expense_voucher" in req.files && req.body) {
      const requestData = req.body;
      // get the Expense image and upload
      let expense_voucher;
      if (req.files && "expense_voucher" in req.files) {
        const ExpenseImage = req.files["expense_voucher"][0];
        const expense_voucher_upload = await FileUploadHelper.uploadToSpaces(
          ExpenseImage
        );
        expense_voucher = expense_voucher_upload?.Location;
      }
      const data = { ...requestData, expense_voucher };
      const result: IExpenseInterface | {} = await postExpenseServices(data);
      if (result) {
        // add balance in ledger
        const ledgerData: any = await LedgerModel.findOne({})
          .sort({ _id: -1 })
          .session(session);
        if (ledgerData) {
          const updateLedgerData = {
            ledger_title: "Expense create",
            ledger_category: "Expense",
            ledger_debit: requestData?.expense_amount,
            ledger_balance:
              ledgerData?.ledger_balance - requestData?.expense_amount,
            ledger_publisher_id: requestData?.expense_publisher_id,
          };
          await postLedgerServices(updateLedgerData, session);
        } else {
          const updateLedgerData = {
            ledger_title: "Expense create",
            ledger_category: "Expense",
            ledger_debit: requestData?.expense_amount,
            ledger_balance: requestData?.expense_amount,
            ledger_publisher_id: requestData?.expense_publisher_id,
          };
          await postLedgerServices(updateLedgerData, session);
        }
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        return sendResponse<IExpenseInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Expense Added Successfully !",
        });
      } else {
        throw new ApiError(400, "Expense Added Failed !");
      }
    } else {
      const requestData = req.body;
      const result: IExpenseInterface | {} = await postExpenseServices(
        requestData
      );
      if (result) {
        // add balance in ledger
        const ledgerData: any = await LedgerModel.findOne({})
          .sort({ _id: -1 })
          .session(session);
        if (ledgerData) {
          const updateLedgerData = {
            ledger_title: "Expense create",
            ledger_category: "Expense",
            ledger_debit: requestData?.expense_amount,
            ledger_balance:
              ledgerData?.ledger_balance - requestData?.expense_amount,
            ledger_publisher_id: requestData?.expense_publisher_id,
          };
          await postLedgerServices(updateLedgerData, session);
        } else {
          const updateLedgerData = {
            ledger_title: "Expense create",
            ledger_category: "Expense",
            ledger_debit: requestData?.expense_amount,
            ledger_balance: requestData?.expense_amount,
            ledger_publisher_id: requestData?.expense_publisher_id,
          };
          await postLedgerServices(updateLedgerData, session);
        }
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        return sendResponse<IExpenseInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Expense Added Successfully !",
        });
      } else {
        throw new ApiError(400, "Expense Added Failed !");
      }
    }
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// Find All Expense
export const findAllExpense: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IExpenseInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IExpenseInterface[] | any = await findAllExpenseServices(
      limitNumber,
      skip,
      searchTerm
    );
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: expenseSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await ExpenseModel.countDocuments(whereCondition);
    return sendResponse<IExpenseInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Expense Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};
