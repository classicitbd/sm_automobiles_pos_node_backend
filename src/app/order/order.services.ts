import mongoose from "mongoose";
import ApiError from "../../errors/ApiError";
import { IOrderInterface, orderSearchableField } from "./order.interface";
import OrderModel from "./order.model";

// Create A Order
export const postOrderServices = async (
  data: IOrderInterface,
  session?: mongoose.ClientSession
): Promise<IOrderInterface | {}> => {
  const createOrder: IOrderInterface | {} = await OrderModel.create([data], {
    session,
  });
  return createOrder;
};

// // find all self order for create a payment
// export const findAllSelfOrderServices = async (
//   order_publisher_id: any
// ): Promise<IOrderInterface[] | []> => {
//   const findAllOrder: IOrderInterface[] | [] = await OrderModel.find({
//     order_publisher_id: order_publisher_id,
//   }).populate([
//     "customer_id",
//     {
//       path: "order_products.product_id",
//       model: "products",
//     },
//   ]);
//   return findAllOrder;
// };

// // find all order
// export const findAllOrderServices = async (): Promise<
//   IOrderInterface[] | []
// > => {
//   const findAllOrder: IOrderInterface[] | [] = await OrderModel.find(
//     {}
//   ).populate([
//     "customer_id",
//     {
//       path: "order_products.product_id",
//       model: "products",
//     },
//   ]);
//   return findAllOrder;
// };

// // Update a Order
// export const findAOrderServices = async (
//   _id: any
// ): Promise<IOrderInterface | any> => {
//   const findAOrder: IOrderInterface | {} | null = await OrderModel.findOne({
//     _id,
//   }).populate([
//     "customer_id",
//     {
//       path: "order_products.product_id",
//       model: "products",
//       populate: [
//         {
//           path: "brand_id",
//           model: "brands",
//         },
//         {
//           path: "category_id", // Corrected typo from "ategory_id" to "category_id"
//           model: "categories",
//         },
//       ],
//     },
//   ]);
//   if (!findAOrder) {
//     throw new ApiError(400, "Order Not Found !");
//   }
//   return findAOrder;
// };

// // Find all dashboard Order
// export const findAllDashboardOrderServices = async (
//   limit: number,
//   skip: number,
//   searchTerm: any
// ): Promise<IOrderInterface[] | []> => {
//   const andCondition = [];
//   if (searchTerm) {
//     andCondition.push({
//       $or: orderSearchableField.map((field) => ({
//         [field]: {
//           $regex: searchTerm,
//           $options: "i",
//         },
//       })),
//     });
//   }
//   const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
//   const findOrder: IOrderInterface[] | [] = await OrderModel.find(
//     whereCondition
//   )
//     .populate([
//       "customer_id",
//       "order_publisher_id",
//       "order_updated_by",
//       {
//         path: "order_products.product_id",
//         model: "products",
//         populate: [
//           {
//             path: "brand_id",
//             model: "brands",
//           },
//           {
//             path: "category_id", // Corrected typo from "ategory_id" to "category_id"
//             model: "categories",
//           },
//         ],
//       },
//     ])
//     .sort({ _id: -1 })
//     .skip(skip)
//     .limit(limit)
//     .select("-__v");
//   return findOrder;
// };

// // Update a Order
// export const updateOrderServices = async (
//   data: IOrderInterface,
//   _id: string,
//   session: mongoose.ClientSession
// ): Promise<IOrderInterface | any> => {
//   const updateOrderInfo: IOrderInterface | null = await OrderModel.findOne({
//     _id: _id,
//   }).session(session);
//   if (!updateOrderInfo) {
//     throw new ApiError(400, "Order Not Found !");
//   }
//   const Order = await OrderModel.updateOne({ _id: _id }, data, {
//     runValidators: true,
//     session,
//   });
//   return Order;
// };
