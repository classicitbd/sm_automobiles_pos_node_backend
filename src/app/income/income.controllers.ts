import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { IIncomeInterface, incomeSearchableField } from "./income.interface";
import { findAllIncomeServices } from "./income.services";
import IncomeModel from "./income.model";

// Find All Income
export const findAllIncome: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IIncomeInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IIncomeInterface[] | any = await findAllIncomeServices(
      limitNumber,
      skip,
      searchTerm
    );
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: incomeSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await IncomeModel.countDocuments(whereCondition);
    return sendResponse<IIncomeInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Income Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};
