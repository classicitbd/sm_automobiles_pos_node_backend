import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";

export interface ISaleTargetInterface {
  _id?: any;
  user_id: Types.ObjectId | IUserInterface;
  sale_target_start_date: string;
  sale_target_end_date: string;
  sale_target: number;
  sale_target_amount: number;
  sale_target_success: true | false;
  sale_target_publisher_id: Types.ObjectId | IUserInterface;
  sale_target_updated_by?: Types.ObjectId | IUserInterface;
}

export const saleTargetSearchableField = [
  "sale_target_start_date",
  "sale_target_end_date",
];
