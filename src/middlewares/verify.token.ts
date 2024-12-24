import { NextFunction, Request, RequestHandler, Response } from "express";
import ApiError from "../errors/ApiError";
import { promisify } from "util";
import { IUserInterface } from "../app/user/user.interface";
import { checkAUserExitsForVerify } from "../app/user/admin.services";
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

// Extend Request interface to include user property
interface UserRequest extends Request {
  user?: IUserInterface; // Define the type of user property here
}

export const verifyToken = (permission: string): RequestHandler => {
  return async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const cokieToken = req.cookies?.sm_auto_mobile_token;
      if (!cokieToken) {
        throw new ApiError(400, "Need Log In !");
      }

      if (!permission) {
        throw new ApiError(400, "Role Type Required !");
      }

      const decoded = await promisify(jwt.verify)(
        cokieToken,
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hem11bEBnbWFpbC5jb20iLCJpYXQiOjE2OTQ0MzExOTF9.xtLPsJrvJ0Gtr4rsnHh1kok51_pU10_hYLilZyBiRAM"
      );
      // const decoded = await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN);

      const user_phone = decoded?.user_phone;

      const verifyUser = await checkAUserExitsForVerify(user_phone);

      // Check if the role_type value in verifyUser.user_role_id is true
      const isRoleTypeAllowed = verifyUser?.user_role_id[permission] === true;

      if (
        verifyUser?.user_phone == user_phone &&
        verifyUser?.user_status == "active" &&
        isRoleTypeAllowed
      ) {
        req.user = decoded;
        next();
      } else {
        throw new ApiError(400, "Invalid User !");
      }
    } catch (error) {
      next(error);
    }
  };
};
