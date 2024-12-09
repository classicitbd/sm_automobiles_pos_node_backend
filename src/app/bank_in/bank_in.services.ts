import mongoose from "mongoose";
import { bankInSearchableField, IBankInInterface } from "./bank_in.interface";
import BankInModel from "./bank_in.model";
import BankModel from "../bank/bank.model";

// Create A BankIn
export const postBankInServices = async (
  data: any,
  session: mongoose.ClientSession
): Promise<IBankInInterface | {}> => {
  const createBankIn: IBankInInterface | {} = await BankInModel.create([data], {
    session,
  });
  return createBankIn;
};


// Find all BankIn data For A specific Bank
export const findAllBankInDataForABankServices = async (
  limit: number,
  skip: number,
  searchTerm: any,
  bank_id: any
): Promise<IBankInInterface[] | [] | any> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: bankInSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  andCondition.push({ bank_id: bank_id });
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findBankIn: IBankInInterface[] | [] = await BankInModel.find(
    whereCondition
  )
    .populate(["bank_id", "bank_in_publisher_id", "bank_in_updated_by", "customer_id"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  const bankDetails: any = await BankModel.findOne({ _id: bank_id });
  const sendData = {
    bankDetails: bankDetails,
    bankInData: findBankIn,
  }
  return sendData;
};