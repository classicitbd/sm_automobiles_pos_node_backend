import { Schema, model } from "mongoose";
import { IIncomeInterface } from "./income.interface";

// income Schema
const incomeSchema = new Schema<IIncomeInterface>(
  {
    income_title: {
      required: true,
      type: String,
    },
    income_amount: {
      required: true,
      type: Number,
    },
    income_customer_id: {
      type: Schema.Types.ObjectId,
      ref: "customers",
    },
    income_order_id: {
      type: Schema.Types.ObjectId,
      ref: "orders",
    },
    income_invoice_number: {
      type: String,
    },
    customer_phone: {
      type: String,
    },
    income_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    income_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const IncomeModel = model<IIncomeInterface>("incomes", incomeSchema);

export default IncomeModel;
