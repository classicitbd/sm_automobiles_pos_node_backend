import ApiError from "../../errors/ApiError";
import {
  customerSearchableField,
  ICustomerInterface,
} from "./customer.interface";
import CustomerModel from "./customer.model";

// Create A Customer
export const postCustomerServices = async (
  data: ICustomerInterface
): Promise<ICustomerInterface | {}> => {
  const createCustomer: ICustomerInterface | {} = await CustomerModel.create(
    data
  );
  return createCustomer;
};

// find all active Customer for a specific publisher
export const findAllActiveCustomerServices = async (customer_publisher_id: string): Promise<
  ICustomerInterface | {}
> => {
  const findCustomer: ICustomerInterface[] | [] = await CustomerModel.find({
    customer_status: "active",
    customer_publisher_id: customer_publisher_id
  });
  return findCustomer;
};

// Find all dashboard Customer
export const findAllDashboardCustomerServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ICustomerInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: customerSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findCustomer: ICustomerInterface[] | [] = await CustomerModel.find(
    whereCondition
  )
    .populate(["customer_publisher_id", "customer_updated_by"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findCustomer;
};

// Update a Customer
export const updateCustomerServices = async (
  data: ICustomerInterface,
  _id: string
): Promise<ICustomerInterface | any> => {
  const updateCustomerInfo: ICustomerInterface | null =
    await CustomerModel.findOne({ _id: _id });
  if (!updateCustomerInfo) {
    throw new ApiError(400, "Customer Not Found !");
  }
  const Customer = await CustomerModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return Customer;
};
