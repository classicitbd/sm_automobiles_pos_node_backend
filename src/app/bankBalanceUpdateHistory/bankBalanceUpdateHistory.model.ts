import { Schema, model } from "mongoose";
import { IBankBalanceUpdateHistoryInterface } from "./bankBalanceUpdateHistory.interface";

// bankBalanceUpdateHistorySchema
const bankBalanceUpdateHistorySchema =
  new Schema<IBankBalanceUpdateHistoryInterface>(
    {
      previous_balance: {
        required: true,
        type: Number,
      },
      new_balance: {
        required: true,
        type: Number,
      },
      publisher_id: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      bank_id: {
        type: Schema.Types.ObjectId,
        ref: "banks",
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

const BankBalanceUpdateHistoryModel = model<IBankBalanceUpdateHistoryInterface>(
  "bankbalanceupdatehistories",
  bankBalanceUpdateHistorySchema
);

export default BankBalanceUpdateHistoryModel;
