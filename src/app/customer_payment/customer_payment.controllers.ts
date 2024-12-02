import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import {
  customerPaymentSearchableField,
  ICustomerPaymentInterface,
} from "./customer_payment.interface";
import {
  findAllDashboardCustomerPaymentServices,
  postCustomerPaymentServices,
  updateCustomerPaymentServices,
} from "./customer_payment.services";
import CustomerPaymentModel from "./customer_payment.model";
import CustomerModel from "../customer/customer.model";

// Add A CustomerPayment
export const postCustomerPayment: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICustomerPaymentInterface | any> => {
  try {
    const {
      customer_payment_publisher_id,
      transaction_id,
      payment_note,
      payment_amount,
      customer_id,
      payment_bank_id,
    } = req.body;

    const findTnxId = await CustomerPaymentModel.findOne({
      transaction_id: transaction_id,
    });
    if (findTnxId) {
      throw new ApiError(400, "Transaction ID Found !");
    }
    const findCustomer = await CustomerModel.findOne({ _id: customer_id });
    if (!findCustomer) {
      throw new ApiError(400, "Customer Not Found !");
    }
    if (findCustomer?.first_payment_status !== "active") {
      await CustomerModel.updateOne(
        { _id: customer_id },
        {
          first_payment_status: "active",
          customer_status: "active",
        },
        { runValidators: true }
      );
    }
    if (findCustomer?.previous_due) {
      if (findCustomer?.previous_due > parseInt(payment_amount)) {
        const data = {
          previous_due: findCustomer?.previous_due - parseInt(payment_amount),
        };
        await CustomerModel.updateOne({ _id: customer_id }, data, {
          runValidators: true,
        });
      } else {
        const advance = parseInt(payment_amount) - findCustomer?.previous_due;
        const data = {
          previous_due: 0,
          previous_advance: findCustomer?.previous_advance
            ? findCustomer?.previous_advance + advance
            : advance,
        };
        await CustomerModel.updateOne({ _id: customer_id }, data, {
          runValidators: true,
        });
      }
    } else {
      const data = {
        previous_due: 0,
        previous_advance: findCustomer?.previous_advance
          ? findCustomer?.previous_advance + parseInt(payment_amount)
          : parseInt(payment_amount),
      };
      await CustomerModel.updateOne({ _id: customer_id }, data, {
        runValidators: true,
      });
    }

    const sendData = {
      customer_payment_publisher_id,
      customer_payment_updated_by: customer_payment_publisher_id,
      transaction_id,
      payment_note,
      payment_amount,
      customer_id,
      payment_bank_id,
      previous_due: findCustomer?.previous_due,
      previous_advance: findCustomer?.previous_advance,
    };
    const result: ICustomerPaymentInterface | {} =
      await postCustomerPaymentServices(sendData);
    if (result) {
      return sendResponse<ICustomerPaymentInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "CustomerPayment Added Successfully !",
      });
    } else {
      throw new ApiError(400, "CustomerPayment Added Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// Find All dashboard CustomerPayment
export const findAllDashboardCustomerPayment: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICustomerPaymentInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ICustomerPaymentInterface[] | any =
      await findAllDashboardCustomerPaymentServices(
        limitNumber,
        skip,
        searchTerm
      );
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
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await CustomerPaymentModel.countDocuments(whereCondition);
    return sendResponse<ICustomerPaymentInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "CustomerPayment Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A CustomerPayment
export const updateCustomerPayment: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICustomerPaymentInterface | any> => {
  try {
    const requestData = req.body;
    const result: ICustomerPaymentInterface | any =
      await updateCustomerPaymentServices(requestData, requestData?._id);
    if (result?.modifiedCount > 0) {
      return sendResponse<ICustomerPaymentInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "CustomerPayment Update Successfully !",
      });
    } else {
      throw new ApiError(400, "CustomerPayment Update Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};
