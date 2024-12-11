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
  findAUserAllSaleTargetServices,
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
    const { user_id, sale_target_start_date, sale_target_end_date } = requestData;

    // Ensure dates are properly parsed
    const targetStartDate = new Date(sale_target_start_date);
    const targetEndDate = new Date(sale_target_end_date);

    if (targetStartDate > targetEndDate) {
      throw new ApiError(400, "Start date cannot be after end date.");
    }

    // Check if any existing target overlaps with the given range
    const checkSaleTargetWithThisUserExist = await SaleTargetModel.findOne({
      user_id,
      $or: [
        // Case 1: Existing target starts within the new range
        {
          sale_target_start_date: {
            $lte: targetEndDate.toISOString(),
            $gte: targetStartDate.toISOString(),
          },
        },
        // Case 2: Existing target ends within the new range
        {
          sale_target_end_date: {
            $lte: targetEndDate.toISOString(),
            $gte: targetStartDate.toISOString(),
          },
        },
        // Case 3: Existing target completely overlaps the new range
        {
          $and: [
            {
              sale_target_start_date: { $lte: targetStartDate.toISOString() },
            },
            {
              sale_target_end_date: { $gte: targetEndDate.toISOString() },
            },
          ],
        },
      ],
    });

    if (checkSaleTargetWithThisUserExist) {
      throw new ApiError(
        400,
        "Sale Target for this user already exists for the current month!"
      );
    }

    // Proceed to add the new sale target
    const result: ISaleTargetInterface | {} = await postSaleTargetServices(
      requestData
    );
    if (result) {
      return sendResponse<ISaleTargetInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Sale Target Added Successfully!",
      });
    } else {
      throw new ApiError(400, "Failed to add Sale Target!");
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

// Find AUserAll SaleTarget
export const findAUserAllSaleTarget: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISaleTargetInterface | any> => {
  try {
    const { page, limit, searchTerm, user_id }: any = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ISaleTargetInterface[] | any =
      await findAUserAllSaleTargetServices(
        limitNumber,
        skip,
        searchTerm,
        user_id
      );
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
    andCondition.push({ user_id });
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
