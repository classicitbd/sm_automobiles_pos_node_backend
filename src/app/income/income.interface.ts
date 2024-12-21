import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { IBankInterface } from "../bank/bank.interface";
import { ICustomerInterface } from "../customer/customer.interface";
import { IOrderInterface } from "../order/order.interface";

export interface IIncomeInterface {
  _id?: any;
  income_title: string;
  income_amount: number;
  income_customer_id?: Types.ObjectId | ICustomerInterface;
  customer_phone?: string;
  income_order_id?: Types.ObjectId | IOrderInterface;
  income_invoice_number?: string;
  income_publisher_id: Types.ObjectId | IUserInterface;
  income_updated_by?: Types.ObjectId | IUserInterface;
}

export const incomeSearchableField = [
  "income_title",
  "customer_phone",
  "income_invoice_number",
];
