import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { ISupplierInterface } from "../supplier/supplier.interface";

export interface ISupplierDueInterface {
  _id?: any;
  supplier_due_title: string;
  supplier_due_date?: string;
  supplier_due_amount: number;
  supplier_id: Types.ObjectId | ISupplierInterface;
  supplier_due_publisher_id: Types.ObjectId | IUserInterface;
  supplier_due_updated_by?: Types.ObjectId | IUserInterface;
}

export const supplierDueSearchableField = [
  "supplier_due_title",
  "supplier_due_date",
];
