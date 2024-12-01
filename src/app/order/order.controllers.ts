import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { IOrderInterface, orderSearchableField } from "./order.interface";
import { findAllDashboardOrderServices, postOrderServices, updateOrderServices } from "./order.services";
import OrderModel from "./order.model";

// Add A Order
export const postOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
      const requestData = req.body;
      const result: IOrderInterface | {} = await postOrderServices(requestData);
      if (result) {
        return sendResponse<IOrderInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Order Added Successfully !",
        });
      } else {
        throw new ApiError(400, "Order Added Failed !");
      }
    
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
    const result: IOrderInterface[] | any =
      await findAllDashboardOrderServices(limitNumber, skip, searchTerm);
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

