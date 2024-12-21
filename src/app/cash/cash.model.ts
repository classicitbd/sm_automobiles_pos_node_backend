import { Schema, model } from "mongoose";
import { ICashInterface } from "./cash.interface";

// Bank Schema
const cashSchema = new Schema<ICashInterface>(
  {
    cash_balance: {
      required: true,
      type: Number,
    },
    cash_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    cash_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const CashModel = model<ICashInterface>("cashs", cashSchema);

export default CashModel;
