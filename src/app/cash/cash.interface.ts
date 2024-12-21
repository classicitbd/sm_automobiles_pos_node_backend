import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";

export interface ICashInterface {
  _id?: any;
  cash_balance: number;
  cash_publisher_id: Types.ObjectId | IUserInterface;
  cash_updated_by?: Types.ObjectId | IUserInterface;
}
