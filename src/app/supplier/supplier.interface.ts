import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";

export interface ISupplierInterface {
  _id?: any;
  supplier_wallet_amount: number;
  supplier_name: string;
  supplier_phone: string;
  supplier_address: string;
  supplier_publisher_id: Types.ObjectId | IUserInterface;
  supplier_updated_by?: Types.ObjectId | IUserInterface;
}

export const supplierSearchableField = [
  "supplier_name",
  "supplier_address",
  "supplier_phone",
]
