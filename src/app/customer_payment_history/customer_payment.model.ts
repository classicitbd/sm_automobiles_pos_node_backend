import { Schema, model } from "mongoose";
import { ICustomerPaymentInterface } from "./customer_payment.interface";

// customer payment Schema
const customerPaymentSchema = new Schema<ICustomerPaymentInterface>(
  {
    payment_title: {
      required: true,
      type: String,
    },
    payment_amount: {
      required: true,
      type: Number,
    },
    order_id: {
      type: Schema.Types.ObjectId,
      ref: "orders",
      required: true,
    },
    invoice_id: {
      type: String,
      required: true,
    },
    customer_phone: {
      type: String,
      required: true,
    },
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    bank_id: {
      type: Schema.Types.ObjectId,
      ref: "banks",
    },
    reference_id: {
      type: String,
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
