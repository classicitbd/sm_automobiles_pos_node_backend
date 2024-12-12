import mongoose from "mongoose";
import { IProductPriceUpdateHistoryInterface } from "./product_price_update_history.interface";
import ProductPriceUpdateHistoryModel from "./product_price_update_history.model";
import ProductModel from "../product/product.model";

// Create A ProductPriceUpdateHistory
export const postProductPriceUpdateHistoryServices = async (
  data: IProductPriceUpdateHistoryInterface,
  session: mongoose.ClientSession
): Promise<IProductPriceUpdateHistoryInterface | {}> => {
  const createProductPriceUpdateHistory:
    | IProductPriceUpdateHistoryInterface
    | {} = await ProductPriceUpdateHistoryModel.create([data], { session });
  return createProductPriceUpdateHistory;
};

// Find all dashboard ProductPriceUpdateHistory
export const findAllDashboardProductPriceUpdateHistoryServices = async (
  limit: number,
  skip: number,
  product_id: any
): Promise<IProductPriceUpdateHistoryInterface[] | [] | any> => {
  // Start building the query
  const findProductPriceHistory = await ProductPriceUpdateHistoryModel.find({
    product_id: product_id,
  })
    .populate("price_update_publisher_id")
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  const productDetails = await ProductModel.findOne({ _id: product_id }).populate("product_unit_id");

  const sendData = {
    findProductPriceHistory,
    productDetails,
  };

  return sendData;
};
