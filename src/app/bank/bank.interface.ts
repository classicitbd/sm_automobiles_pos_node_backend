import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";

export interface IBankInterface {
  _id?: any;
  account_name: string;
  account_no: string;
  bank_name: string;
  bank_balance: number;
  bank_status: "active" | "in-active";
  bank_publisher_id: Types.ObjectId | IUserInterface;
  bank_updated_by?: Types.ObjectId | IUserInterface;
}

export const bankSearchableField = [
  "account_name",
  "account_no",
  "bank_name",
  "bank_status",
];
