import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { FileUploadHelper } from "../../helpers/image.upload";
import ApiError from "../../errors/ApiError";
import { expenseSearchableField, IExpenseInterface } from "./expense.interface";
import { findAllDashboardExpenseServices, postExpenseServices, updateExpenseServices } from "./expense.services";
import ExpenseModel from "./expense.model";

// Add A Expense
export const postExpense: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IExpenseInterface | any> => {
  try {
    if (req.files && "expense_voucher" in req.files && req.body) {
      const requestData = req.body;
      // get the Expense image and upload
      let expense_voucher;
      let expense_voucher_key;
      if (req.files && "expense_voucher" in req.files) {
        const ExpenseImage = req.files["expense_voucher"][0];
        const expense_voucher_upload = await FileUploadHelper.uploadToSpaces(
          ExpenseImage
        );
        expense_voucher = expense_voucher_upload?.Location;
        expense_voucher_key = expense_voucher_upload?.Key;
      }
      const data = { ...requestData, expense_voucher, expense_voucher_key };
      const result: IExpenseInterface | {} = await postExpenseServices(data);
      if (result) {
        return sendResponse<IExpenseInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Expense Added Successfully !",
        });
      } else {
        throw new ApiError(400, "Expense Added Failed !");
      }
    } else {
      const requestData = req.body;
      const result: IExpenseInterface | {} = await postExpenseServices(
        requestData
      );
      if (result) {
        return sendResponse<IExpenseInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Expense Added Successfully !",
        });
      } else {
        throw new ApiError(400, "Expense Added Failed !");
      }
    }
  } catch (error: any) {
    next(error);
  }
};

// Find All Dashboard Expense
export const findAllDashboardExpense: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IExpenseInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IExpenseInterface[] | any = await findAllDashboardExpenseServices(
      limitNumber,
      skip,
      searchTerm
    );

    const andCondition: any[] = [];
    if (searchTerm) {
      andCondition.push({
        $or: expenseSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await ExpenseModel.countDocuments(whereCondition);
    return sendResponse<IExpenseInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Expense Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A Expense
export const updateExpense: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IExpenseInterface | any> => {
  try {
    if (req.files && "expense_voucher" in req.files && req.body) {
      const requestData = req.body;
      // get the Expense image and upload
      let expense_voucher;
      let expense_voucher_key;
      if (req.files && "expense_voucher" in req.files) {
        const ExpenseImage = req.files["expense_voucher"][0];
        const expense_voucher_upload = await FileUploadHelper.uploadToSpaces(
          ExpenseImage
        );
        expense_voucher = expense_voucher_upload?.Location;
        expense_voucher_key = expense_voucher_upload?.Key;
      }
      const data = { ...requestData, expense_voucher, expense_voucher_key };
      const result: IExpenseInterface | any = await updateExpenseServices(
        data,
        requestData?._id
      );
      if (result?.modifiedCount > 0) {
        if (requestData?.expense_voucher_key) {
          await FileUploadHelper.deleteFromSpaces(
            requestData?.expense_voucher_key
          );
        }
        return sendResponse<IExpenseInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Expense Update Successfully !",
        });
      } else {
        throw new ApiError(400, "Expense Update Failed !");
      }
    } else {
      const requestData = req.body;
      const result: IExpenseInterface | any = await updateExpenseServices(
        requestData,
        requestData?._id
      );
      if (result?.modifiedCount > 0) {
        return sendResponse<IExpenseInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Expense Update Successfully !",
        });
      } else {
        throw new ApiError(400, "Expense Update Failed !");
      }
    }
  } catch (error: any) {
    next(error);
  }
};
