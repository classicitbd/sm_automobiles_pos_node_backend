import mongoose from "mongoose";
import { customerPaymentSearchableField, ICustomerPaymentInterface } from "./customer_payment.interface";
import CustomerPaymentModel from "./customer_payment.model";

// Create A CustomerPayment
export const postCustomerPaymentServices = async (
  data: any,
  session: mongoose.ClientSession
): Promise<ICustomerPaymentInterface | {}> => {
  const createCustomerPayment: ICustomerPaymentInterface | {} = await CustomerPaymentModel.create(
    [data],
    { session }
  );
  return createCustomerPayment;
};

// Find a CustomerPayment history
export const findACustomerPaymentHistoryServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ICustomerPaymentInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: customerPaymentSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findCustomerPayment: ICustomerPaymentInterface[] | [] = await CustomerPaymentModel.find(
    whereCondition
  )
    .populate(["customer_payment_publisher_id", "customer_payment_updated_by"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findCustomerPayment;
};
