import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { IBankInterface } from "../bank/bank.interface";

export interface IPurchaseInterface {
  _id?: any;
  purchase_title: string;
  purchase_description?: string;
  purchase_date?: string;
  purchase_amount: number;
  purchase_voucher?: string;
  purchase_voucher_key?: string;
  purchase_bank_id?: Types.ObjectId | IBankInterface;
  purchase_publisher_id: Types.ObjectId | IUserInterface;
  purchase_updated_by?: Types.ObjectId | IUserInterface;
}

export const purchaseSearchableField = [
  "purchase_title",
  "purchase_description",
  "purchase_date",
];
