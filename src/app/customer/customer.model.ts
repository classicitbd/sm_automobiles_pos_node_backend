import { Schema, model } from "mongoose";
import { ICustomerInterface } from "./customer.interface";

// Product Schema
const customerSchema = new Schema<ICustomerInterface>(
  {
    customer_name: {
      required: true,
      type: String,
    },
    customer_phone: {
      type: String,
    },
    customer_address: {
      type: String,
    },
    red_alert_number: {
      type: Number,
    },
    customer_status: {
      type: String,
      enum: ["active", "in-active"],
      default: "in-active",
    },
    customer_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    customer_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    }
  },
  {
    timestamps: true,
  }
);

const CustomerModel = model<ICustomerInterface>("customers", customerSchema);

export default CustomerModel;
