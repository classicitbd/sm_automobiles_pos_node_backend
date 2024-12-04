import { Schema, model } from "mongoose";
import { IBankOutInterface } from "./bank_out.interface";

// Bank Out Schema
const bankOutSchema = new Schema<IBankOutInterface>(
  {
    bank_id: {
      type: Schema.Types.ObjectId,
      ref: "banks",
      required: true,
    },
    bank_out_amount: {
      required: true,
      type: Number,
    },
    bank_out_title: {
      required: true,
      type: String,
    },
    bank_out_ref_no: {
      required: true,
      type: String,
    },
    bank_out_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    bank_out_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const BankOutModel = model<IBankOutInterface>("bankouts", bankOutSchema);

export default BankOutModel;
