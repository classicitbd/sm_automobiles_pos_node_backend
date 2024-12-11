import { Schema, model } from "mongoose";
import { IProductPerformanceInterface } from "./productSaleHistory.interface";

// productPerformance Schema
const productPerformanceSchema = new Schema<IProductPerformanceInterface>(
  {
    product_id: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "products",
    },
    order_id: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "orders",
    },
    product_sale_history_publisher_id: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const ProductPerformanceModel = model<IProductPerformanceInterface>(
  "productperformances",
  productPerformanceSchema
);

export default ProductPerformanceModel;
