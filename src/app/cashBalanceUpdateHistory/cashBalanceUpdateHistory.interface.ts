import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";

export interface ICashBalanceUpdateHistoryInterface {
  _id?: any;
  previous_balance: number;
  new_balance: number;
  publisher_id: Types.ObjectId | IUserInterface;
}
