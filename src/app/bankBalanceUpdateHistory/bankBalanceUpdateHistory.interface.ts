import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { IBankInterface } from "../bank/bank.interface";

export interface IBankBalanceUpdateHistoryInterface {
  _id?: any;
  previous_balance: number;
  new_balance: number;
  publisher_id: Types.ObjectId | IUserInterface;
  bank_id: Types.ObjectId | IBankInterface;
}
