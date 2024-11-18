import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";

export interface IShowroomInterface {
  _id?: any;
  showroom_name: string;
  showroom_publisher_id: Types.ObjectId | IUserInterface;
  showroom_updated_by?: Types.ObjectId | IUserInterface;
}

export const showroomSearchableField = [
  "showroom_name"
];
