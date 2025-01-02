import { Schema, model } from "mongoose";
import { ISalaryInterface } from "./salary.interface";

// salary Schema
const salarySchema = new Schema<ISalaryInterface>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    user_phone: {
      required: true,
      type: String,
    },
    commision_id: {
      type: Schema.Types.ObjectId,
      ref: "saletargets",
    },
    commision_amount: {
      required: true,
      type: Number,
      default: 0,
    },
    basic_salary: {
      required: true,
      type: Number,
      default: 0,
    },
    add_or_deduct_amount: {
      required: true,
      type: Number,
      default: 0,
    },
    grand_total_amount: {
      required: true,
      type: Number,
      default: 0,
    },
    received_amount: {
      required: true,
      type: Number,
      default: 0,
    },
    due_amount: {
      required: true,
      type: Number,
      default: 0,
    },
    salary_month: {
      required: true,
      type: String,
    },
    salary_status: {
      required: true,
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    salary_note: {
      type: String,
    },
    salary_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    salary_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const SalaryModel = model<ISalaryInterface>("salaries", salarySchema);

export default SalaryModel;
