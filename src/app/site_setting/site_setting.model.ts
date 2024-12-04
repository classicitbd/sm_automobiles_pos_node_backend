import { Schema, model } from "mongoose";
import { ISiteSettingInterface } from "./site_setting.interface";

// site setting Schema
const site_settingSchema = new Schema<ISiteSettingInterface>(
  {
    logo: {
      type: String,
    },
    favicon: {
      type: String,
    },
    title: {
      type: String,
    },
    emergency_contact: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    unit_name: {
      type: String,
    },
    setting_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettingModel = model<ISiteSettingInterface>(
  "settings",
  site_settingSchema
);

export default SiteSettingModel;
