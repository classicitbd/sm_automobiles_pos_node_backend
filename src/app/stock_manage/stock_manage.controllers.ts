import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import {
  IStockManageInterface,
  stockManageSearchableField,
} from "./stock_manage.interface";
import {
  findAllAPStockDetailsServices,
  findAllStockDetailsInAProductServices,
  findASupplierAllStockDetailsServices,
  findASupplierAllStockInvoiceServices,
  postStockManageServices,
} from "./stock_manage.services";
import mongoose, { Types } from "mongoose";
import StockManageModel from "./stock_manage.model";
import ProductModel from "../product/product.model";
import SupplierModel from "../supplier/supplier.model";
import { postSupplierMoneyAddServices } from "../supplier_add_money/supplier_money_add.services";
import { postExpenseWhenProductStockAddServices } from "../expense/expense.services";
import LedgerModel from "../ledger/ledger.model";
import { postLedgerServices } from "../ledger/ledger.service";

// Generate a unique invoice_id
export const generateinvoice_id = async () => {
  let isUnique = false;
  let uniqueinvoice_id;

  while (!isUnique) {
    // Generate a random alphanumeric string of length 8
    uniqueinvoice_id = Array.from({ length: 8 }, () =>
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
        Math.floor(Math.random() * 62)
      )
    ).join("");

    // Check if the generated order_id is unique in the database
    const existingOrder = await StockManageModel.findOne({
      invoice_id: uniqueinvoice_id,
    });

    // If no existing order found, mark the order_id as unique
    if (!existingOrder) {
      isUnique = true;
    }
  }

  return uniqueinvoice_id;
};

// Add A StockManage
export const postStockManage: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IStockManageInterface | any> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const requestData = req.body;
    requestData.invoice_id = await generateinvoice_id();
    const product_id = requestData?.product_id;
    const result: IStockManageInterface | {} = await postStockManageServices(
      requestData,
      session
    );
    if (!result) {
      throw new ApiError(400, "Stock Added Failed !");
    }
    const productObjectId = Types.ObjectId.isValid(product_id)
      ? new Types.ObjectId(product_id)
      : product_id;
    await ProductModel.updateOne(
      { _id: productObjectId },
      {
        $inc: {
          product_quantity: parseFloat(requestData?.product_quantity),
          total_purchase: parseFloat(requestData?.product_quantity),
        },
        $set: {
          product_updated_by: requestData?.stock_publisher_id,
          product_buying_price: parseFloat(requestData?.product_buying_price),
          product_price: parseFloat(requestData?.product_selling_price),
        },
      },
      {
        session,
        runValidators: true,
      }
    );

    // add document in expense collection
    const sendDataInExpenceCreate: any = {
      expense_title: "Product Purchase",
      expense_amount: requestData?.total_amount,
      expense_supplier_id: requestData?.supplier_id,
      expense_publisher_id: requestData?.stock_publisher_id,
      expense_date: new Date()?.toISOString()?.split("T")[0],
    };

    await postExpenseWhenProductStockAddServices(
      sendDataInExpenceCreate,
      session
    );

    // add balance in ledger
    const ledgerData: any = await LedgerModel.findOne({})
      .sort({ _id: -1 })
      .session(session);
    if (ledgerData) {
      const updateLedgerData = {
        ledger_title: "Product Purchase",
        ledger_category: "Expense",
        ledger_debit: requestData?.total_amount,
        ledger_balance: ledgerData?.ledger_balance - requestData?.total_amount,
        ledger_publisher_id: requestData?.stock_publisher_id,
      };
      await postLedgerServices(updateLedgerData, session);
    } else {
      const updateLedgerData = {
        ledger_title: "Product Purchase",
        ledger_category: "Expense",
        ledger_debit: requestData?.total_amount,
        ledger_balance: requestData?.total_amount,
        ledger_publisher_id: requestData?.stock_publisher_id,
      };
      await postLedgerServices(updateLedgerData, session);
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return sendResponse<IStockManageInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Stock Added Successfully !",
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// Find All dashboard StockManage
export const findAllStockDetailsInAProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IStockManageInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const product_id = req.params.product_id;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IStockManageInterface[] | any =
      await findAllStockDetailsInAProductServices(
        limitNumber,
        skip,
        searchTerm,
        product_id
      );
    const productObjectId = Types.ObjectId.isValid(product_id)
      ? { product_id: new Types.ObjectId(product_id) }
      : { product_id };

    const andCondition: any[] = [productObjectId];
    if (searchTerm) {
      andCondition.push({
        $or: stockManageSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await StockManageModel.countDocuments(whereCondition);
    return sendResponse<IStockManageInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "StockManage Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All suplier StockManage
export const findASupplierAllStockDetails: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IStockManageInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const supplier_id = req.params.supplier_id;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IStockManageInterface[] | any =
      await findASupplierAllStockDetailsServices(
        limitNumber,
        skip,
        searchTerm,
        supplier_id
      );
    const productObjectId = Types.ObjectId.isValid(supplier_id)
      ? { supplier_id: new Types.ObjectId(supplier_id) }
      : { supplier_id };

    const andCondition: any[] = [productObjectId];
    if (searchTerm) {
      andCondition.push({
        $or: stockManageSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await StockManageModel.countDocuments(whereCondition);
    return sendResponse<IStockManageInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "StockManage Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All suplier StockManage
export const findASupplierAllStockInvoice: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IStockManageInterface | any> => {
  try {
    const supplier_id = req.params.supplier_id;
    const result: IStockManageInterface[] | any =
      await findASupplierAllStockInvoiceServices(supplier_id);
    return sendResponse<IStockManageInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "StockManage Found Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All AP StockManage
export const findAllAPStockDetails: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IStockManageInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IStockManageInterface[] | any =
      await findAllAPStockDetailsServices(limitNumber, skip, searchTerm);

    const andCondition: any[] = [];
    if (searchTerm) {
      andCondition.push({
        $or: stockManageSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await StockManageModel.countDocuments(whereCondition);
    return sendResponse<IStockManageInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "StockManage Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};
