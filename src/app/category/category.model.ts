import { Schema, model } from "mongoose";
import { ICategoryInterface } from "./category.interface";

// Category Schema
const categorySchema = new Schema<ICategoryInterface>(
  {
    category_name: {
      required: true,
      type: String,
    },
    category_status: {
      type: String,
      enum: ["active", "in-active"],
      default: "active",
    },
    category_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    category_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = model<ICategoryInterface>("categories", categorySchema);

export default CategoryModel;
