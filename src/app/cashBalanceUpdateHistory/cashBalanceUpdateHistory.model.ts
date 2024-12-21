import { Schema, model } from "mongoose";
import { ICashBalanceUpdateHistoryInterface } from "./cashBalanceUpdateHistory.interface";

// cashBalanceUpdateHistrotySchema
const cashBalanceUpdateHistrotySchema = new Schema<ICashBalanceUpdateHistoryInterface>(
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
  },
  {
    timestamps: true,
  }
);

const CashBalanceUpdateHistoryModel = model<ICashBalanceUpdateHistoryInterface>("cashbalanceupdatehistories", cashBalanceUpdateHistrotySchema);

export default CashBalanceUpdateHistoryModel;
