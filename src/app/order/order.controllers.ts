import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { IOrderInterface, orderSearchableField } from "./order.interface";
import {
  findAllDashboardOrderServices,
  findAllOrderServices,
  findAllSelfOrderServices,
  findAOrderServices,
  postOrderServices,
  updateOrderServices,
} from "./order.services";
import OrderModel from "./order.model";
import CustomerModel from "../customer/customer.model";
import mongoose from "mongoose";
import {
  generateBarcodeImage,
  generateOrderId,
  handleDuePayment,
  handleProductQuantity,
  handleReturnOrCancelOrderIncrementProductQuantity,
} from "./order.helpers";

// Find All self Order for create a payment
export const findAllSelfOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const { order_publisher_id } = req.params;
    const result: IOrderInterface[] | any = await findAllSelfOrderServices(order_publisher_id);
    return sendResponse<IOrderInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order Found Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All Order
export const findAllOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const result: IOrderInterface[] | any = await findAllOrderServices();
    return sendResponse<IOrderInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order Found Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Add A Order
export const postOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      customer_id,
      grand_total_amount,
      order_products,
      order_publisher_id,
    } = req.body;

    // Validate customer existence
    const findCustomer = await CustomerModel.findById(customer_id).session(
      session
    );
    if (!findCustomer) {
      throw new ApiError(400, "Customer Not Found!");
    }

    // Generate order ID and add to request data
    const order_id = await generateOrderId();
    req.body.order_id = order_id;
    req.body.order_barcode = order_id;
    req.body.order_barcode_image = await generateBarcodeImage(order_id);

    // Save order in database
    const result = await postOrderServices(req.body, session);
    if (!result) {
      throw new ApiError(400, "Order Addition Failed!");
    }

    // modify product quantity
    await handleProductQuantity(order_products, session);

    // handle customer due add
    await handleDuePayment(
      customer_id,
      grand_total_amount,
      findCustomer,
      session,
      order_publisher_id
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Send response
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order Added Successfully!",
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// Find A Order
export const findAOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const { _id } = req.params;
    if (!_id) {
      throw new ApiError(400, "ID Not Found !");
    }
    const result: IOrderInterface | any = await findAOrderServices(_id);
    return sendResponse<IOrderInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order Found Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All dashboard Order
export const findAllDashboardOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IOrderInterface[] | any = await findAllDashboardOrderServices(
      limitNumber,
      skip,
      searchTerm
    );
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
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await OrderModel.countDocuments(whereCondition);
    return sendResponse<IOrderInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A Order
export const updateOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const requestData = req.body;
    if (
      requestData &&
      (requestData?.order_status == "cancelled" ||
        requestData?.order_status == "returned") &&
      requestData?.order_status_update == true
    ) {
      await handleReturnOrCancelOrderIncrementProductQuantity(
        requestData?.order_products,
        requestData?.customer_id,
        requestData?.grand_total_amount,
        session
      );
    }
    const result: IOrderInterface | any = await updateOrderServices(
      requestData,
      requestData?._id,
      session
    );
    if (result?.modifiedCount > 0) {
      // Commit transaction
      await session.commitTransaction();
      session.endSession();
      return sendResponse<IOrderInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order Update Successfully !",
      });
    } else {
      throw new ApiError(400, "Order Update Failed !");
    }
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
