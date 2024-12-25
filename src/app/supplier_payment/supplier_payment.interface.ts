import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { ISupplierInterface } from "../supplier/supplier.interface";
import { IBankInterface } from "../bank/bank.interface";
import { IStockManageInterface } from "../stock_manage/stock_manage.interface";

export interface ISupplierPaymentInterface {
  _id?: any;
  supplier_payment_title: string;
  supplier_payment_date: string;
  supplier_payment_amount: number;
  supplier_payment_method: "cash" | "check";
  supplier_payment_status: "paid" | "unpaid";
  transaction_id: string;
  supplier_id?: Types.ObjectId | ISupplierInterface;
  salary_user_id?: Types.ObjectId | IUserInterface;
  payment_bank_id?: Types.ObjectId | IBankInterface;
  invoice_id?: Types.ObjectId | IStockManageInterface;
  reference_id?: string;
  supplier_payment_publisher_id: Types.ObjectId | IUserInterface;
  supplier_payment_updated_by?: Types.ObjectId | IUserInterface;
}

export const supplierPaymentSearchableField = [
  "supplier_payment_title",
  "supplier_payment_date",
  "reference_id",
  "supplier_payment_method",
  "transaction_id",
];
