import { Schema, model } from "mongoose";
import { ISupplierPaymentInterface } from "./supplier_payment.interface";

// Supplier Payment Schema
const supplierPaymentSchema = new Schema<ISupplierPaymentInterface>(
  {
    supplier_payment_title: {
      required: true,
      type: String,
    },
    supplier_payment_date: {
      required: true,
      type: String,
    },
    supplier_payment_amount: {
      required: true,
      type: Number,
    },
    supplier_id: {
      type: Schema.Types.ObjectId,
      ref: "suppliers",
      required: true,
    },
    payment_bank_id: {
      type: Schema.Types.ObjectId,
      ref: "banks",
      required: true,
    },
    reference_id: {
      type: String,
      required: true,
    },
    supplier_payment_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    supplier_payment_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const SupplierPaymentModel = model<ISupplierPaymentInterface>(
  "supplierpayments",
  supplierPaymentSchema
);

export default SupplierPaymentModel;
