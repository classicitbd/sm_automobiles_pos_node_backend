import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { IBankInterface } from "../bank/bank.interface";
import { IStockManageInterface } from "../stock_manage/stock_manage.interface";

export interface IBankOutInterface {
  _id?: any;
  bank_id: Types.ObjectId | IBankInterface;
  bank_out_amount: number;
  bank_out_title: string;
  bank_out_ref_no: string;
  invoice_id: Types.ObjectId | IStockManageInterface;
  bank_out_publisher_id: Types.ObjectId | IUserInterface;
  bank_out_updated_by?: Types.ObjectId | IUserInterface;
}

export const bankOutSearchableField = [
  "bank_out_title",
  "bank_out_ref_no"
]
