import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { IBankBalanceUpdateHistoryInterface } from "./bankBalanceUpdateHistory.interface";
import { findABankBalanceUpdateHistoryServices } from "./bankBalanceUpdateHistory.services";
import BankBalanceUpdateHistoryModel from "./bankBalanceUpdateHistory.model";

// Find A BankBalanceUpdateHistory
export const findABankBalanceUpdateHistory: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IBankBalanceUpdateHistoryInterface | any> => {
  try {
    const { page, limit, bank_id } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IBankBalanceUpdateHistoryInterface | any =
      await findABankBalanceUpdateHistoryServices(limitNumber, skip, bank_id);
    const total = await BankBalanceUpdateHistoryModel.countDocuments();
    return sendResponse<IBankBalanceUpdateHistoryInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "BankBalanceUpdateHistory Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};
