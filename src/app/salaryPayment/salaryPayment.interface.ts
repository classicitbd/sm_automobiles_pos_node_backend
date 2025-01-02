import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { ISalaryInterface } from "../salary/salary.interface";
import { IBankInterface } from "../bank/bank.interface";

export interface ISalaryPaymentInterface {
  _id?: any;
  salary_id: Types.ObjectId | ISalaryInterface;
  user_id: Types.ObjectId | IUserInterface;
  user_phone: string;
  invoice_id: string;
  payment_type: "cash" | "check";
  payment_bank_id?: Types.ObjectId | IBankInterface;
  reference_id?: string;
  payment_date: string;
  pay_amount: number;
  payment_note?: string;
  payment_publisher_id: Types.ObjectId | IUserInterface;
  payment_updated_by?: Types.ObjectId | IUserInterface;
}

export const salaryPaymentSearchableField = [
  "user_phone",
  "invoice_id",
  "payment_type",
  "reference_id",
  "payment_date",
  "payment_note",
];
