import { NextFunction, Request, RequestHandler, Response } from "express";
// import ApiError from "../errors/ApiError";
// import { promisify } from "util";
// import { IUserInterface } from "../app/user.reg/user.interface";
// import { checkAUserExitsForVerify } from "./check.user.exist.verify";
// const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv").config();

// Extend Request interface to include user property
// interface CustomRequest extends Request {
//   user?: IUserInterface; // Define the type of user property here
// }

export const verifyToken: RequestHandler = async (
  req: Request,
  // req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  // try {
  //   const cokieToken = req.cookies?.token;
  //   const token = req.headers?.authorization?.split(" ")?.[1];
  //   const { role_type } = req.query;

  //   if (!token) {
  //     throw new ApiError(400, "Need Log In !");
  //   }

  //   if (!role_type || typeof role_type !== 'string') {
  //     throw new ApiError(400, "Role Type Required and must be a string!");
  //   }

  //   const decoded = await promisify(jwt.verify)(
  //     token,
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hem11bEBnbWFpbC5jb20iLCJpYXQiOjE2OTQ0MzExOTF9.xtLPsJrvJ0Gtr4rsnHh1kok51_pU10_hYLilZyBiRAM"
  //   );
  //   // const decoded = await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN);

  //   const user_phone = decoded?.user_phone;

  //   const verifyUser = await checkAUserExitsForVerify(user_phone);

  //   // Check if the role_type value in verifyUser.user_role_id is true
  //   const isRoleTypeAllowed = verifyUser.user_role_id[role_type] === true;

  //   if (
  //     verifyUser?.user_phone == user_phone &&
  //     verifyUser?.user_status == "active" &&
  //     isRoleTypeAllowed
  //   ) {
  //     req.user = decoded;
      next();
  //   } else {
  //     throw new ApiError(400, "Invalid User !");
  //   }
  // } catch (error) {
  //   next(error);
  // }
};
