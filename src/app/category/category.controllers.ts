import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  categorySearchableField,
  ICategoryInterface,
} from "./category.interface";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import {
  findAllCategoryServices,
  postCategoryServices,
  updateCategoryServices,
} from "./category.services";
import ApiError from "../../errors/ApiError";
import CategoryModel from "./category.model";

// Add A Category
export const postCategory: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICategoryInterface | any> => {
  try {
    const requestData = req.body;
    const checkCategoryNameExist = await CategoryModel.findOne({
      category_name: requestData.category_name,
    });
    if (checkCategoryNameExist) {
      throw new ApiError(400, "Category Name Already Exist !");
    }
    const result: ICategoryInterface | {} = await postCategoryServices(
      requestData
    );
    if (result) {
      return sendResponse<ICategoryInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category Added Successfully !",
      });
    } else {
      throw new ApiError(400, "Category Added Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// Find All Category
export const findAllCategory: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICategoryInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ICategoryInterface[] | any = await findAllCategoryServices(
      limitNumber,
      skip,
      searchTerm
    );
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: categorySearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await CategoryModel.countDocuments(whereCondition);
    return sendResponse<ICategoryInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Category Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A Category
export const updateCategory: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICategoryInterface | any> => {
  try {
    const requestData = req.body;
    const checkCategoryNameExist = await CategoryModel.findOne({
      category_name: requestData.category_name,
    });
    if (
      checkCategoryNameExist &&
      requestData?._id !== checkCategoryNameExist?._id.toString()
    ) {
      throw new ApiError(400, "Category Name Already Exist !");
    }
    const result: ICategoryInterface | any = await updateCategoryServices(
      requestData,
      requestData?._id
    );
    if (result?.modifiedCount > 0) {
      return sendResponse<ICategoryInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category Update Successfully !",
      });
    } else {
      throw new ApiError(400, "Category Update Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};
