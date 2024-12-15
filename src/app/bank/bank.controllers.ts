import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { bankSearchableField, IBankInterface } from "./bank.interface";
import {
  findABankServices,
  findAllBankServices,
  findAllDashboardBankServices,
  postBankServices,
  updateBankServices,
} from "./bank.services";
import BankModel from "./bank.model";

// Add A Bank
export const postBank: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IBankInterface | any> => {
  try {
    const requestData = req.body;
    const checkBankExist = await BankModel.findOne({
      account_no: requestData?.account_no,
    });
    if (checkBankExist) {
      throw new ApiError(400, "Bank Account No Already Exist !");
    }
    const result: IBankInterface | {} = await postBankServices(requestData);
    if (result) {
      return sendResponse<IBankInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Bank Added Successfully !",
      });
    } else {
      throw new ApiError(400, "Bank Added Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// Find A Bank
export const findABank: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IBankInterface | any> => {
  try {
    const {_id} = req.params;
    const result: IBankInterface[] | any = await findABankServices(_id);
    return sendResponse<IBankInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Bank Found Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All Bank
export const findAllBank: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IBankInterface | any> => {
  try {
    const result: IBankInterface[] | any = await findAllBankServices();
    return sendResponse<IBankInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Bank Found Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All dashboard Bank
export const findAllDashboardBank: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IBankInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IBankInterface[] | any = await findAllDashboardBankServices(
      limitNumber,
      skip,
      searchTerm
    );
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: bankSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await BankModel.countDocuments(whereCondition);
    return sendResponse<IBankInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Bank Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A Bank
export const updateBank: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IBankInterface | any> => {
  try {
    const requestData = req.body;
    const checkBankExist = await BankModel.findOne({
      account_no: requestData?.account_no,
    });
    if (checkBankExist && requestData?._id !== checkBankExist?._id?.toString()) {
      throw new ApiError(400, "Bank Account No Already Exist !");
    }
    const result: IBankInterface | any = await updateBankServices(
      requestData,
      requestData?._id
    );
    if (result?.modifiedCount > 0) {
      return sendResponse<IBankInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Bank Update Successfully !",
      });
    } else {
      throw new ApiError(400, "Bank Update Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};
