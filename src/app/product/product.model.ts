import { Schema, model } from "mongoose";
import { IProductInterface } from "./product.interface";

// Product Schema
const productSchema = new Schema<IProductInterface>(
  {
    product_name: {
      required: true,
      type: String,
    },
    product_status: {
      type: String,
      enum: ["active", "in-active"],
      default: "active",
    },
    product_image: {
      type: String,
      required: true,
    },
    product_image_key: {
      type: String,
    },
    product_details: {
      type: String,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    brand_id: {
      type: Schema.Types.ObjectId,
      ref: "brands",
    },
    supplier_id: {
      type: Schema.Types.ObjectId,
      ref: "suppliers",
      required: true,
    },
    product_unit_id: {
      type: Schema.Types.ObjectId,
      ref: "units",
      required: true,
    },
    product_price: {
      type: Number,
    },
    product_buying_price: {
      type: Number,
    },
    product_quantity: {
      type: Number,
    },
    product_barcode: {
      type: String,
      required: true,
    },
    product_barcode_image: {
      type: String,
    },
    product_id: {
      type: String,
      required: true,
    },
    product_stock_low_alert: {
      type: Number,
    },
    total_sale: {
      type: Number,
      default: 0,
    },
    product_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    product_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = model<IProductInterface>("products", productSchema);

export default ProductModel;
