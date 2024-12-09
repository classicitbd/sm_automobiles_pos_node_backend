import { Schema, model } from "mongoose";
import { ISaleTargetInterface } from "./sale_target.interface";

// saleTarget Schema
const saleTargetSchema = new Schema<ISaleTargetInterface>(
  {
    user_id: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    sale_target_start_date: {
      required: true,
      type: String,
    },
    sale_target_end_date: {
      required: true,
      type: String,
    },
    sale_target: {
      required: true,
      type: Number,
    },
    sale_target_amount: {
      required: true,
      type: Number,
    },
    sale_target_filup: {
      required: true,
      type: Number,
      default: 0
    },
    sale_target_success: {
      type: Boolean,
      default: false,
    },
    sale_target_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    sale_target_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    }
  },
  {
    timestamps: true,
  }
);

const SaleTargetModel = model<ISaleTargetInterface>("saletargets", saleTargetSchema);

export default SaleTargetModel;
