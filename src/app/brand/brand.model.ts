import { Schema, model } from "mongoose";
import { IBrandInterface } from "./brand.interface";

// Brand Schema
const brandSchema = new Schema<IBrandInterface>(
  {
    brand_name: {
      required: true,
      type: String
    },
    brand_status: {
      type: String,
      enum: ["active", "in-active"],
      default: "active",
    },
    brand_publisher_id: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    brand_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const BrandModel = model<IBrandInterface>("brands", brandSchema);

export default BrandModel;
