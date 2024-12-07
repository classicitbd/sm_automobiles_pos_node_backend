import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { ICustomerInterface } from "../customer/customer.interface";
import { IBankInterface } from "../bank/bank.interface";
import { IOrderInterface } from "../order/order.interface";

export interface ICustomerPaymentInterface {
  _id?: any;
  payment_title: string;
  payment_amount: number;
  customer_id: Types.ObjectId | ICustomerInterface;
  customer_phone: string;
  order_id: Types.ObjectId | IOrderInterface;
  invoice_id: string;
  bank_id?: Types.ObjectId | IBankInterface;
  reference_id?: string;
  customer_payment_publisher_id: Types.ObjectId | IUserInterface;
  customer_payment_updated_by?: Types.ObjectId | IUserInterface;
}

export const customerPaymentSearchableField = [
  "payment_title",
  "payment_note",
];
