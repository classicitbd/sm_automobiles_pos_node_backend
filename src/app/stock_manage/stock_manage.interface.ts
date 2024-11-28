import { Types } from "mongoose";
import { IProductInterface } from "../product/product.interface";
import { IUserInterface } from "../user/user.interface";

export interface IStockManageInterface {
  _id?: any;
  product_selling_price: number;
  product_buying_price: number;
  product_quantity: number;
  product_note: string;
  product_id: Types.ObjectId | IProductInterface;
  stock_publisher_id: Types.ObjectId | IUserInterface;
  stock_updated_by?: Types.ObjectId | IUserInterface;
}

export const stockManageSearchableField = [
  "product_note"
];
