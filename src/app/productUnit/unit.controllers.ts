import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import {
  IProductUnitInterface,
  productUnitSearchableField,
} from "./unit.interface";
import {
  findAllDashboardProductUnitServices,
  findAllProductUnitServices,
  postProductUnitServices,
  updateProductUnitServices,
} from "./unit.services";
import ProductUnitModel from "./unit.model";

// Add A ProductUnit
export const postProductUnit: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IProductUnitInterface | any> => {
  try {
    const requestData = req.body;
    const checkUnitNameExist = await ProductUnitModel.findOne({
      product_unit_name: requestData.product_unit_name,
    });
    if (checkUnitNameExist) {
      throw new ApiError(400, "Unit Name Already Exist !");
    }
    const result: IProductUnitInterface | {} = await postProductUnitServices(
      requestData
    );
    if (result) {
      return sendResponse<IProductUnitInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "ProductUnit Added Successfully !",
      });
    } else {
      throw new ApiError(400, "ProductUnit Added Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// Find All ProductUnit
export const findAllProductUnit: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IProductUnitInterface | any> => {
  try {
    const result: IProductUnitInterface[] | any =
      await findAllProductUnitServices();
    return sendResponse<IProductUnitInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "ProductUnit Found Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All DashboardroductUnit
export const findAllDashboardProductUnit: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IProductUnitInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IProductUnitInterface[] | any =
      await findAllDashboardProductUnitServices(limitNumber, skip, searchTerm);
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: productUnitSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await ProductUnitModel.countDocuments(whereCondition);
    return sendResponse<IProductUnitInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "ProductUnit Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A ProductUnit
export const updateProductUnit: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IProductUnitInterface | any> => {
  try {
    const requestData = req.body;
    const checkUnitNameExist = await ProductUnitModel.findOne({
      product_unit_name: requestData.product_unit_name,
    });
    if (
      checkUnitNameExist &&
      requestData?._id !== checkUnitNameExist?._id?.toString()
    ) {
      throw new ApiError(400, "Unit Name Already Exist !");
    }
    const result: IProductUnitInterface | any = await updateProductUnitServices(
      requestData,
      requestData?._id
    );
    if (result?.modifiedCount > 0) {
      return sendResponse<IProductUnitInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "ProductUnit Update Successfully !",
      });
    } else {
      throw new ApiError(400, "ProductUnit Update Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};
