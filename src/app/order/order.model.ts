import mongoose, { Schema, model } from "mongoose";
import { IOrderInterface } from "./order.interface";

// order Schema
const orderSchema = new Schema<IOrderInterface>(
  {
    order_id: {
      required: true,
      type: String,
    },
    order_status: {
      required: true,
      type: String,
      enum: ["management", "warehouse", "out-of-warehouse"],
      default: "management",
    },
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    order_products: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        product_quantity: {
          required: true,
          type: Number,
        },
        product_price: {
          required: true,
          type: Number
        },
        product_buying_price: {
          required: true,
          type: Number
        },
        total_amount: {
          required: true,
          type: Number
        },
        discount_percent: {
          required: true,
          type: Number
        },
        grand_total: {
          required: true,
          type: Number
        },
        total_messurement: {
          required: true,
          type: Number
        },
      }
    ],
    sub_total_amount: {
      required: true,
      type: Number
    },
    discount_percent_amount: {
      required: true,
      type: Number
    },
    grand_total_amount: {
      required: true,
      type: Number
    },
    received_amount: {
      required: true,
      type: Number
    },
    due_amount: {
      required: true,
      type: Number
    },
    total_messurement_count: {
      required: true,
      type: Number
    },
    order_note: {
      type: String
    },
    order_barcode: {
      type: String
    },
    order_barcode_image: {
      type: String
    },
    payment_type: {
      required: true,
      type: String
    },
    out_of_warehouse_date:{
      type: String
    },
    sale_target_id:{
      type: Schema.Types.ObjectId,
      ref: "saletargets",
    },
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

