import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import {
  ISaleTargetInterface,
  saleTargetSearchableField,
} from "./sale_target.interface";
import SaleTargetModel from "./sale_target.model";
import {
  findAllSaleTargetServices,
  postSaleTargetServices,
  updateSaleTargetServices,
} from "./sale_targert.services";

// Add A SaleTarget
export const postSaleTarget: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISaleTargetInterface | any> => {
  try {
    const requestData = req.body;
    const { user_id } = requestData;
    // Get the first and last day of the current month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    
    const checkSaleTargetWithThisUserExist = await SaleTargetModel.findOne({
      user_id,
      $or: [
        {
          sale_target_start_date: {
            $gte: startOfMonth.toISOString(),
            $lte: endOfMonth.toISOString(),
          },
        },
        {
          sale_target_end_date: {
            $gte: startOfMonth.toISOString(),
            $lte: endOfMonth.toISOString(),
          },
        },
        {
          $and: [
            {
              sale_target_start_date: { $lte: startOfMonth.toISOString() },
            },
            {
              sale_target_end_date: { $gte: endOfMonth.toISOString() },
            },
          ],
        },
      ],
    });
    
    if (checkSaleTargetWithThisUserExist) {
      throw new ApiError(400, "Sale Target for this user already exists for the current month!");
    }
    
    const result: ISaleTargetInterface | {} = await postSaleTargetServices(
      requestData
    );
    if (result) {
      return sendResponse<ISaleTargetInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Sale Target Added Successfully !",
      });
    } else {
      throw new ApiError(400, "Sale Target Added Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// Find All SaleTarget
export const findAllSaleTarget: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISaleTargetInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ISaleTargetInterface[] | any =
      await findAllSaleTargetServices(limitNumber, skip, searchTerm);
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: saleTargetSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await SaleTargetModel.countDocuments(whereCondition);
    return sendResponse<ISaleTargetInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "SaleTarget Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A SaleTarget
export const updateSaleTarget: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISaleTargetInterface | any> => {
  try {
    const requestData = req.body;
    const result: ISaleTargetInterface | any = await updateSaleTargetServices(
      requestData,
      requestData?._id
    );
    if (result?.modifiedCount > 0) {
      return sendResponse<ISaleTargetInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "SaleTarget Update Successfully !",
      });
    } else {
      throw new ApiError(400, "SaleTarget Update Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};
