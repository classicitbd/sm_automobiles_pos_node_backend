import { Schema, model } from "mongoose";
import { IProductUnitInterface } from "./unit.interface";

// product_unit Schema
const product_unitSchema = new Schema<IProductUnitInterface>(
  {
    product_unit_name: {
      required: true,
      type: String,
    },
    product_unit_value: {
      required: true,
      type: Number,
    },
    product_unit_publisher_id: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    product_unit_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const ProductUnitModel = model<IProductUnitInterface>("units", product_unitSchema);

export default ProductUnitModel;
