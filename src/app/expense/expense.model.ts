import { Schema, model } from "mongoose";
import { IExpenseInterface } from "./expense.interface";

// Expense Schema
const expenseSchema = new Schema<IExpenseInterface>(
  {
    expense_title: {
      required: true,
      type: String,
    },
    expense_description: {
      type: String,
    },
    expense_date: {
      type: String,
    },
    expense_amount: {
      required: true,
      type: Number,
    },
    expense_voucher: {
      type: String,
    },
    expense_voucher_key: {
      type: String,
    },
    expense_bank_id: {
      type: Schema.Types.ObjectId,
      ref: "banks",
    },
    expense_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    expense_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const ExpenseModel = model<IExpenseInterface>("expenses", expenseSchema);

export default ExpenseModel;
