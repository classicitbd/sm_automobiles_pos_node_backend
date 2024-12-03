import { Schema, model } from "mongoose";
import { IUserInterface } from "./user.interface";

// User Schema
const userSchema = new Schema<IUserInterface>(
  {
    user_name: {
      type: String,
    },
    user_phone: {
      type: String,
    },
    user_password: {
      type: String,
    },
    user_address: {
      type: String,
    },
    red_alert_number: {
      type: Number,
    },
    user_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    user_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    user_role_id: {
      type: Schema.Types.ObjectId,
      ref: "roles",
    },
    user_status: {
      type: String,
      enum: ["active", "in-active"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model<IUserInterface>("users", userSchema);

export default UserModel;
