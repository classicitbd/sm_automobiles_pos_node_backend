import { Schema, model } from "mongoose";
import { ICheckInterface } from "./check.interface";

// check Schema
const checkSchema = new Schema<ICheckInterface>(
  {
    order_id: {
      type: Schema.Types.ObjectId,
      ref: "orders",
      required: true,
    },
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    customer_phone: {
      type: String,
      required: true,
    },
    invoice_number: {
      required: true,
      type: String,
    },
    payment_method: {
      required: true,
      type: String,
      enum: ["cash", "check"],
      default: "cash",
    },
    pay_amount: {
      required: true,
      type: Number,
    },
    check_number: {
      type: String,
    },
    payment_note: {
      type: String,
    },
    check_withdraw_date: {
      type: String,
    },
    bank_id: {
      type: Schema.Types.ObjectId,
      ref: "banks",
    },
    check_status: {
      required: true,
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    tranaction_id: {
      type: String,
      required: true,
    },
    check_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    check_approved_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    check_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const CheckModel = model<ICheckInterface>("checks", checkSchema);

export default CheckModel;
