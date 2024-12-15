import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { IProductInterface } from "../product/product.interface";
import { ICustomerInterface } from "../customer/customer.interface";
import { ISaleTargetInterface } from "../sale_target/sale_target.interface";

export interface IOrderProductInterface {
  product_id: Types.ObjectId | IProductInterface;
  product_quantity: number;
  product_price: number;
  product_buying_price: number;
  total_amount: number;
  discount_percent: number;
  grand_total: number;
  total_messurement: number;
}

export interface IOrderInterface {
  _id?: any;
  order_id: string;
  order_status: "management"
  | "warehouse"
  | "out-of-warehouse";
  customer_id: Types.ObjectId | ICustomerInterface;
  order_products: IOrderProductInterface[];
  sub_total_amount: number;
  discount_percent_amount?: number;
  grand_total_amount: number;
  received_amount: number;
  due_amount: number;
  payment_status: "paid" | "unpaid";
  total_messurement_count: number;
  order_note?: string;
  order_barcode?: string;
  order_barcode_image?: string;
  payment_type: string;
  out_of_warehouse_date?: string;
  sale_target_id?: Types.ObjectId | ISaleTargetInterface;
  order_publisher_id: Types.ObjectId | IUserInterface;
  order_updated_by?: Types.ObjectId | IUserInterface;
}

export const orderSearchableField = [
  "order_status",
  "order_id",
  "order_note",
  "order_barcode",
  "payment_type",
  "payment_method",
  "check_number",
  "check_withdraw_date"
];
