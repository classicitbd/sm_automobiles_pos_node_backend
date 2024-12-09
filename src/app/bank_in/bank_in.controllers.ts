import { NextFunction, Request, RequestHandler, Response } from "express";
import { bankInSearchableField, IBankInInterface } from "./bank_in.interface";
import { findAllBankInDataForABankServices } from "./bank_in.services";
import BankInModel from "./bank_in.model";
import sendResponse from "../../shared/sendResponse";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

// Find all BankIn data For A specific Bank
export const findAllBankInDataForABank: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<IBankInInterface | any> => {
    try {
        const { page, limit, searchTerm, bank_id }: any = req.query;
        if (!bank_id) {
            throw new ApiError(400, "Bank Id Required !");
        }
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;
        const result: IBankInInterface[] | any = await findAllBankInDataForABankServices(
            limitNumber,
            skip,
            searchTerm,
            bank_id
        );
        const andCondition = [];
        if (searchTerm) {
            andCondition.push({
                $or: bankInSearchableField.map((field) => ({
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
        const total = await BankInModel.countDocuments(whereCondition);
        return sendResponse<IBankInInterface>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "BankIn Found Successfully !",
            data: result,
            totalData: total,
        });
    } catch (error: any) {
        next(error);
    }
};