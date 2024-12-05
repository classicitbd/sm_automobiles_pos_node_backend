import mongoose, { Types } from "mongoose";
import {
  IStockManageInterface,
  stockManageSearchableField,
} from "./stock_manage.interface";
import StockManageModel from "./stock_manage.model";
import ProductModel from "../product/product.model";

// Create A StockManage
export const postStockManageServices = async (
  data: IStockManageInterface,
  session?: mongoose.ClientSession
): Promise<IStockManageInterface | {}> => {
  const createStockManage: IStockManageInterface | {} =
    await StockManageModel.create([data], { session });
  return createStockManage;
};

// Find all stock in a product
export const findAllStockDetailsInAProductServices = async (
  limit: number,
  skip: number,
  searchTerm: any,
  product_id: any
): Promise<any> => {
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

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findStockManage: any = await StockManageModel.find(whereCondition)
    .populate(["stock_publisher_id", "stock_updated_by"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  const productDetails: any = await ProductModel.findOne({
    _id: productObjectId?.product_id,
  });
  const senddata = {
    stockDetails: findStockManage,
    productDetails: productDetails,
  };
  return senddata;
};

// Update a StockManage
export const updateStockManageServices = async (
  data: IStockManageInterface,
  _id: string
): Promise<IStockManageInterface | any> => {
  const updateStockManageInfo: IStockManageInterface | null =
    await StockManageModel.findOne({
      _id: _id,
    });
  if (!updateStockManageInfo) {
    return {};
  }
  const StockManage = await StockManageModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return StockManage;
};
