import { Types } from "mongoose";
import { IProductInterface } from "../product/product.interface";
import { IUserInterface } from "../user/user.interface";

export interface IProductPriceUpdateHistoryInterface {
  _id?: any;
  product_previous_price: number;
  product_updated_price: number;
  product_quantity: number;
  product_id: Types.ObjectId | IProductInterface;
  price_update_publisher_id: Types.ObjectId | IUserInterface;
  price_update_updated_by?: Types.ObjectId | IUserInterface;
}
