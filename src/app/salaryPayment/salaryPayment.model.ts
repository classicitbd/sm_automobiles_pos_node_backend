import { Schema, model } from "mongoose";
import { ISalaryPaymentInterface } from "./salaryPayment.interface";

// salaryPayment Schema
const salaryPaymentSchema = new Schema<ISalaryPaymentInterface>(
  {
    salary_id: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "salaries",
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    user_phone: {
      required: true,
      type: String,
    },
    invoice_id: {
      required: true,
      type: String,
    },
    payment_type: {
      required: true,
      type: String,
      enum: ["cash", "check"],
    },
    payment_bank_id: {
      type: Schema.Types.ObjectId,
      ref: "banks",
    },
    reference_id: {
      type: String,
    },
    payment_date: {
      required: true,
      type: String,
    },
    pay_amount: {
      required: true,
      type: Number,
    },
    payment_note: {
      type: String,
    },
    payment_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    payment_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const SalaryPaymentModel = model<ISalaryPaymentInterface>(
  "salarypayments",
  salaryPaymentSchema
);

export default SalaryPaymentModel;
