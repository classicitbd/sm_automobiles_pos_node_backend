import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { IBankInterface } from "../bank/bank.interface";
import { ICustomerInterface } from "../customer/customer.interface";

export interface IBankInInterface {
  _id?: any;
  bank_id: Types.ObjectId | IBankInterface;
  bank_in_amount: number;
  bank_in_title: string;
  bank_in_ref_no: string;
  customer_id?: Types.ObjectId | ICustomerInterface;
  bank_in_publisher_id: Types.ObjectId | IUserInterface;
  bank_in_updated_by?: Types.ObjectId | IUserInterface;
}

export const bankInSearchableField =[
  "bank_in_title",
  "bank_in_ref_no"
]