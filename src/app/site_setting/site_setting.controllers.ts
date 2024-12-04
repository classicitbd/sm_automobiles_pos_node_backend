import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { ISiteSettingInterface } from "./site_setting.interface";
import {
  getSiteSettingServices,
  postSiteSettingServices,
  updateSiteSettingServices,
} from "./site_setting.services";

// Add A SiteSetting
export const postSiteSetting: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISiteSettingInterface | any> => {
  try {
    const data = req.body;
    if (data?._id) {
      const result = await updateSiteSettingServices(data);
      if (result?.modifiedCount) {
        return sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Setting Update successfully !",
        });
      } else {
        throw new ApiError(400, "Setting Update failed !");
      }
    } else {
      const result = await postSiteSettingServices(data);
      if (result) {
        return sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Setting Update successfully !",
        });
      } else {
        throw new ApiError(400, "Setting Update failed !");
      }
    }
  } catch (error: any) {
    next(error);
  }
};

// get A SiteSetting
export const getSiteSetting: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ISiteSettingInterface | any> => {
  try {
    const result = await getSiteSettingServices();
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Setting Get successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
