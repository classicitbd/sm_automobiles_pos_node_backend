import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { ISupplierInterface } from "../supplier/supplier.interface";

export interface ISupplierPaymentInterface {
  _id?: any;
  supplier_payment_title: string;
  supplier_payment_description?: string;
  supplier_payment_date?: string;
  supplier_payment_amount: number;
  supplier_id: Types.ObjectId | ISupplierInterface;
  supplier_payment_publisher_id: Types.ObjectId | IUserInterface;
  supplier_payment_updated_by?: Types.ObjectId | IUserInterface;
}

export const supplierPaymentSearchableField = [
  "supplier_payment_title",
  "supplier_payment_description",
  'supplier_payment_date'
]
