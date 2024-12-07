import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { IBankInterface } from "../bank/bank.interface";

export interface IBankInInterface {
  _id?: any;
  bank_id: Types.ObjectId | IBankInterface;
  bank_in_amount: number;
  bank_in_title: string;
  bank_in_publisher_id: Types.ObjectId | IUserInterface;
  bank_in_updated_by?: Types.ObjectId | IUserInterface;
}