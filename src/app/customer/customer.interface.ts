import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";

export interface ICustomerInterface {
  _id?: any;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  customer_wallet: number;
  customer_status: "active" | "in-active";
  red_alert_number?: number;
  customer_publisher_id: Types.ObjectId | IUserInterface;
  customer_updated_by?: Types.ObjectId | IUserInterface;
}

export const customerSearchableField = [
  "customer_name",
  "customer_status",
  "customer_phone",
  "customer_address",
];
