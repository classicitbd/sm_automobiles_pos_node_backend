import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import ApiError from "../../errors/ApiError";
import { bankOutSearchableField, IBankOutInterface } from "./bank_out.interface";
import { findAllBankOutDataForABankServices } from "./bank_out.services";
import BankOutModel from "./bank_out.model";
import httpStatus from "http-status";

// Find all BankOut data For A specific Bank
export const findAllBankOutDataForABank: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<IBankOutInterface | any> => {
    try {
        const { page, limit, searchTerm, bank_id }: any = req.query;
        if (!bank_id) {
            throw new ApiError(400, "Bank Id Required !");
        }
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;
        const result: IBankOutInterface[] | any = await findAllBankOutDataForABankServices(
            limitNumber,
            skip,
            searchTerm,
            bank_id
        );
        const andCondition = [];
        if (searchTerm) {
            andCondition.push({
                $or: bankOutSearchableField.map((field) => ({
                    [field]: {
                        $regex: searchTerm,
                        $options: "i",
                    },
                })),
            });
        }
        if (bank_id) {
            andCondition.push({ bank_id: bank_id });
        }
        const whereCondition =
            andCondition.length > 0 ? { $and: andCondition } : {};
        const total = await BankOutModel.countDocuments(whereCondition);
        return sendResponse<IBankOutInterface>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "BankOut Found Successfully !",
            data: result,
            totalData: total,
        });
    } catch (error: any) {
        next(error);
    }
};