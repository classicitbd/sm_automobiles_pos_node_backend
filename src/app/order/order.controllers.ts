import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import mongoose from "mongoose";
import {
  generateBarcodeImage,
  generateOrderId,
  handleProductQuantity,
} from "./order.helpers";
import {
  findAllACustomerOrderServices,
  findAllDashboardOrderServices,
  findAllManagementOrderServices,
  findAllSelfOrderServices,
  findAllWarehouseOrderServices,
  postOrderServices,
  updateOrderServices,
} from "./order.services";
import CheckModel from "../customer_payment/check.model";
import { IOrderInterface, orderSearchableField } from "./order.interface";
import OrderModel from "./order.model";
import SaleTargetModel from "../sale_target/sale_target.model";

// Add A Order
export const postOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const requestData = req.body;

    // Generate order ID and add to request data
    const order_id = await generateOrderId();
    req.body.order_id = order_id;
    req.body.order_barcode = order_id;
    req.body.order_barcode_image = await generateBarcodeImage(order_id);

    // Save order in database
    const result: any = await postOrderServices(req.body, session);
    if (!result) {
      throw new ApiError(400, "Order Addition Failed!");
    }

    // if have a partial or full payment with  bank
    if (requestData?.payment_type !== "due-payment") {
      const paymentCreateData: any = {
        order_id: result?.[0]?._id,
        customer_id: requestData?.customer_id,
        customer_phone: requestData?.customer_phone,
        invoice_number: order_id,
        payment_note: "Create a order",
        payment_method: requestData?.payment_method,
        pay_amount:
          requestData?.payment_type == "full-payment"
            ? requestData?.grand_total_amount
            : requestData?.pay_amount,
        check_status: "pending",
        check_publisher_id: requestData?.order_publisher_id,
      };
      if (requestData?.payment_method === "check") {
        paymentCreateData.bank_id = requestData.bank_id;
        paymentCreateData.check_number = requestData.check_number;
        paymentCreateData.check_withdraw_date = requestData.check_withdraw_date;
      }
      await CheckModel.create([paymentCreateData], { session });
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

// Find All ACustomer Order
export const findAllACustomerOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const { page, limit, searchTerm, customer_id }: any = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IOrderInterface[] | any = await findAllACustomerOrderServices(
      limitNumber,
      skip,
      searchTerm,
      customer_id
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
    andCondition.push({ customer_id: customer_id });
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

// Find All Management Order
export const findAllManagementOrder: RequestHandler = async (
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
      await findAllManagementOrderServices(limitNumber, skip, searchTerm);
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
// Find All Warehouse Order
export const findAllWarehouseOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IOrderInterface[] | any = await findAllWarehouseOrderServices(
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
    andCondition.push({ order_status: "warehouse" });
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

// Find All self Order for create a payment
export const findAllSelfOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const { order_publisher_id } = req.params;
    const result: IOrderInterface[] | any = await findAllSelfOrderServices(
      order_publisher_id
    );
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
// export const findAllOrder: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<IOrderInterface | any> => {
//   try {
//     const result: IOrderInterface[] | any = await findAllOrderServices();
//     return sendResponse<IOrderInterface>(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Order Found Successfully !",
//       data: result,
//     });
//   } catch (error: any) {
//     next(error);
//   }
// };

// // Find A Order
// export const findAOrder: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<IOrderInterface | any> => {
//   try {
//     const { _id } = req.params;
//     if (!_id) {
//       throw new ApiError(400, "ID Not Found !");
//     }
//     const result: IOrderInterface | any = await findAOrderServices(_id);
//     return sendResponse<IOrderInterface>(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Order Found Successfully !",
//       data: result,
//     });
//   } catch (error: any) {
//     next(error);
//   }
// };

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
    const user_id = requestData?.user_id;
    const total_messurement_count = requestData?.total_messurement_count;
    // handle product quantity
    if (requestData && requestData?.order_status == "out-of-warehouse") {
      await handleProductQuantity(
        requestData?.order_products,
        session,
        requestData,
        user_id
      );
      // handle sale count in this user id
      const today = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
      const slaeTargetUserFind = await SaleTargetModel.findOne({
        user_id: user_id,
        sale_target_start_date: { $lte: today },
        sale_target_end_date: { $gte: today },
      });
      if (slaeTargetUserFind) {
        await SaleTargetModel.updateOne(
          {
            user_id: user_id,
            sale_target_start_date: { $lte: today },
            sale_target_end_date: { $gte: today },
          },
          {
            $inc: { sale_target_filup: +total_messurement_count },
          },
          { session }
        );
      }

      const updatedData: any = {
        _id: requestData?._id,
        order_status: requestData?.order_status,
        order_updated_by: requestData?.order_updated_by,
      };
      // handle order status
      const result: IOrderInterface | any = await updateOrderServices(
        updatedData,
        requestData?._id,
        session
      );

      if (result?.modifiedCount == 0) {
        throw new ApiError(400, "Order Update Failed !");
      }
      // Commit transaction
      await session.commitTransaction();
      session.endSession();
      return sendResponse<IOrderInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order Update Successfully !",
      });
    } else {
      const updatedData: any = {
        _id: requestData?._id,
        order_status: requestData?.order_status,
        order_updated_by: requestData?.order_updated_by,
      };
      // handle order status
      const result: IOrderInterface | any = await updateOrderServices(
        updatedData,
        requestData?._id,
        session
      );

      if (result?.modifiedCount == 0) {
        throw new ApiError(400, "Order Update Failed !");
      }
      // Commit transaction
      await session.commitTransaction();
      session.endSession();
      return sendResponse<IOrderInterface>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order Update Successfully !",
      });
    }
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
