import { Schema, model } from "mongoose";
import { IPurchaseInterface } from "./purchase.interface";

// Purchase Schema
const purchaseSchema = new Schema<IPurchaseInterface>(
  {
    purchase_title: {
      required: true,
      type: String,
    },
    purchase_description: {
      type: String,
    },
    purchase_date: {
      type: String,
    },
    purchase_amount: {
      required: true,
      type: Number,
    },
    purchase_voucher: {
      type: String,
    },
    purchase_bank_id: {
      type: Schema.Types.ObjectId,
      ref: "banks",
    },
    purchase_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    purchase_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const PurchaseModel = model<IPurchaseInterface>("purchases", purchaseSchema);

export default PurchaseModel;
