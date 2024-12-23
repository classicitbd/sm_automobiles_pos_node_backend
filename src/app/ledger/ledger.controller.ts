import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { ILedgerInterface, ledgerSearchableField } from "./ledger.interface";
import { findAllLedgerServices } from "./ledger.service";
import LedgerModel from "./ledger.model";

// Find All Ledger
export const findAllLedger: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ILedgerInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: ILedgerInterface[] | any = await findAllLedgerServices(
      limitNumber,
      skip,
      searchTerm
    );
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: ledgerSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await LedgerModel.countDocuments(whereCondition);
    return sendResponse<ILedgerInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ledger Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};
