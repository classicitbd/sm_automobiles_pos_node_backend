import { NextFunction, Request, RequestHandler, Response } from "express";
import { findAllDashboardProductPriceUpdateHistoryServices } from "./product_price_update_history.services";
import { IProductPriceUpdateHistoryInterface } from "./product_price_update_history.interface";
import ProductPriceUpdateHistoryModel from "./product_price_update_history.model";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

// Find All dashboard ProductPriceUpdateHistory
export const findAllDashboardProductPriceUpdateHistory: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IProductPriceUpdateHistoryInterface | any> => {
  try {
    const { page, limit, product_id } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IProductPriceUpdateHistoryInterface[] | any =
      await findAllDashboardProductPriceUpdateHistoryServices(
        limitNumber,
        skip,
        product_id
      );
    const total = await ProductPriceUpdateHistoryModel.countDocuments({
      product_id: product_id,
    });
    return sendResponse<IProductPriceUpdateHistoryInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "product price history Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};
