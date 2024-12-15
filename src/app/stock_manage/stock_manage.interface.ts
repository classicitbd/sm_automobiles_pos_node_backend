import { Types } from "mongoose";
import { IProductInterface } from "../product/product.interface";
import { IUserInterface } from "../user/user.interface";
import { ISupplierInterface } from "../supplier/supplier.interface";

export interface IStockManageInterface {
  _id?: any;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  invoice_id: string;
  payment_status: "paid" | "unpaid";
  product_selling_price: number;
  product_buying_price: number;
  product_quantity: number;
  product_note: string;
  product_id: Types.ObjectId | IProductInterface;
  supplier_id: Types.ObjectId | ISupplierInterface;
  stock_publisher_id: Types.ObjectId | IUserInterface;
  stock_updated_by?: Types.ObjectId | IUserInterface;
}

export const stockManageSearchableField = [
  "product_note"
];
