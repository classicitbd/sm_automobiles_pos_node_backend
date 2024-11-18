import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";

export interface ICategoryInterface {
  _id?: any;
  category_name: string;
  category_publisher_id: Types.ObjectId | IUserInterface;
  category_updated_by?: Types.ObjectId | IUserInterface;
}

export const categorySearchableField = [
  "category_name",
];
