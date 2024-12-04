import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";

export interface ISiteSettingInterface {
  _id?: any;
  logo?: string;
  favicon?: string;
  title?: string;
  emergency_contact?: string;
  email?: string;
  address?: string;
  unit_name?: string;
  setting_updated_by: Types.ObjectId | IUserInterface;
}
