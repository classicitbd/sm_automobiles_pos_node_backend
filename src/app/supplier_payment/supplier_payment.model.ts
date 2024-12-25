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
    supplier_payment_method: {
      required: true,
      type: String,
      enum: ["cash", "check"],
      default: "cash",
    },
    supplier_id: {
      type: Schema.Types.ObjectId,
      ref: "suppliers",
    },
    payment_bank_id: {
      type: Schema.Types.ObjectId,
      ref: "banks",
    },
    transaction_id: {
      type: String,
      required: true,
    },
    invoice_id: {
      type: Schema.Types.ObjectId,
      ref: "stocks",
    },
    salary_user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    supplier_payment_status: {
      required: true,
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    reference_id: {
      type: String,
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
