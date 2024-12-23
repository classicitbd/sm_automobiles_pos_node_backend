import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";

export interface ILedgerInterface {
  _id?: any;
  ledger_title: string;
  ledger_category: string;
  ledger_debit?: number;
  ledger_credit?: number;
  ledger_balance: number;
  ledger_publisher_id: Types.ObjectId | IUserInterface;
}

export const ledgerSearchableField = ["ledger_title", "ledger_category"];
