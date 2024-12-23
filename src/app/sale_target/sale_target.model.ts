import { Schema, model } from "mongoose";
import { ISaleTargetInterface } from "./sale_target.interface";

// saleTarget Schema
const saleTargetSchema = new Schema<ISaleTargetInterface>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    sale_target_start_date: {
      type: String,
    },
    sale_target_end_date: {
      type: String,
    },
    brand_id: {
      type: Schema.Types.ObjectId,
      ref: "brands",
    },
    brand_sale_target: {
      type: Number,
    },
    brand_sale_target_fillup: {
      type: Number,
      default: 0,
    },
    brand_sale_target_success: {
      type: Boolean,
      default: false,
    },
    sale_target: {
      type: Number,
    },
    sale_target_fillup: {
      type: Number,
      default: 0,
    },
    sale_target_success: {
      type: Boolean,
      default: false,
    },
    first_half_amount_per_unit: {
      type: Number,
    },
    second_half_amount_per_unit: {
      type: Number,
    },
    sale_target_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    sale_target_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const SaleTargetModel = model<ISaleTargetInterface>("saletargets", saleTargetSchema);

export default SaleTargetModel;
