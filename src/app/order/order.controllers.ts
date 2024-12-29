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
  findAllAccountOrderServices,
  findAllACustomerOrderServices,
  findAllAROrderServices,
  findAllDashboardOrderServices,
  findAllManagementOrderServices,
  findAllOrderInAProductServices,
  findAllOutOfWarehouseOrderServices,
  findAllProfitOrderServices,
  findAllSelfOrderServices,
  findAllSelfOrderWithPaginationServices,
  findAllWarehouseOrderServices,
  findAOrderServices,
  postOrderServices,
  updateOrderServices,
} from "./order.services";
import CheckModel from "../customer_payment/check.model";
import { IOrderInterface, orderSearchableField } from "./order.interface";
import OrderModel from "./order.model";
import SaleTargetModel from "../sale_target/sale_target.model";
import { generateChecktrnxId } from "../customer_payment/check.controllers";
import { postIncomeWhenCustomerPaymentAddServices } from "../income/income.services";
import { postLedgerServices } from "../ledger/ledger.service";
import LedgerModel from "../ledger/ledger.model";

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
        transaction_id: await generateChecktrnxId(),
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

    // add balance in ledger
    const ledgerData: any = await LedgerModel.findOne({})
      .sort({ _id: -1 })
      .session(session);
    if (ledgerData) {
      const updateLedgerData = {
        ledger_title: "Create A Order",
        ledger_category: "Revenue",
        ledger_credit: requestData?.grand_total_amount,
        ledger_balance:
          ledgerData?.ledger_balance + requestData?.grand_total_amount,
        ledger_publisher_id: requestData?.order_publisher_id,
      };
      await postLedgerServices(updateLedgerData, session);
    } else {
      const updateLedgerData = {
        ledger_title: "Create A Order",
        ledger_category: "Revenue",
        ledger_credit: requestData?.grand_total_amount,
        ledger_balance: requestData?.grand_total_amount,
        ledger_publisher_id: requestData?.order_publisher_id,
      };
      await postLedgerServices(updateLedgerData, session);
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

// Find All AR Order
export const findAllAROrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IOrderInterface[] | any = await findAllAROrderServices(
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
    andCondition.push({ payment_status: "unpaid" });
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

// Find all  OrderInAProduct
export const findAllOrderInAProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const { product_id } = req.params;
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IOrderInterface[] | any =
      await findAllOrderInAProductServices(
        limitNumber,
        skip,
        searchTerm,
        product_id
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
    andCondition.push({ "order_products.product_id": product_id });
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

// Find All profit Order in account
export const findAllProfitOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IOrderInterface[] | any = await findAllProfitOrderServices(
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
    andCondition.push({ order_status: "out-of-warehouse" });
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

// Find All Account Order
export const findAllAccountOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IOrderInterface[] | any = await findAllAccountOrderServices(
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
    andCondition.push({ order_status: "account" });
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

// Find All OutOfWarehouse Order
export const findAllOutOfWarehouseOrder: RequestHandler = async (
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
      await findAllOutOfWarehouseOrderServices(limitNumber, skip, searchTerm);
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

// Find All OutOfWarehouse Order
export const findAllSelfOrderWithPagination: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IOrderInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const { order_publisher_id } = req.params;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IOrderInterface[] | any =
      await findAllSelfOrderWithPaginationServices(
        limitNumber,
        skip,
        searchTerm,
        order_publisher_id
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
    andCondition.push({ order_publisher_id: order_publisher_id });
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
    const { page, limit, searchTerm } = req.query;
    const { order_publisher_id } = req.params;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IOrderInterface[] | any = await findAllSelfOrderServices(
      limitNumber,
      skip,
      searchTerm,
      order_publisher_id
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
    andCondition.push({ order_publisher_id: order_publisher_id });
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
    const total_measurement_count = requestData?.total_measurement_count;
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
      }).session(session);
      if (slaeTargetUserFind) {
        let brandFillupIncrement = 0;
        let saleFillupIncrement = 0;

        // Iterate through order_products to calculate increments
        requestData?.order_products?.forEach((product: any) => {
          if (product?.brand_id == slaeTargetUserFind?.brand_id?.toString()) {
            // Increment for brand_sale_target_fillup
            brandFillupIncrement += product?.total_measurement;
          } else {
            // Increment for sale_target_fillup
            saleFillupIncrement += product?.total_measurement;
          }
        });

        // Check if targets are met
        const newSaleTargetFillup =
          slaeTargetUserFind?.sale_target_fillup + saleFillupIncrement;
        const newBrandSaleTargetFillup =
          slaeTargetUserFind?.brand_sale_target_fillup + brandFillupIncrement;

        const saleTargetSuccess =
          newSaleTargetFillup >= slaeTargetUserFind?.sale_target * 0.8;
        const brandSaleTargetSuccess =
          newBrandSaleTargetFillup >=
          slaeTargetUserFind?.brand_sale_target * 0.8;

        // Update the SaleTargetModel with calculated increments
        await SaleTargetModel.updateOne(
          {
            user_id: user_id,
            sale_target_start_date: { $lte: today },
            sale_target_end_date: { $gte: today },
          },
          {
            $inc: {
              sale_target_fillup: saleFillupIncrement,
              brand_sale_target_fillup: brandFillupIncrement,
            },
            $set: {
              ...(saleTargetSuccess && { sale_target_success: true }),
              ...(brandSaleTargetSuccess && {
                brand_sale_target_success: true,
              }),
            },
          },
          { session }
        );
      }

      const updatedData: any = {
        _id: requestData?._id,
        order_status: requestData?.order_status,
        order_updated_by: requestData?.order_updated_by,
        warehouse_user_id: requestData?.warehouse_user_id,
        out_of_warehouse_date: today,
      };
      if (slaeTargetUserFind) {
        updatedData.sale_target_id = slaeTargetUserFind?._id;
      }
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
      if (requestData?.order_status == "management") {
        // payment add in income list
        const incomeData = {
          income_title: "Customer payment",
          income_amount: requestData?.income_amount,
          income_customer_id: requestData?.income_customer_id,
          customer_phone: requestData?.customer_phone,
          income_order_id: requestData?.income_order_id,
          income_invoice_number: requestData?.income_invoice_number,
          income_publisher_id: requestData?.order_updated_by,
        };
        await postIncomeWhenCustomerPaymentAddServices(incomeData, session);
      }
      // handle order status
      const result: IOrderInterface | any = await updateOrderServices(
        requestData,
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
