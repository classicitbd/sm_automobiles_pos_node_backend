import mongoose from "mongoose";
import {
  bankOutSearchableField,
  IBankOutInterface,
} from "./bank_out.interface";
import BankOutModel from "./bank_out.model";
import BankModel from "../bank/bank.model";

// Create A BankOut
export const postBankOutServices = async (
  data: IBankOutInterface,
  session?: mongoose.ClientSession
): Promise<IBankOutInterface | {}> => {
  const createBankOut: IBankOutInterface | {} = await BankOutModel.create(
    [data],
    {
      session,
    }
  );
  return createBankOut;
};

// Find all BankOut data For A specific Bank
export const findAllBankOutDataForABankServices = async (
  limit: number,
  skip: number,
  searchTerm: any,
  bank_id: any
): Promise<IBankOutInterface[] | [] | any> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: bankOutSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  andCondition.push({ bank_id: bank_id });
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findBankOut: IBankOutInterface[] | [] = await BankOutModel.find(
    whereCondition
  )
    .populate(["bank_id", "bank_out_publisher_id", "bank_out_updated_by"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findBankOut;
};
