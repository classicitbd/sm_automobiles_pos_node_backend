import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";

export interface ICustomerInterface {
  _id?: any;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  customer_address?: string;
  previous_due?: number;
  previous_advance?: number;
  customer_status: "active" | "in-active";
  first_payment_status: "active" | "in-active";
  customer_publisher_id: Types.ObjectId | IUserInterface;
  customer_updated_by?: Types.ObjectId | IUserInterface;
}

export const customerSearchableField = [
  "customer_name",
  "customer_status",
  "first_payment_status",
  "customer_details",
  "customer_phone",
  "customer_email",
  "customer_address",
];
