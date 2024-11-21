import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { FileUploadHelper } from "../../helpers/image.upload";
import ApiError from "../../errors/ApiError";
import { IPurchaseInterface, purchaseSearchableField } from "./purchase.interface";
import { findAllDashboardPurchaseServices, postPurchaseServices, updatePurchaseServices } from "./purchase.services";
import PurchaseModel from "./purchase.model";

// Add A Purchase
export const postPurchase: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IPurchaseInterface | any> => {
  try {
    if (req.files && "purchase_voucher" in req.files && req.body) {
      const requestData = req.body;
      // get the Purchase image and upload
      let purchase_voucher;
      let purchase_voucher_key;
      if (req.files && "purchase_voucher" in req.files) {
        const PurchaseImage = req.files["purchase_voucher"][0];
        const purchase_voucher_upload = await FileUploadHelper.uploadToSpaces(
          PurchaseImage
        );
        purchase_voucher = purchase_voucher_upload?.Location;
        purchase_voucher_key = purchase_voucher_upload?.Key;
      }
      const data = { ...requestData, purchase_voucher, purchase_voucher_key };
      const result: IPurchaseInterface | {} = await postPurchaseServices(data);
      if (result) {
        return sendResponse<IPurchaseInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Purchase Added Successfully !",
        });
      } else {
        throw new ApiError(400, "Purchase Added Failed !");
      }
    } else {
      const requestData = req.body;
      const result: IPurchaseInterface | {} = await postPurchaseServices(
        requestData
      );
      if (result) {
        return sendResponse<IPurchaseInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Purchase Added Successfully !",
        });
      } else {
        throw new ApiError(400, "Purchase Added Failed !");
      }
    }
  } catch (error: any) {
    next(error);
  }
};

// Find All Dashboard Purchase
export const findAllDashboardPurchase: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IPurchaseInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IPurchaseInterface[] | any = await findAllDashboardPurchaseServices(
      limitNumber,
      skip,
      searchTerm
    );

    const andCondition: any[] = [];
    if (searchTerm) {
      andCondition.push({
        $or: purchaseSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await PurchaseModel.countDocuments(whereCondition);
    return sendResponse<IPurchaseInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Purchase Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A Purchase
export const updatePurchase: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IPurchaseInterface | any> => {
  try {
    if (req.files && "purchase_voucher" in req.files && req.body) {
      const requestData = req.body;
      // get the Purchase image and upload
      let purchase_voucher;
      let purchase_voucher_key;
      if (req.files && "purchase_voucher" in req.files) {
        const PurchaseImage = req.files["purchase_voucher"][0];
        const purchase_voucher_upload = await FileUploadHelper.uploadToSpaces(
          PurchaseImage
        );
        purchase_voucher = purchase_voucher_upload?.Location;
        purchase_voucher_key = purchase_voucher_upload?.Key;
      }
      const data = { ...requestData, purchase_voucher, purchase_voucher_key };
      const result: IPurchaseInterface | any = await updatePurchaseServices(
        data,
        requestData?._id
      );
      if (result?.modifiedCount > 0) {
        if (requestData?.purchase_voucher_key) {
          await FileUploadHelper.deleteFromSpaces(
            requestData?.purchase_voucher_key
          );
        }
        return sendResponse<IPurchaseInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Purchase Update Successfully !",
        });
      } else {
        throw new ApiError(400, "Purchase Update Failed !");
      }
    } else {
      const requestData = req.body;
      const result: IPurchaseInterface | any = await updatePurchaseServices(
        requestData,
        requestData?._id
      );
      if (result?.modifiedCount > 0) {
        return sendResponse<IPurchaseInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Purchase Update Successfully !",
        });
      } else {
        throw new ApiError(400, "Purchase Update Failed !");
      }
    }
  } catch (error: any) {
    next(error);
  }
};
