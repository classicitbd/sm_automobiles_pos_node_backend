import { Schema, model } from "mongoose";
import { IBankInInterface } from "./bank_in.interface";

// Bank In Schema
const bankInSchema = new Schema<IBankInInterface>(
  {
    bank_id: {
      type: Schema.Types.ObjectId,
      ref: "banks",
      required: true,
    },
    bank_in_amount: {
      required: true,
      type: Number,
    },
    bank_in_title: {
      required: true,
      type: String,
    },
    bank_in_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    bank_in_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const BankInModel = model<IBankInInterface>("bankins", bankInSchema);

export default BankInModel;
