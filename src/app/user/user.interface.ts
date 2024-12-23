import { Types } from "mongoose";
import { IRoleInterface } from "../role/role.interface";

export interface IUserInterface {
  _id?: any;
  user_name?: string;
  user_phone?: string;
  joining_date?: string;
  user_password?: string;
  user_status?: "active" | "in-active";
  user_address?: string;
  red_alert_number?: number;
  user_salary: number;
  user_publisher_id: Types.ObjectId | IUserInterface;
  user_updated_by?: Types.ObjectId | IUserInterface;
  user_role_id?: Types.ObjectId | IRoleInterface;
}

export const userSearchableField = [
  "user_name",
  "user_phone",
  "user_address",
  "joining_date",
];
