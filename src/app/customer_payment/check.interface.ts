import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { IOrderInterface } from "../order/order.interface";
import { IBankInterface } from "../bank/bank.interface";
import { ICustomerInterface } from "../customer/customer.interface";

export interface ICheckInterface {
  _id?: any;
  order_id: Types.ObjectId | IOrderInterface;
  customer_id: Types.ObjectId | ICustomerInterface;
  customer_phone: string;
  invoice_number: string;
  payment_note?: string;
  payment_method: "cash" | "check";
  pay_amount: number;
  bank_id?: Types.ObjectId | IBankInterface;
  check_number?: string;
  check_withdraw_date?: string;
  check_status: "pending" | "approved" | "rejected";
  transaction_id: string;
  check_publisher_id: Types.ObjectId | IUserInterface;
  check_approved_by?: Types.ObjectId | IUserInterface;
  check_updated_by?: Types.ObjectId | IUserInterface;
}

export const checkSearchableField = [
  "invoice_number",
  "customer_phone",
  "check_number",
  "check_withdraw_date",
  "check_status",
  "payment_method",
  "payment_note",
  "transaction_id",
];
