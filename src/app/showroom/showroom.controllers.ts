import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { IShowroomInterface, showroomSearchableField } from "./showroom.interface";
import { findAllDashboardShowroomServices, findAllShowroomServices, postShowroomServices, updateShowroomServices } from "./showroom.services";
import ShowroomModel from "./showroom.model";

// Add A Showroom
export const postShowroom: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IShowroomInterface | any> => {
  try {
      const requestData = req.body;
      const result: IShowroomInterface | {} = await postShowroomServices(requestData);
      if (result) {
        return sendResponse<IShowroomInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Showroom Added Successfully !",
        });
      } else {
        throw new ApiError(400, "Showroom Added Failed !");
      }
    
  } catch (error: any) {
    next(error);
  }
};

// Find All Showroom
export const findAllShowroom: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IShowroomInterface | any> => {
  try {
    const result: IShowroomInterface[] | any = await findAllShowroomServices();
    return sendResponse<IShowroomInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Showroom Found Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All dashboard Showroom
export const findAllDashboardShowroom: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IShowroomInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IShowroomInterface[] | any =
      await findAllDashboardShowroomServices(limitNumber, skip, searchTerm);
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: showroomSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await ShowroomModel.countDocuments(whereCondition);
    return sendResponse<IShowroomInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Showroom Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A Showroom
export const updateShowroom: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IShowroomInterface | any> => {
  try {
      const requestData = req.body;
      const result: IShowroomInterface | any = await updateShowroomServices(
        requestData,
        requestData?._id
      );
      if (result?.modifiedCount > 0) {
        return sendResponse<IShowroomInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Showroom Update Successfully !",
        });
      } else {
        throw new ApiError(400, "Showroom Update Failed !");
      }
  } catch (error: any) {
    next(error);
  }
};

