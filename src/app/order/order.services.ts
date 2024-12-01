import mongoose from "mongoose";
import ApiError from "../../errors/ApiError";
import { IOrderInterface, orderSearchableField } from "./order.interface";
import OrderModel from "./order.model";

// Create A Order
export const postOrderServices = async (
  data: IOrderInterface,
  session?: mongoose.ClientSession
): Promise<IOrderInterface | {}> => {
  const createOrder: IOrderInterface | {} = await OrderModel.create([data], { session });
  return createOrder;
};
// export const postOrderServices = async (
//   data: IOrderInterface
// ): Promise<IOrderInterface | {}> => {
//   const createOrder: IOrderInterface | {} = await OrderModel.create(data);
//   return createOrder;
// };

// Find all dashboard Order
export const findAllDashboardOrderServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<IOrderInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: orderSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findOrder: IOrderInterface[] | [] = await OrderModel.find(
    whereCondition
  )
    .populate([
      "customer_id",
      "partial_payment_bank_id",
      "order_publisher_id",
      "order_updated_by",
      {
        path: "order_products.product_id",
        model: "products",
        populate: [
          {
            path: "brand_id",
            model: "brands",
          },
          {
            path: "category_id", // Corrected typo from "ategory_id" to "category_id"
            model: "categories",
          },
        ],
      },
    ])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findOrder;
};

// Update a Order
export const updateOrderServices = async (
  data: IOrderInterface,
  _id: string
): Promise<IOrderInterface | any> => {
  const updateOrderInfo: IOrderInterface | null = await OrderModel.findOne({
    _id: _id,
  });
  if (!updateOrderInfo) {
    throw new ApiError(400, "Order Not Found !");
  }
  const Order = await OrderModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return Order;
};
