import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { ICashBalanceUpdateHistoryInterface } from "./cashBalanceUpdateHistory.interface";
import { findACashBalanceUpdateHistoryServices } from "./cashBalanceUpdateHistory.services";
import CashBalanceUpdateHistoryModel from "./cashBalanceUpdateHistory.model";

// Find A CashBalanceUpdateHistory
export const findACashBalanceUpdateHistory: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICashBalanceUpdateHistoryInterface | any> => {
  try {
    const { page, limit } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ICashBalanceUpdateHistoryInterface | any =
      await findACashBalanceUpdateHistoryServices(limitNumber, skip);
    const total = await CashBalanceUpdateHistoryModel.countDocuments();
    return sendResponse<ICashBalanceUpdateHistoryInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "CashBalanceUpdateHistory Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};
