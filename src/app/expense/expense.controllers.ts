import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { expenseSearchableField, IExpenseInterface } from "./expense.interface";
import ExpenseModel from "./expense.model";
import { findAllExpenseServices } from "./expense.services";

// Find All Expense
export const findAllExpense: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<IExpenseInterface | any> => {
    try {
      const { page, limit, searchTerm } = req.query;
      const pageNumber = Number(page);
      const limitNumber = Number(limit);
      const skip = (pageNumber - 1) * limitNumber;
      const result: IExpenseInterface[] | any = await findAllExpenseServices(
        limitNumber,
        skip,
        searchTerm
      );
      const andCondition = [];
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