import mongoose from "mongoose";
import { IIncomeInterface, incomeSearchableField } from "./income.interface";
import IncomeModel from "./income.model";

// Create A Income
export const postIncomeWhenCustomerPaymentAddServices = async (
  data: any,
  session: mongoose.ClientSession
): Promise<IIncomeInterface | {}> => {
  const createIncome: IIncomeInterface | {} = await IncomeModel.create([data], {
    session,
  });
  return createIncome;
};

// Find all  Income
export const findAllIncomeServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<IIncomeInterface[] | []> => {
  const andCondition: any[] = [];
  if (searchTerm) {
    andCondition.push({
      $or: incomeSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findIncome: IIncomeInterface[] | [] = await IncomeModel.find(
    whereCondition
  )
    .populate(["income_customer_id", "income_order_id", "income_publisher_id"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findIncome;
};
