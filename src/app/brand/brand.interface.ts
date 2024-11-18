import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";

export interface IBrandInterface {
  _id?: any;
  brand_name: string;
  brand_publisher_id: Types.ObjectId | IUserInterface;
  brand_updated_by?: Types.ObjectId | IUserInterface;
}

export const brandSearchableField = [
  "brand_name"
];
