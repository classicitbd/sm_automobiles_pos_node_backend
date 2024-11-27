import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import {
  customerDueSearchableField,
  ICustomerDueInterface,
} from "./customer_due.interface";
import {
  findAllDashboardCustomerDueServices,
  postCustomerDueServices,
  updateCustomerDueServices,
} from "./customer_due.services";
import CustomerDueModel from "./customer_due.model";
import CustomerModel from "../customer/customer.model";

// Add A CustomerDue
export const postCustomerDue: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICustomerDueInterface | any> => {
  try {
    const { customer_due_publisher_id, due_amount, customer_id, due_note } =
      req.body;

    const findCustomer = await CustomerModel.findOne({ _id: customer_id });
    if (!findCustomer) {
      throw new ApiError(400, "Customer Not Found !");
    }

    if (findCustomer?.previous_due && !findCustomer?.previous_advance) {
      const data = {
        previous_due: findCustomer?.previous_due + parseInt(due_amount),
      };
      await CustomerModel.updateOne({ _id: customer_id }, data, {
        runValidators: true,
      });
    } else if (!findCustomer?.previous_due && findCustomer?.previous_advance) {
      if (findCustomer?.previous_advance > parseInt(due_amount)) {
        const data = {
          previous_advance:
            findCustomer?.previous_advance - parseInt(due_amount),
        };
        await CustomerModel.updateOne({ _id: customer_id }, data, {
          runValidators: true,
        });
      } else {
        const due = parseInt(due_amount) - findCustomer?.previous_advance;
        const data = {
          previous_due: findCustomer?.previous_due
            ? findCustomer?.previous_due + due
            : due,
          previous_advance: 0,
        };
        await CustomerModel.updateOne({ _id: customer_id }, data, {
          runValidators: true,
        });
      }
    }

    const sendData = {
      customer_due_publisher_id,
      customer_due_updated_by: customer_due_publisher_id,
      due_note,
      due_amount,
      customer_id,
      previous_due: findCustomer?.previous_due,
      previous_advance: findCustomer?.previous_advance,
    };
    const result: ICustomerDueInterface | {} = await postCustomerDueServices(
      sendData
    );
    if (result) {
      return sendResponse<ICustomerDueInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "CustomerDue Added Successfully !",
      });
    } else {
      throw new ApiError(400, "CustomerDue Added Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// Find All dashboard CustomerDue
export const findAllDashboardCustomerDue: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICustomerDueInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ICustomerDueInterface[] | any =
      await findAllDashboardCustomerDueServices(limitNumber, skip, searchTerm);
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
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await CustomerDueModel.countDocuments(whereCondition);
    return sendResponse<ICustomerDueInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "CustomerDue Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A CustomerDue
export const updateCustomerDue: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICustomerDueInterface | any> => {
  try {
    const requestData = req.body;
    const result: ICustomerDueInterface | any = await updateCustomerDueServices(
      requestData,
      requestData?._id
    );
    if (result?.modifiedCount > 0) {
      return sendResponse<ICustomerDueInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "CustomerDue Update Successfully !",
      });
    } else {
      throw new ApiError(400, "CustomerDue Update Failed !");
    }
  } catch (error: any) {
    next(error);
  }
};
