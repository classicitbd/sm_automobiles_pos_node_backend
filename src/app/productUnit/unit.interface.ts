import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";

export interface IProductUnitInterface {
  _id?: any;
  product_unit_name: string;
  product_unit_value: number;
  product_unit_publisher_id: Types.ObjectId | IUserInterface;
  product_unit_updated_by?: Types.ObjectId | IUserInterface;
}

export const productUnitSearchableField = ["product_unit_name"];
