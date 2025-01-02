import mongoose from "mongoose";
import {
  ISalaryPaymentInterface,
  salaryPaymentSearchableField,
} from "./salaryPayment.interface";
import SalaryPaymentModel from "./salaryPayment.model";

// Create A SalaryPayment
export const postSalaryPaymentServices = async (
  data: ISalaryPaymentInterface,
  session: mongoose.ClientSession
): Promise<ISalaryPaymentInterface | {}> => {
  const createsalaryPayment: ISalaryPaymentInterface | {} =
    await SalaryPaymentModel.create([data], {
      session,
    });
  return createsalaryPayment;
};

// Find Dashboard salaryPayment
export const findDashboardSalaryPaymentServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ISalaryPaymentInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: salaryPaymentSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findsalaryPayment: ISalaryPaymentInterface[] | [] =
    await SalaryPaymentModel.find(whereCondition)
      .populate([
        "payment_publisher_id",
        "payment_updated_by",
        "user_id",
        "payment_bank_id",
        "salary_id",
      ])
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");
  return findsalaryPayment;
};

// Find a user all salaryPayment
export const findAUserAllSalaryPaymentServices = async (
  limit: number,
  skip: number,
  searchTerm: any,
  user_id: any
): Promise<ISalaryPaymentInterface[] | [] | any> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: salaryPaymentSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  andCondition.push({ user_id: user_id });
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findsalaryPayment: ISalaryPaymentInterface[] | [] =
    await SalaryPaymentModel.find(whereCondition)
      .populate([
        "payment_publisher_id",
        "payment_updated_by",
        "payment_bank_id",
      ])
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");
  return findsalaryPayment;
};

// Find a user all salaryPaymentInAInvoice
export const findAUserAllSalaryPaymentInAInvoiceServices = async (
  limit: number,
  skip: number,
  searchTerm: any,
  salary_id: any
): Promise<ISalaryPaymentInterface[] | [] | any> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: salaryPaymentSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  andCondition.push({ salary_id: salary_id });
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findsalaryPayment: ISalaryPaymentInterface[] | [] =
    await SalaryPaymentModel.find(whereCondition)
      .populate([
        "payment_publisher_id",
        "payment_updated_by",
        "payment_bank_id",
      ])
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");
  return findsalaryPayment;
};
