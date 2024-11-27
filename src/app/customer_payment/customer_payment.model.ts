import { Schema, model } from "mongoose";
import { ICustomerPaymentInterface } from "./customer_payment.interface";

// customer payment Schema
const customerPaymentSchema = new Schema<ICustomerPaymentInterface>(
  {
    transaction_id: {
      type: String,
    },
    payment_note: {
      type: String,
    },
    payment_amount: {
      required: true,
      type: Number,
    },
    previous_due: {
      type: Number,
    },
    previous_advance: {
      type: Number,
    },
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    payment_bank_id: {
      type: Schema.Types.ObjectId,
      ref: "banks",
    },
    customer_payment_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    customer_payment_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const CustomerPaymentModel = model<ICustomerPaymentInterface>(
  "customerpayments",
  customerPaymentSchema
);

export default CustomerPaymentModel;
