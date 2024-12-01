import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { IOrderInterface, orderSearchableField } from "./order.interface";
import {
  findAllDashboardOrderServices,
  postOrderServices,
  updateOrderServices,
} from "./order.services";
import OrderModel from "./order.model";
import CustomerModel from "../customer/customer.model";
import mongoose from "mongoose";
import {
  generateOrderId,
  handleDuePayment,
  handleFullPayment,
  handlePartialPayment,
  handleProductQuantity,
} from "./order.helpers";

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
      payment_type,
      customer_id,
      grand_total_amount,
      payment_transaction_id,
      payment_bank_id,
      received_amount,
      due_amount,
      first_payment_status,
      order_products,
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

    // Save order in database
    const result = await postOrderServices(req.body, session);
    if (!result) {
      throw new ApiError(400, "Order Addition Failed!");
    }

    // modify product quantity
    await handleProductQuantity(order_products, session);

    // Update customer status if first payment is inactive
    if (
      first_payment_status === "in-active" &&
      (payment_type === "full-payment" || payment_type === "partial-payment")
    ) {
      await CustomerModel.updateOne(
        { _id: customer_id },
        {
          first_payment_status: "active",
          customer_status: "active",
        },
        { session, runValidators: true }
      );
    }

    // Handle payment types
    switch (payment_type) {
      case "due-payment":
        await handleDuePayment(
          customer_id,
          grand_total_amount,
          findCustomer,
          session
        );
        break;

      case "full-payment":
        await handleFullPayment(
          customer_id,
          payment_transaction_id,
          payment_bank_id,
          grand_total_amount,
          findCustomer,
          session
        );
        break;

      case "partial-payment":
        await handlePartialPayment(
          customer_id,
          payment_transaction_id,
          payment_bank_id,
          received_amount,
          due_amount,
          findCustomer,
          session
        );
        break;

      default:
        throw new ApiError(400, "Invalid Payment Type!");
    }

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
  try {
    const requestData = req.body;
    const result: IOrderInterface | any = await updateOrderServices(
      requestData,
      requestData?._id
    );
    if (result?.modifiedCount > 0) {
      return sendResponse<IOrderInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order Update Successfully !",
      });
    } else {
      throw new ApiError(400, "Order Update Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};
