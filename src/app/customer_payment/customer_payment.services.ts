import mongoose from "mongoose";
import ApiError from "../../errors/ApiError";
import { customerPaymentSearchableField, ICustomerPaymentInterface } from "./customer_payment.interface";
import CustomerPaymentModel from "./customer_payment.model";

// Create A CustomerPayment
export const postCustomerPaymentServices = async (
  data: ICustomerPaymentInterface
): Promise<ICustomerPaymentInterface | {}> => {
  const createCustomerPayment: ICustomerPaymentInterface | {} = await CustomerPaymentModel.create(
    data
  );
  return createCustomerPayment;
};

// // update customer Payment when order placed
// export const postCustomerPaymentWhenOrderServices = async (
//   data: ICustomerPaymentInterface | any,
//   session?: mongoose.ClientSession
// ): Promise<ICustomerPaymentInterface | {}> => {
//   const createOrder: ICustomerPaymentInterface | {} = await CustomerPaymentModel.create([data], { session });
//   return createOrder;
// };

// Find all dashboard CustomerPayment
export const findAllDashboardCustomerPaymentServices = async (
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

// Update a CustomerPayment
export const updateCustomerPaymentServices = async (
  data: ICustomerPaymentInterface,
  _id: string
): Promise<ICustomerPaymentInterface | any> => {
  const updateCustomerPaymentInfo: ICustomerPaymentInterface | null =
    await CustomerPaymentModel.findOne({ _id: _id });
  if (!updateCustomerPaymentInfo) {
    throw new ApiError(400, "Customer Not Found !");
  }
  const CustomerPayment = await CustomerPaymentModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return CustomerPayment;
};
