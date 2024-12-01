import mongoose from "mongoose";
import ApiError from "../../errors/ApiError";
import { customerDueSearchableField, ICustomerDueInterface } from "./customer_due.interface";
import CustomerDueModel from "./customer_due.model";

// Create A CustomerDue
export const postCustomerDueServices = async (
  data: ICustomerDueInterface
): Promise<ICustomerDueInterface | {}> => {
  const createCustomerDue: ICustomerDueInterface | {} = await CustomerDueModel.create(
    data
  );
  return createCustomerDue;
};

// update customer due when order placed
export const postCustomerDueWhenOrderServices = async (
  data: ICustomerDueInterface | any,
  session?: mongoose.ClientSession
): Promise<ICustomerDueInterface | {}> => {
  const createOrder: ICustomerDueInterface | {} = await CustomerDueModel.create([data], { session });
  return createOrder;
};

// Find all dashboard CustomerDue
export const findAllDashboardCustomerDueServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ICustomerDueInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: customerDueSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findCustomerDue: ICustomerDueInterface[] | [] = await CustomerDueModel.find(
    whereCondition
  )
  .populate(["customer_due_publisher_id", "customer_due_updated_by"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findCustomerDue;
};

// Update a CustomerDue
export const updateCustomerDueServices = async (
  data: ICustomerDueInterface,
  _id: string
): Promise<ICustomerDueInterface | any> => {
  const updateCustomerDueInfo: ICustomerDueInterface | null =
    await CustomerDueModel.findOne({ _id: _id });
  if (!updateCustomerDueInfo) {
    throw new ApiError(400, "Customer Not Found !");
  }
  const CustomerDue = await CustomerDueModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return CustomerDue;
};
