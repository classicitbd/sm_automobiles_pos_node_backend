import ApiError from "../../errors/ApiError";
import OrderModel from "../order/order.model";
import UserModel from "../user/user.model";
import {
  ISaleTargetInterface,
  saleTargetSearchableField,
} from "./sale_target.interface";
import SaleTargetModel from "./sale_target.model";

// Create A SaleTarget
export const postSaleTargetServices = async (
  data: ISaleTargetInterface
): Promise<ISaleTargetInterface | {}> => {
  const createSaleTarget: ISaleTargetInterface | {} =
    await SaleTargetModel.create(data);
  return createSaleTarget;
};

// Find all SaleTarget
export const findAllSaleTargetServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ISaleTargetInterface[] | []> => {
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
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findSaleTarget: ISaleTargetInterface[] | [] =
    await SaleTargetModel.find(whereCondition)
      .populate([
        "sale_target_publisher_id",
        "sale_target_updated_by",
        "user_id",
      ])
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");
  return findSaleTarget;
};

// Find a user all SaleTarget
export const findAUserAllSaleTargetServices = async (
  limit: number,
  skip: number,
  searchTerm: any,
  user_id: any
): Promise<ISaleTargetInterface[] | [] | any> => {
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
  andCondition.push({ user_id: user_id });
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findSaleTarget: ISaleTargetInterface[] | [] =
    await SaleTargetModel.find(whereCondition)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");
  return findSaleTarget;
};

// Find a user a SaleTargetReport
export const findAUserASaleTargetReportServices = async (
  limit: number,
  skip: number,
  sale_target_id: any
): Promise<ISaleTargetInterface[] | [] | any> => {
  const saleTargetDetails: any = await SaleTargetModel.findOne({
    _id: sale_target_id,
  })
  if (!saleTargetDetails) throw new ApiError(400, "Sale Target Not Found !");
  const sale_target_start_date = saleTargetDetails?.sale_target_start_date;
  const sale_target_end_date = saleTargetDetails?.sale_target_end_date;
  const findOrderDetails: any = await OrderModel.find({
    order_status: "out-of-warehouse",
    out_of_warehouse_date: {
      $gte: sale_target_start_date, // Start date (inclusive)
      $lte: sale_target_end_date, // End date (inclusive)
    },
    sale_target_id: sale_target_id,
  })
    .skip(skip)
    .limit(limit)
    .select(
      "-__v -updated_at -created_at  -order_barcode_image -order_barcode -order_products"
    );
  return findOrderDetails;
};

// Find a user a SaleTargetDetails
export const findAUserASaleTargetDetailsServices = async (
  sale_target_id: any
): Promise<ISaleTargetInterface[] | [] | any> => {
  const saleTargetDetails: any = await SaleTargetModel.findOne({
    _id: sale_target_id,
  }).populate("user_id");
  return saleTargetDetails;
};

// Update a SaleTarget
export const updateSaleTargetServices = async (
  data: ISaleTargetInterface,
  _id: string
): Promise<ISaleTargetInterface | any> => {
  const updateSaleTargetInfo: ISaleTargetInterface | null =
    await SaleTargetModel.findOne({ _id: _id });
  if (!updateSaleTargetInfo) {
    throw new ApiError(400, "Sale Target Not Found !");
  }
  const SaleTarget = await SaleTargetModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return SaleTarget;
};
