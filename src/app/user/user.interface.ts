import { Types } from "mongoose";
import { IRoleInterface } from "../role/role.interface";

export interface IUserInterface {
  _id?: any;
  login_credentials: string;
  user_name?: string;
  user_phone?: string;
  user_email?: string;
  user_password?: string;
  user_status?: "active" | "in-active";
  user_address?: string;
  user_image?: string;
  user_image_key?: string;
  red_alert_number?: number;
  user_publisher_id: Types.ObjectId | IUserInterface;
  user_updated_by?: Types.ObjectId | IUserInterface;
  user_role_id?: Types.ObjectId | IRoleInterface;
}

export const userSearchableField = [
  "user_name",
  "login_credentials",
  "user_email",
  "user_phone",
  "user_address",
];
