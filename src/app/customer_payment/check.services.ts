import mongoose from "mongoose";
import { checkSearchableField, ICheckInterface } from "./check.interface";
import CheckModel from "./check.model";
import CustomerModel from "../customer/customer.model";

// Create A Check
export const postCheckServices = async (
  data: ICheckInterface
): Promise<ICheckInterface | {}> => {
  const createCheck: ICheckInterface | {} = await CheckModel.create(data);
  return createCheck;
};

// Find all ACustomer Check
export const findAllACustomerCheckServices = async (
  limit: number,
  skip: number,
  searchTerm: any,
  customer_id: string
): Promise<ICheckInterface[] | [] | any> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: checkSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  andCondition.push({ customer_id: customer_id });
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findCheck: ICheckInterface[] | [] = await CheckModel.find(
    whereCondition
  )
    .populate([
      {
        path: "order_id",
        populate: {
          path: "order_products.product_id",
          model: "products",
          // Optionally, you can select specific fields from the product schema
          select: "product_name product_id", // Example fields
        },
      },
      { path: "bank_id", model: "banks" }, // Ensure you reference the correct model
      { path: "check_publisher_id", model: "users" },
      { path: "check_updated_by", model: "users" },
    ])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  const customerDetails: any = await CustomerModel.findOne({ _id: customer_id });
  const sendData = { checkDetails: findCheck, customerDetails };
  return sendData;
};


// Find all dashboard Check
export const findAllDashboardCheckServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ICheckInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: checkSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findCheck: ICheckInterface[] | [] = await CheckModel.find(
    whereCondition
  )
    .populate([
      "order_id",
      "customer_id",
      "bank_id",
      "check_publisher_id",
      "check_approved_by",
      "check_updated_by",
    ])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findCheck;
};

// Find all Duedashboard Check
export const findAllDueDashboardCheckServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ICheckInterface[] | []> => {

  const todayDate = new Date().toISOString().split("T")[0];

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const searchCondition = searchTerm
    ? {
      $or: checkSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    }
    : {};

  const findCheck: ICheckInterface[] | [] = await CheckModel.find({
    $and: [
      searchCondition,
      {
        $or: [
          // For "check" payment method: Exclude today's `check_withdraw_date`
          {
            $and: [
              { payment_method: "check" },
              { check_withdraw_date: { $lt: todayDate } },
            ],
          },
          // For other payment methods: Exclude today's `createdAt`
          {
            $and: [
              { payment_method: { $ne: "check" } },
              { createdAt: { $lt: startOfDay } },
            ],
          },
        ],
      },
    ],
  })
    .populate([
      "order_id",
      "customer_id",
      "bank_id",
      "check_publisher_id",
      "check_approved_by",
      "check_updated_by",
    ])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");

  return findCheck;
};


// Find all Todaydashboard Check
export const findAllTodayDashboardCheckServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ICheckInterface[] | []> => {
  const todayDate = new Date().toISOString().split("T")[0];

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Build search term condition
  const searchCondition = searchTerm
    ? {
      $or: checkSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    }
    : {};

  // Query with conditional logic based on `payment_method`
  const findCheck: ICheckInterface[] | [] = await CheckModel.find({
    $and: [
      searchCondition,
      {
        $or: [
          // If `payment_method` is "check", filter by `check_withdraw_date` equal to today
          {
            $and: [
              { payment_method: "check" },
              { check_withdraw_date: todayDate },
            ],
          },
          // Otherwise, filter by `createdAt` within today's date range
          {
            $and: [
              { payment_method: { $ne: "check" } },
              {
                createdAt: { $gte: startOfDay, $lte: endOfDay },
              },
            ],
          },
        ],
      },
    ],
  })
    .populate([
      "order_id",
      "customer_id",
      "bank_id",
      "check_publisher_id",
      "check_approved_by",
      "check_updated_by",
    ])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");

  return findCheck;
};


// export const findAllTodayDashboardCheckServices = async (
//   limit: number,
//   skip: number,
//   searchTerm: any
// ): Promise<ICheckInterface[] | []> => {
//   const todayDate = new Date().toISOString().split("T")[0];
//   const andCondition: any = [{ check_withdraw_date: todayDate }];
//   if (searchTerm) {
//     andCondition.push({
//       $or: checkSearchableField.map((field) => ({
//         [field]: {
//           $regex: searchTerm,
//           $options: "i",
//         },
//       })),
//     });
//   }
//   const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
//   const findCheck: ICheckInterface[] | [] = await CheckModel.find(
//     whereCondition
//   )
//     .populate([
//       "order_id",
//       "customer_id",
//       "bank_id",
//       "check_publisher_id",
//       "check_approved_by",
//       "check_updated_by",
//     ])
//     .sort({ _id: -1 })
//     .skip(skip)
//     .limit(limit)
//     .select("-__v");
//   return findCheck;
// };

// Update a Check
export const updateCheckServices = async (
  data: any,
  _id: string,
  session: mongoose.ClientSession
): Promise<ICheckInterface | any> => {
  const updateCheckInfo: ICheckInterface | null = await CheckModel.findOne({
    _id: _id,
  }).session(session);
  if (!updateCheckInfo) {
    return {};
  }
  const Check = await CheckModel.updateOne({ _id: _id }, data, {
    session,
    runValidators: true,
  });
  return Check;
};
