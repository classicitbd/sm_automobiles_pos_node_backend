import { Schema, model } from "mongoose";
import { IRoleInterface } from "./role.interface";

// Role Schema
const roleSchema = new Schema<IRoleInterface>(
  {
    role_name: {
      required: true,
      type: String,
    },
    role_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    role_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    dashboard_show: {
      type: Boolean,
      default: false,
    },
    category_show: {
      type: Boolean,
      default: false,
    },
    category_create: {
      type: Boolean,
      default: false,
    },
    category_update: {
      type: Boolean,
      default: false,
    },
    category_delete: {
      type: Boolean,
      default: false,
    },
    brand_show: {
      type: Boolean,
      default: false,
    },
    brand_create: {
      type: Boolean,
      default: false,
    },
    brand_update: {
      type: Boolean,
      default: false,
    },
    brand_delete: {
      type: Boolean,
      default: false,
    },
    product_show: {
      type: Boolean,
      default: false,
    },
    product_create: {
      type: Boolean,
      default: false,
    },
    product_update: {
      type: Boolean,
      default: false,
    },
    product_delete: {
      type: Boolean,
      default: false,
    },
    staff_show: {
      type: Boolean,
      default: false,
    },
    staff_create: {
      type: Boolean,
      default: false,
    },
    staff_update: {
      type: Boolean,
      default: false,
    },
    staff_delete: {
      type: Boolean,
      default: false,
    },
    staff_permission_show: {
      type: Boolean,
      default: false,
    },
    staff_permission_create: {
      type: Boolean,
      default: false,
    },
    staff_permission_update: {
      type: Boolean,
      default: false,
    },
    staff_permission_delete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const RoleModel = model<IRoleInterface>("roles", roleSchema);

export default RoleModel;
