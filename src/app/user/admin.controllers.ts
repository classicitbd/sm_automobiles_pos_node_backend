import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import sendResponse from "../../shared/sendResponse";
import { IUserInterface, userSearchableField } from "./user.interface";
import UserModel from "./user.model";
import {
  findAllDashboardUserServices,
  findAllUserServices,
  postUserServices,
  updateUserServices,
} from "./admin.services";
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

// Add A User
export const postUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IUserInterface | any> => {
  try {
    const requestData = req.body;
    if (!requestData?.user_name) {
      throw new ApiError(400, "User Name Required !");
    }
    if (!requestData?.user_password) {
      throw new ApiError(400, "Password Required !");
    }
    if (!requestData?.user_phone) {
      throw new ApiError(400, "User Phone Required !");
    }
    if (!requestData?.user_role_id) {
      throw new ApiError(400, "User Role Required !");
    }

    const findUserWithPhoneExist: boolean | null | undefined | any =
      await UserModel.exists({
        user_phone: requestData.user_phone,
      });

    if (findUserWithPhoneExist) {
      throw new ApiError(400, "Already Added This Phone!");
    }
    bcrypt.hash(
      requestData?.user_password,
      saltRounds,
      async function (err: Error, hash: string) {
        delete requestData?.user_password;
        const data = {
          ...requestData,
          user_password: hash,
        };
        try {
          const result: IUserInterface | {} = await postUserServices(data);
          if (result) {
            return sendResponse<IUserInterface>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: "User Added Successfully !",
            });
          } else {
            throw new ApiError(400, "User Added Failed !");
          }
        } catch (error) {
          next(error);
        }
      }
    );
  } catch (error: any) {
    next(error);
  }
};

// login a User
export const postLogUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_password, user_phone } = req.body;

    const findUser: IUserInterface | null = await UserModel.findOne({
      user_phone: user_phone,
    });
    if (!findUser) {
      throw new ApiError(400, "User Not Found !");
    }
    if (findUser?.user_status == "in-active") {
      throw new ApiError(400, "Inactive User !");
    }

    const isPasswordValid = await bcrypt.compare(
      user_password,
      findUser?.user_password
    );
    if (isPasswordValid) {
      const user_phone = findUser?.user_phone;
      const token = jwt.sign(
        { user_phone },
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hem11bEBnbWFpbC5jb20iLCJpYXQiOjE2OTQ0MzExOTF9.xtLPsJrvJ0Gtr4rsnHh1kok51_pU10_hYLilZyBiRAM",
        { expiresIn: "365d" }
      );
      res.cookie("sm_auto_mobile_token", token);
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User log in successfully !",
      });
    } else {
      throw new ApiError(400, "Password not match !");
    }
  } catch (error) {
    next(error);
  }
};

// Find All  user
export const findAllUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IUserInterface | any> => {
  try {
    const result: IUserInterface[] | any = await findAllUserServices();
    return sendResponse<IUserInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Found Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All dashboard user
export const findAllDashboardUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IUserInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IUserInterface[] | any = await findAllDashboardUserServices(
      limitNumber,
      skip,
      searchTerm
    );
    const andCondition = [];
    if (searchTerm) {
      andCondition.push({
        $or: userSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await UserModel.countDocuments(whereCondition);
    return sendResponse<IUserInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A User
export const updateUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IUserInterface | any> => {
  try {
    const requestData = req.body;
    if (!requestData?.user_phone) {
      throw new ApiError(400, "User Phone Required !");
    }

    const findUserWithPhoneExist: boolean | null | undefined | any =
      await UserModel.exists({ user_phone: requestData.user_phone });

    if (
      findUserWithPhoneExist &&
      requestData?._id !== findUserWithPhoneExist?._id.toString()
    ) {
      throw new ApiError(400, "Already Added This Phone !");
    }
    if (requestData?.user_password) {
      bcrypt.hash(
        requestData?.user_password,
        saltRounds,
        async function (err: Error, hash: string) {
          delete requestData?.user_password;
          const data = { ...requestData, user_password: hash };
          const result: IUserInterface | any = await updateUserServices(
            data,
            requestData?._id
          );
          if (result?.modifiedCount > 0) {
            return sendResponse<IUserInterface>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: "User Update Successfully !",
            });
          } else {
            throw new ApiError(400, "User Update Failed !");
          }
        }
      );
    } else {
      const result: IUserInterface | any = await updateUserServices(
        requestData,
        requestData?._id
      );
      if (result?.modifiedCount > 0) {
        return sendResponse<IUserInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "User Update Successfully !",
        });
      } else {
        throw new ApiError(400, "User Update Failed !");
      }
    }
  } catch (error: any) {
    next(error);
  }
};
