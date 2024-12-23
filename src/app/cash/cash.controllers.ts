import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { ICashInterface } from "./cash.interface";
import {
  findACashServices,
  postCashServices,
  updateCashServices,
} from "./cash.services";
import { postCashBalanceUpdateHistoryServices } from "../cashBalanceUpdateHistory/cashBalanceUpdateHistory.services";
import mongoose from "mongoose";
import LedgerModel from "../ledger/ledger.model";
import { postLedgerServices } from "../ledger/ledger.service";

// Find A Cash
export const findACash: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICashInterface | any> => {
  try {
    const result: ICashInterface | any = await findACashServices();
    return sendResponse<ICashInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Cash Found Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A Cash
export const updateCash: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICashInterface | any> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const requestData = req.body;
    if (!requestData?._id) {
      const createCashAmountdata = await postCashServices(requestData);
      if (createCashAmountdata) {
        // add balance in ledger
        const ledgerData: any = await LedgerModel.findOne({})
          .sort({ _id: -1 })
          .session(session);
        if (ledgerData) {
          const updateLedgerData = {
            ledger_title: "Cash Add",
            ledger_category: "Revenue",
            ledger_credit: requestData?.cash_balance,
            ledger_balance:
              ledgerData?.ledger_balance + requestData?.cash_balance,
            ledger_publisher_id: requestData?.cash_publisher_id,
          };
          await postLedgerServices(updateLedgerData, session);
        } else {
          const updateLedgerData = {
            ledger_title: "Cash Add",
            ledger_category: "Revenue",
            ledger_credit: requestData?.cash_balance,
            ledger_balance: requestData?.cash_balance,
            ledger_publisher_id: requestData?.cash_publisher_id,
          };
          await postLedgerServices(updateLedgerData, session);
        }
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        return sendResponse<ICashInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Cash Create Successfully !",
        });
      } else {
        throw new ApiError(400, "Cash Create Failed !");
      }
    }
    const result: ICashInterface | any = await updateCashServices(
      requestData,
      requestData?._id
    );
    if (result?.modifiedCount > 0) {
      // update price update history
      const priceUpdateHistoryData = {
        previous_balance: requestData?.previous_balance,
        new_balance: requestData?.cash_balance,
        publisher_id: requestData?.cash_updated_by,
      };
      await postCashBalanceUpdateHistoryServices(
        priceUpdateHistoryData,
        session
      );
      // add balance in ledger
      const ledgerData: any = await LedgerModel.findOne({})
        .sort({ _id: -1 })
        .session(session);
      if (ledgerData) {
        const updateLedgerData = {
          ledger_title: "Cash Add",
          ledger_category: "Revenue",
          ledger_credit: (requestData?.cash_balance - requestData?.previous_balance),
          ledger_balance:
            ledgerData?.ledger_balance +
            (requestData?.cash_balance - requestData?.previous_balance),
          ledger_publisher_id: requestData?.cash_updated_by,
        };
        await postLedgerServices(updateLedgerData, session);
      } else {
        throw new ApiError(400, "Ledger Create Failed !");
      }
      // Commit transaction
      await session.commitTransaction();
      session.endSession();
      return sendResponse<ICashInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Cash Update Successfully !",
      });
    } else {
      throw new ApiError(400, "Cash Update Failed !");
    }
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
