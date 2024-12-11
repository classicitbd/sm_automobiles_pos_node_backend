import ApiError from "../../errors/ApiError";
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
      .populate([
        "sale_target_publisher_id",
        "sale_target_updated_by",
        "user_id",
      ])
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");
  const userdetails = await UserModel.findOne({ _id: user_id });
  const sendData = {
    findSaleTarget: findSaleTarget,
    userdetails: userdetails,
  };
  return sendData;
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
