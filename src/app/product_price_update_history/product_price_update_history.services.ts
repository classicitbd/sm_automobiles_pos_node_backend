import mongoose from "mongoose";
import { IProductPriceUpdateHistoryInterface } from "./product_price_update_history.interface";
import ProductPriceUpdateHistoryModel from "./product_price_update_history.model";

// Create A ProductPriceUpdateHistory
export const postProductPriceUpdateHistoryServices = async (
    data: IProductPriceUpdateHistoryInterface,
    session: mongoose.ClientSession
): Promise<IProductPriceUpdateHistoryInterface | {}> => {
    const createProductPriceUpdateHistory: IProductPriceUpdateHistoryInterface | {} =
        await ProductPriceUpdateHistoryModel.create([data], { session });
    return createProductPriceUpdateHistory;
};