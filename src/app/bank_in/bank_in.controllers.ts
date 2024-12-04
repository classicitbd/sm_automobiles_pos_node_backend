import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { IBankInInterface } from "./bank_in.interface";
import { postBankInServices } from "./bank_in.services";

// Add A BankIn
export const postBankIn: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IBankInInterface | any> => {
  try {
    const requestData = req.body;
    const result: IBankInInterface | {} = await postBankInServices(requestData);
    if (result) {
      return sendResponse<IBankInInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "BankIn Added Successfully !",
      });
    } else {
      throw new ApiError(400, "BankIn Added Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};
