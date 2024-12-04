import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { brandSearchableField, IBrandInterface } from "./brand.interface";
import BrandModel from "./brand.model";
import {
  findAllBrandServices,
  postBrandServices,
  updateBrandServices,
} from "./brand.services";

// Add A Brand
export const postBrand: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IBrandInterface | any> => {
  try {
    const requestData = req.body;
    const checkBrandNameExist = await BrandModel.findOne({
      brand_name: requestData.brand_name,
    });
    if (checkBrandNameExist) {
      throw new ApiError(400, "Brand Name Already Exist !");
    }
    const result: IBrandInterface | {} = await postBrandServices(requestData);
    if (result) {
      return sendResponse<IBrandInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Brand Added Successfully !",
      });
    } else {
      throw new ApiError(400, "Brand Added Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// Find All Brand
export const findAllBrand: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IBrandInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IBrandInterface[] | any = await findAllBrandServices(
      limitNumber,
      skip,
      searchTerm
    );
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: brandSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await BrandModel.countDocuments(whereCondition);
    return sendResponse<IBrandInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Brand Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A Brand
export const updateBrand: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IBrandInterface | any> => {
  try {
    const requestData = req.body;
    const checkBrandNameExist = await BrandModel.findOne({
      brand_name: requestData.brand_name,
    });
    if (
      checkBrandNameExist &&
      requestData?._id !== checkBrandNameExist?._id?.toString()
    ) {
      throw new ApiError(400, "Brand Name Already Exist !");
    }
    const result: IBrandInterface | any = await updateBrandServices(
      requestData,
      requestData?._id
    );
    if (result?.modifiedCount > 0) {
      return sendResponse<IBrandInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Brand Update Successfully !",
      });
    } else {
      throw new ApiError(400, "Brand Update Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};
