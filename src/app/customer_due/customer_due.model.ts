import { Schema, model } from "mongoose";
import { ICustomerDueInterface } from "./customer_due.interface";

// customer due Schema
const customerDueSchema = new Schema<ICustomerDueInterface>(
  {
    due_note: {
      type: String,
    },
    due_amount: {
      required: true,
      type: Number,
    },
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    customer_due_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    customer_due_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const CustomerDueModel = model<ICustomerDueInterface>(
  "customerdues",
  customerDueSchema
);

export default CustomerDueModel;
