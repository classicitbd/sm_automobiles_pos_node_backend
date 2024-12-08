import mongoose, { Types } from "mongoose";
import { ISupplierMoneyAddInterface, supplierMoneyAddSearchableField } from "./supplier_money_add.interface";
import SupplierMoneyAddModel from "./supplier_money_add.model";
import SupplierModel from "../supplier/supplier.model";

// Create A SupplierMoneyAdd
export const postSupplierMoneyAddServices = async (
  data: ISupplierMoneyAddInterface,
  session?: mongoose.ClientSession
): Promise<ISupplierMoneyAddInterface | {}> => {
  const createSupplierMoneyAdd: ISupplierMoneyAddInterface | {} =
    await SupplierMoneyAddModel.create([data], {
      session,
    });
  return createSupplierMoneyAdd;
};

// Find a SupplierMoneyAddHistory
export const findASupplierMoneyAddHistoryServices = async (
  limit: number,
  skip: number,
  searchTerm: any,
  supplier_id: any
): Promise<ISupplierMoneyAddInterface[] | []> => {
  const supplierObjectId = Types.ObjectId.isValid(supplier_id)
    ? { supplier_id: new Types.ObjectId(supplier_id) }
    : { supplier_id };

  const andCondition: any[] = [supplierObjectId];
  if (searchTerm) {
    andCondition.push({
      $or: supplierMoneyAddSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findSupplierMoneyAdd: ISupplierMoneyAddInterface[] | any =
    await SupplierMoneyAddModel.find(whereCondition)
      .populate([
        "supplier_money_product_id",
        "supplier_money_add_publisher_id",
      ])
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");

  const supplierDetails: any = await SupplierModel.findOne({
    _id: supplier_id,
  });
  const sendData: any = {
    MoneyAddHistory: findSupplierMoneyAdd,
    supplierDetails: supplierDetails,
  };

  return sendData;
};