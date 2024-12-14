import mongoose from "mongoose";
import ApiError from "../../errors/ApiError";
import { IOrderInterface, orderSearchableField } from "./order.interface";
import OrderModel from "./order.model";
import CustomerModel from "../customer/customer.model";
import ProductModel from "../product/product.model";

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

// Find all ACustomer Order
export const findAllACustomerOrderServices = async (
  limit: number,
  skip: number,
  searchTerm: any,
  customer_id: string
): Promise<IOrderInterface[] | [] | any> => {
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
  andCondition.push({ customer_id: customer_id });
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findOrder: IOrderInterface[] | [] = await OrderModel.find(
    whereCondition
  )
    .populate([
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
  const customerDetails = await CustomerModel.findOne({ _id: customer_id });
  const sendData: any = {
    customerDetails,
    orderDetails: findOrder,
  };
  return sendData;
};

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

// Find all  OrderInAProduct
export const findAllOrderInAProductServices = async (
  limit: number,
  skip: number,
  searchTerm: any,
  product_id: any
): Promise<IOrderInterface[] | [] | any> => {
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
  andCondition.push({ "order_products.product_id": product_id });
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findOrder: IOrderInterface[] | [] = await OrderModel.find(
    whereCondition
  )
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  const productDetails = await ProductModel.findOne({ _id: product_id });
  const sendData: any = {
    productDetails,
    orderDetails: findOrder,
  };
  return sendData;
};

// Find all Profit Order in account
export const findAllProfitOrderServices = async (
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
  andCondition.push({ order_status: "out-of-warehouse" });
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  // Use .lean() here to return plain objects
  const findOrder: IOrderInterface[] | [] = await OrderModel.find(
    whereCondition
  )
    .populate("order_publisher_id")
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v")
    .lean(); // Add lean()

  const calculateProfit = (data: any) => {
    return data?.map((order: any) => {
      let totalProductBuyingPrice = 0;

      order?.order_products.forEach((product: any) => {
        const totalBuyingPrice =
          product?.product_buying_price * product?.product_quantity;
        totalProductBuyingPrice += totalBuyingPrice;
      });

      return {
        ...order,
        profit_amount: order?.grand_total_amount - totalProductBuyingPrice, // Ensure profit is a formatted string
      };
    });
  };

  const updatedData = calculateProfit(findOrder);

  return updatedData;
};

// Find all Management Order
export const findAllManagementOrderServices = async (
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
  andCondition.push({ order_status: "management" });
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findOrder: IOrderInterface[] | [] = await OrderModel.find(
    whereCondition
  )
    .populate([
      "customer_id",
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
// Find all Warehouse Order
export const findAllWarehouseOrderServices = async (
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
  andCondition.push({ order_status: "warehouse" });
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findOrder: IOrderInterface[] | [] = await OrderModel.find(
    whereCondition
  )
    .populate([
      "customer_id",
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
// Find all OutOfWarehouse Order
export const findAllOutOfWarehouseOrderServices = async (
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
  andCondition.push({ order_status: "out-of-warehouse" });
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findOrder: IOrderInterface[] | [] = await OrderModel.find(
    whereCondition
  )
    .populate([
      "customer_id",
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

// find all self order for create a payment
export const findAllSelfOrderServices = async (
  order_publisher_id: any
): Promise<IOrderInterface[] | []> => {
  const findAllOrder: IOrderInterface[] | [] = await OrderModel.find({
    order_publisher_id: order_publisher_id,
  })
    .populate([
      "customer_id",
      {
        path: "order_products.product_id",
        model: "products",
      },
    ])
    .sort({ _id: -1 });
  return findAllOrder;
};

// find all self orderWithPagination for create a payment
export const findAllSelfOrderWithPaginationServices = async (
  limit: number,
  skip: number,
  searchTerm: any,
  order_publisher_id: any
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
  andCondition.push({ order_publisher_id: order_publisher_id });
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const findAllOrder: IOrderInterface[] | [] = await OrderModel.find(
    whereCondition
  )
    .populate([
      "customer_id",
      {
        path: "order_products.product_id",
        model: "products",
      },
    ])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);
  return findAllOrder;
};

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

// find a Order
export const findAOrderServices = async (
  _id: any
): Promise<IOrderInterface | any> => {
  const findAOrder: IOrderInterface | {} | null = await OrderModel.findOne({
    _id,
  }).populate([
    "customer_id",
    "order_publisher_id",
    "order_updated_by",
    {
      path: "order_products.product_id",
      model: "products",
      populate: [
        {
          path: "product_unit_id", // Corrected typo from "ategory_id" to "category_id"
          model: "units",
        },
      ],
    },
  ]);
  if (!findAOrder) {
    throw new ApiError(400, "Order Not Found !");
  }
  return findAOrder;
};

// Update a Order
export const updateOrderServices = async (
  data: IOrderInterface,
  _id: string,
  session: mongoose.ClientSession
): Promise<IOrderInterface | any> => {
  const updateOrderInfo: IOrderInterface | null = await OrderModel.findOne({
    _id: _id,
  }).session(session);
  if (!updateOrderInfo) {
    throw new ApiError(400, "Order Not Found !");
  }
  const Order = await OrderModel.updateOne({ _id: _id }, data, {
    runValidators: true,
    session,
  });
  return Order;
};
