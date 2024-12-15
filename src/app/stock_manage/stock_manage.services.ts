import mongoose, { Types } from "mongoose";
import {
  IStockManageInterface,
  stockManageSearchableField,
} from "./stock_manage.interface";
import StockManageModel from "./stock_manage.model";
import ProductModel from "../product/product.model";
import SupplierModel from "../supplier/supplier.model";

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
    .populate(["stock_publisher_id", "supplier_id"])
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

// Find A Supplier all stock
export const findASupplierAllStockDetailsServices = async (
  limit: number,
  skip: number,
  searchTerm: any,
  supplier_id: any
): Promise<any> => {
  const productObjectId = Types.ObjectId.isValid(supplier_id)
    ? { supplier_id: new Types.ObjectId(supplier_id) }
    : { supplier_id };

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
    .populate(["stock_publisher_id", "product_id"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  const supplierDetails: any = await SupplierModel.findOne({
    _id: productObjectId?.supplier_id,
  });
  const sendata = {
    stockDetails: findStockManage,
    supplierDetails: supplierDetails,
  };
  return sendata;
};

// Find A Supplier all stockInvoice
export const findASupplierAllStockInvoiceServices = async (
  supplier_id: any
): Promise<any> => {
  const productObjectId = Types.ObjectId.isValid(supplier_id)
    ? { supplier_id: new Types.ObjectId(supplier_id) }
    : { supplier_id };
  const findStockManage: any = await StockManageModel.find(productObjectId)
    .sort({ _id: -1 })
    .select("-__v");
  return findStockManage;
};

// Find allDashboard stock
export const findAllDashboardStockDetailsServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<any> => {
  const andCondition: any[] = [];
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
    .populate(["stock_publisher_id", "product_id", "supplier_id"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findStockManage;
};

// Find allAP stock
export const findAllAPStockDetailsServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<any> => {
  const andCondition: any[] = [];
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
  andCondition.push({ payment_status: "unpaid" });

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findStockManage: any = await StockManageModel.find(whereCondition)
    .populate(["stock_publisher_id", "product_id", "supplier_id"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findStockManage;
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
