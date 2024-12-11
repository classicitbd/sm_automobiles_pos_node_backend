import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { IProductInterface } from "../product/product.interface";
import { IOrderInterface } from "../order/order.interface";

export interface IProductPerformanceInterface {
  _id?: any;
  product_id: Types.ObjectId | IProductInterface;
  order_id: Types.ObjectId | IOrderInterface;
  product_sale_history_publisher_id: Types.ObjectId | IUserInterface;
}
