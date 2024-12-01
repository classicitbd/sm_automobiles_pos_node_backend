import mongoose, { Schema, model } from "mongoose";
import { IOrderInterface } from "./order.interface";

// order Schema
const orderSchema = new Schema<IOrderInterface>(
  {
    order_id: {
      required: true,
      type: String,
    },
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    customer_previous_due: {
      type: Number,
    },
    customer_previous_advance: {
      type: Number,
    },
    sub_total_amount: {
      required: true,
      type: Number,
    },
    discount_percent_amount: {
      type: Number,
    },
    grand_total_amount: {
      required: true,
      type: Number,
    },
    payment_type: {
      type: String,
      enum: ["full-payment", "partial-payment", "due-payment"],
      default: "due-payment",
    },
    partial_payment_amount: {
      type: Number,
    },
    partial_payment_bank_id: {
      type: Schema.Types.ObjectId,
      ref: "banks",
    },
    partial_payment_transaction_id: {
      type: String,
    },
    order_status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "confirmed",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },
    received_amount: {
      required: true,
      type: Number,
    },
    due_amount: {
      required: true,
      type: Number,
    },
    final_total_amount: {
      required: true,
      type: Number,
    },
    order_products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        product_quantity: {
          required: true,
          type: Number,
        },
        product_price: {
          required: true,
          type: Number,
        },
        product_total_price: {
          required: true,
          type: Number,
        },
        product_buying_price: {
          required: true,
          type: Number,
        },
      },
    ],
    order_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    order_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = model<IOrderInterface>("orders", orderSchema);

export default OrderModel;
