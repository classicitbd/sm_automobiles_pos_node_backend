import { Schema, model } from "mongoose";
import { IProductPriceUpdateHistoryInterface } from "./product_price_update_history.interface";

// productPriceUpdatedHistory Schema
const productPriceUpdatedHistorySchema = new Schema<IProductPriceUpdateHistoryInterface>(
  {
    product_previous_price: {
      required: true,
      type: Number,
    },
    product_updated_price: {
      required: true,
      type: Number,
    },
    product_quantity: {
      required: true,
      type: Number,
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    price_update_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    price_update_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const ProductPriceUpdateHistoryModel = model<IProductPriceUpdateHistoryInterface>("productpriceupdatedhistories", productPriceUpdatedHistorySchema);

export default ProductPriceUpdateHistoryModel;
