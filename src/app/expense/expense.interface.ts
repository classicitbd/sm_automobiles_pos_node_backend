import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { IBankInterface } from "../bank/bank.interface";
import { ISupplierInterface } from "../supplier/supplier.interface";

export interface IExpenseInterface {
  _id?: any;
  expense_title: string;
  expense_amount: number;
  expense_supplier_id?: Types.ObjectId | ISupplierInterface;
  expense_bank_id?: Types.ObjectId | IBankInterface;
  expense_publisher_id: Types.ObjectId | IUserInterface;
  expense_updated_by?: Types.ObjectId | IUserInterface;
}

export const expenseSearchableField = [
  "expense_title",
  "expense_description",
  "expense_date",
];
