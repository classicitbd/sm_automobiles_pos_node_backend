import { Schema, model } from "mongoose";
import { IStockManageInterface } from "./stock_manage.interface";

// StockManage Schema
const stockManageSchema = new Schema<IStockManageInterface>(
  {
    product_buying_price: {
      required: true,
      type: Number,
    },
    product_selling_price: {
      required: true,
      type: Number,
    },
    product_quantity: {
      required: true,
      type: Number,
    },
    product_note: {
      type: String,
    },
    supplier_id: {
      type: Schema.Types.ObjectId,
      ref: "suppliers",
      required: true,
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    stock_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    stock_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const StockManageModel = model<IStockManageInterface>(
  "stocks",
  stockManageSchema
);

export default StockManageModel;
