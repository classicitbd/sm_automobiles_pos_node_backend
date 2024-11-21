import { Schema, model } from "mongoose";
import { IShowroomInterface } from "./showroom.interface";

// showroom Schema
const showroomSchema = new Schema<IShowroomInterface>(
  {
    showroom_name: {
      required: true,
      type: String,
    },
    showroom_status: {
      type: String,
      enum: ["active", "in-active"],
      default: "active",
    },
    showroom_publisher_id: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    showroom_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const ShowroomModel = model<IShowroomInterface>("showrooms", showroomSchema);

export default ShowroomModel;
