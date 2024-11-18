import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { FileUploadHelper } from "../../helpers/image.upload";
import ApiError from "../../errors/ApiError";
import * as fs from "fs";
import {
  expenceSearchableField,
  IExpenceInterface,
} from "./expences.interface";
import {
  deleteExpenceServices,
  findAllSelfExpenceServices,
  postExpenceServices,
  updateExpenceServices,
} from "./expences.services";
import { Types } from "mongoose";
import ExpenceModel from "./expences.model";

// Add A Expence
export const postExpence: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IExpenceInterface | any> => {
  try {
    if (req.files && "expence_document" in req.files && req.body) {
      const requestData = req.body;
      // get the Expence image and upload
      let expence_document;
      let expence_document_key;
      if (req.files && "expence_document" in req.files) {
        const ExpenceImage = req.files["expence_document"][0];
        const expence_document_upload = await FileUploadHelper.uploadToSpaces(
          ExpenceImage
        );
        expence_document = expence_document_upload?.Location;
        expence_document_key = expence_document_upload?.Key;
      }
      const data = { ...requestData, expence_document, expence_document_key };
      const result: IExpenceInterface | {} = await postExpenceServices(data);
      if (result) {
        return sendResponse<IExpenceInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Expence Added Successfully !",
        });
      } else {
        throw new ApiError(400, "Expence Added Failed !");
      }
    } else {
      const requestData = req.body;
      const result: IExpenceInterface | {} = await postExpenceServices(
        requestData
      );
      if (result) {
        return sendResponse<IExpenceInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Expence Added Successfully !",
        });
      } else {
        throw new ApiError(400, "Expence Added Failed !");
      }
    }
  } catch (error: any) {
    next(error);
  }
};

// Find All Self Expence
export const findAllSelfExpence: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IExpenceInterface | any> => {
  try {
    const { page, limit, searchTerm, panel_owner_id }: any = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IExpenceInterface[] | any = await findAllSelfExpenceServices(
      limitNumber,
      skip,
      searchTerm,
      panel_owner_id
    );
    const panelOwnerIdCondition = Types.ObjectId.isValid(panel_owner_id)
      ? { panel_owner_id: new Types.ObjectId(panel_owner_id) }
      : { panel_owner_id };

    const andCondition: any[] = [panelOwnerIdCondition];
    if (searchTerm) {
      andCondition.push({
        $or: expenceSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await ExpenceModel.countDocuments(whereCondition);
    return sendResponse<IExpenceInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Expence Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A Expence
export const updateExpence: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IExpenceInterface | any> => {
  try {
    if (req.files && "expence_document" in req.files && req.body) {
      const requestData = req.body;
      // get the Expence image and upload
      let expence_document;
      let expence_document_key;
      if (req.files && "expence_document" in req.files) {
        const ExpenceImage = req.files["expence_document"][0];
        const expence_document_upload = await FileUploadHelper.uploadToSpaces(
          ExpenceImage
        );
        expence_document = expence_document_upload?.Location;
        expence_document_key = expence_document_upload?.Key;
      }
      const data = { ...requestData, expence_document, expence_document_key };
      const result: IExpenceInterface | any = await updateExpenceServices(
        data,
        requestData?._id
      );
      if (result?.modifiedCount > 0) {
        if (requestData?.expence_document_key) {
          await FileUploadHelper.deleteFromSpaces(
            requestData?.expence_document_key
          );
        }
        return sendResponse<IExpenceInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Expence Update Successfully !",
        });
      } else {
        throw new ApiError(400, "Expence Update Failed !");
      }
    } else {
      const requestData = req.body;
      const result: IExpenceInterface | any = await updateExpenceServices(
        requestData,
        requestData?._id
      );
      if (result?.modifiedCount > 0) {
        return sendResponse<IExpenceInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Expence Update Successfully !",
        });
      } else {
        throw new ApiError(400, "Expence Update Failed !");
      }
    }
  } catch (error: any) {
    next(error);
  }
};

// delete A Expence item
export const deleteAExpenceInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.body._id;
    const result = await deleteExpenceServices(_id);
    if (result?.deletedCount > 0) {
      if (req.body?.expence_document_key) {
        await FileUploadHelper.deleteFromSpaces(req.body?.expence_document_key);
      }
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Expence Delete successfully !",
      });
    } else {
      throw new ApiError(400, "Expence delete failed !");
    }
  } catch (error) {
    next(error);
  }
};
