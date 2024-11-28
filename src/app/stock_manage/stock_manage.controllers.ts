import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import {
  IStockManageInterface,
  stockManageSearchableField,
} from "./stock_manage.interface";
import {
  findAllStockDetailsInAProductServices,
  postStockManageServices,
  updateStockManageServices,
} from "./stock_manage.services";
import { Types } from "mongoose";
import StockManageModel from "./stock_manage.model";
import ProductModel from "../product/product.model";

// Add A StockManage
export const postStockManage: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IStockManageInterface | any> => {
  try {
    const requestData = req.body;
    const product_id = requestData?.product_id;
    const result: IStockManageInterface | {} = await postStockManageServices(
      requestData
    );
    if (result) {
      const productObjectId = Types.ObjectId.isValid(product_id)
        ? new Types.ObjectId(product_id)
        : product_id;
      await ProductModel.updateOne(
        { _id: productObjectId },
        {
          $inc: { product_quantity: parseFloat(requestData?.product_quantity) },
          $set: {
            product_updated_by: requestData?.stock_publisher_id,
            product_buying_price: parseFloat(requestData?.product_buying_price),
            product_price: parseFloat(requestData?.product_selling_price),
          },
        }
      );
      return sendResponse<IStockManageInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Stock Added Successfully !",
      });
    } else {
      throw new ApiError(400, "Stock Added Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// Find All dashboard StockManage
export const findAllStockDetailsInAProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IStockManageInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const product_id = req.params.product_id;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IStockManageInterface[] | any =
      await findAllStockDetailsInAProductServices(
        limitNumber,
        skip,
        searchTerm,
        product_id
      );
    const productObjectId = Types.ObjectId.isValid(product_id)
      ? { product_id: new Types.ObjectId(product_id) }
      : { product_id };

    const andCondition: any[] = [productObjectId];
    if (searchTerm) {
      andCondition.push({
        $or: stockManageSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await StockManageModel.countDocuments(whereCondition);
    return sendResponse<IStockManageInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "StockManage Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A StockManage
export const updateStockManage: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IStockManageInterface | any> => {
  try {
    const requestData = req.body;
    const result: IStockManageInterface | any = await updateStockManageServices(
      requestData,
      requestData?._id
    );
    if (result?.modifiedCount > 0) {
      return sendResponse<IStockManageInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Stock Update Successfully !",
      });
    } else {
      throw new ApiError(400, "Stock Update Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};
