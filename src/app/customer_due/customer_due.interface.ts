import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { ICustomerInterface } from "../customer/customer.interface";

export interface ICustomerDueInterface {
  _id?: any;
  due_note?: string;
  due_amount: number;
  customer_id: Types.ObjectId | ICustomerInterface;
  customer_due_publisher_id: Types.ObjectId | IUserInterface;
  customer_due_updated_by?: Types.ObjectId | IUserInterface;
}

export const customerDueSearchableField = [
  "due_note",
];
