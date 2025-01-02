import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import {
  ISalaryPaymentInterface,
  salaryPaymentSearchableField,
} from "./salaryPayment.interface";
import mongoose from "mongoose";
import {
  findAUserAllSalaryPaymentInAInvoiceServices,
  findAUserAllSalaryPaymentServices,
  findDashboardSalaryPaymentServices,
  postSalaryPaymentServices,
} from "./salaryPayment.service";
import SupplierPaymentModel from "../supplier_payment/supplier_payment.model";
import { ISupplierPaymentInterface } from "../supplier_payment/supplier_payment.interface";
import { postSupplierPaymentServices } from "../supplier_payment/supplier_payment.services";
import { postBankOutServices } from "../bank_out/bank_out.services";
import BankModel from "../bank/bank.model";
import CashModel from "../cash/cash.model";
import SalaryModel from "../salary/salary.model";
import { postExpenseWhenProductStockAddServices } from "../expense/expense.services";
import LedgerModel from "../ledger/ledger.model";
import { postLedgerServices } from "../ledger/ledger.service";
import SalaryPaymentModel from "./salaryPayment.model";

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

// Add A SalaryPayment
export const postSalaryPayment: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISalaryPaymentInterface | any> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const requestData = req.body;
    const invoice_id = await generatetrnxId();
    requestData.invoice_id = invoice_id;

    const result = await postSalaryPaymentServices(requestData, session);

    if (!result) {
      throw new ApiError(400, "SalaryPayment Generate Failed!");
    }

    //   add payment history in supplier payment history
    if (
      requestData?.payment_type == "check" &&
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
          "Salary Payment Already Exist With This Ref No !"
        );
      }
      const sendData: any = {
        supplier_payment_title: "Salary Payment",
        supplier_payment_date: requestData?.payment_date,
        supplier_payment_amount: requestData?.pay_amount,
        supplier_payment_method: "check",
        supplier_payment_status: "paid",
        transaction_id: invoice_id,
        salary_user_id: requestData?.user_id,
        payment_bank_id: requestData?.payment_bank_id,
        reference_id: requestData?.reference_id,
        supplier_payment_publisher_id: requestData?.payment_publisher_id,
      };

      const salaryPaymentHistory: ISupplierPaymentInterface | {} =
        await postSupplierPaymentServices(sendData, session);
      if (!salaryPaymentHistory) {
        throw new ApiError(400, "Salary Payment Added Failed !");
      }

      const bankOutData = {
        bank_id: requestData?.payment_bank_id,
        bank_out_amount: requestData?.pay_amount,
        bank_out_title: "Salary Payment",
        bank_out_ref_no: requestData?.reference_id,
        bank_out_publisher_id: requestData?.payment_publisher_id,
        salary_user_id: requestData?.user_id,
      };
      // create a bank out data
      await postBankOutServices(bankOutData, session);

      // deduct amount from bank account
      await BankModel.updateOne(
        { _id: requestData?.payment_bank_id },
        { $inc: { bank_balance: -requestData?.pay_amount } },
        {
          session,
          runValidators: true,
        }
      );
    } else {
      // deduct amount from cash account
      await CashModel.updateOne(
        {},
        { $inc: { cash_balance: -requestData?.pay_amount } },
        {
          session,
          runValidators: true,
        }
      );
      //   store salary out from cash history
      const sendData: any = {
        supplier_payment_title: "Salary Payment",
        supplier_payment_date: requestData?.payment_date,
        supplier_payment_amount: requestData?.pay_amount,
        supplier_payment_method: "cash",
        supplier_payment_status: "paid",
        transaction_id: invoice_id,
        salary_user_id: requestData?.user_id,
        supplier_payment_publisher_id: requestData?.payment_publisher_id,
      };

      const salaryPaymentHistory: ISupplierPaymentInterface | {} =
        await postSupplierPaymentServices(sendData, session);
      if (!salaryPaymentHistory) {
        throw new ApiError(400, "Salary Payment Added Failed !");
      }
    }

    const salaryFullData = await SalaryModel.findOne({
      _id: requestData?.salary_id,
    }).session(session);
    if (!salaryFullData) {
      throw new ApiError(400, "Salary Not Found !");
    }

    const salaryModelUpdateData: any = {
      received_amount:
        salaryFullData?.received_amount + requestData?.pay_amount,
      due_amount: salaryFullData?.due_amount - requestData?.pay_amount,
      salary_status:
        salaryFullData?.received_amount + requestData?.pay_amount ==
        salaryFullData?.grand_total_amount
          ? "paid"
          : "unpaid",
    };

    const updateSalaryModel = await SalaryModel.updateOne(
      { _id: requestData?.salary_id },
      salaryModelUpdateData,
      {
        session,
        runValidators: true,
      }
    );

    if (updateSalaryModel.modifiedCount == 0) {
      throw new ApiError(400, "Salary Payment Added Failed !");
    }

    // add document in expense collection
    const sendDataInExpenceCreate: any = {
      expense_title: "Salary Payment",
      expense_amount: requestData?.pay_amount,
      salary_user_id: requestData?.user_id,
      expense_publisher_id: requestData?.payment_publisher_id,
      expense_date: new Date()?.toISOString()?.split("T")[0],
    };

    await postExpenseWhenProductStockAddServices(
      sendDataInExpenceCreate,
      session
    );

    // add balance in ledger
    const ledgerData: any = await LedgerModel.findOne({})
      .sort({ _id: -1 })
      .session(session);
    if (ledgerData) {
      const updateLedgerData = {
        ledger_title: "Salary Payment",
        ledger_category: "Expense",
        ledger_debit: requestData?.pay_amount,
        ledger_balance: ledgerData?.ledger_balance - requestData?.pay_amount,
        ledger_publisher_id: requestData?.payment_publisher_id,
      };
      await postLedgerServices(updateLedgerData, session);
    } else {
      const updateLedgerData = {
        ledger_title: "Salary Payment",
        ledger_category: "Expense",
        ledger_debit: requestData?.pay_amount,
        ledger_balance: requestData?.pay_amount,
        ledger_publisher_id: requestData?.payment_publisher_id,
      };
      await postLedgerServices(updateLedgerData, session);
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return sendResponse<ISalaryPaymentInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "SalaryPayment Added Successfully!",
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// Find  dashboardSalaryPayment
export const findDashboardSalaryPayment: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISalaryPaymentInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ISalaryPaymentInterface[] | any =
      await findDashboardSalaryPaymentServices(limitNumber, skip, searchTerm);
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: salaryPaymentSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await SalaryPaymentModel.countDocuments(whereCondition);
    return sendResponse<ISalaryPaymentInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "SalaryPayment Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find a user all SalaryPayment history
export const findAUserAllSalaryPayment: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISalaryPaymentInterface | any> => {
  try {
    const { page, limit, searchTerm, user_id }: any = req.query;
    if (!user_id) {
      throw new ApiError(400, "User id required");
    }
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ISalaryPaymentInterface[] | any =
      await findAUserAllSalaryPaymentServices(
        limitNumber,
        skip,
        searchTerm,
        user_id
      );
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: salaryPaymentSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    andCondition.push({ user_id: user_id });
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await SalaryPaymentModel.countDocuments(whereCondition);
    return sendResponse<ISalaryPaymentInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "SalaryPayment Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find a user all SalaryPayment history in a salary create
export const findAUserAllSalaryPaymentInAInvoice: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISalaryPaymentInterface | any> => {
  try {
    const { page, limit, searchTerm, salary_id }: any = req.query;
    if (!salary_id) {
      throw new ApiError(400, "User id and salary id required");
    }
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ISalaryPaymentInterface[] | any =
      await findAUserAllSalaryPaymentInAInvoiceServices(
        limitNumber,
        skip,
        searchTerm,
        salary_id
      );
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: salaryPaymentSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    andCondition.push({ salary_id: salary_id });
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await SalaryPaymentModel.countDocuments(whereCondition);
    return sendResponse<ISalaryPaymentInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "SalaryPayment Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};
