import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { ICustomerInterface } from "../customer/customer.interface";
import { IBankInterface } from "../bank/bank.interface";

export interface ICustomerPaymentInterface {
  _id?: any;
  transaction_id?: string;
  payment_note?: string;
  payment_amount: number;
  previous_due?: number;
  previous_advance?: number;
  customer_id: Types.ObjectId | ICustomerInterface;
  payment_bank_id?: Types.ObjectId | IBankInterface;
  customer_payment_publisher_id: Types.ObjectId | IUserInterface;
  customer_payment_updated_by?: Types.ObjectId | IUserInterface;
}

export const customerPaymentSearchableField = [
  "transaction_id",
  "payment_note",
];
