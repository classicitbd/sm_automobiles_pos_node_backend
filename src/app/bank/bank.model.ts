import { Schema, model } from "mongoose";
import { IBankInterface } from "./bank.interface";

// Bank Schema
const bankSchema = new Schema<IBankInterface>(
  {
    account_name: {
      required: true,
      type: String,
    },
    account_no: {
      required: true,
      type: String,
    },
    bank_name: {
      required: true,
      type: String,
    },
    bank_balance: {
      required: true,
      type: Number,
      default: 0,
    },
    bank_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    bank_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    bank_status: {
      type: String,
      enum: ["active", "in-active"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const BankModel = model<IBankInterface>("banks", bankSchema);

export default BankModel;
