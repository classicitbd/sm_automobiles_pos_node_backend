import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { ISupplierInterface } from "../supplier/supplier.interface";
import { IProductInterface } from "../product/product.interface";

export interface ISupplierMoneyAddInterface {
  _id?: any;
  supplier_money_add_title: string;
  supplier_money_add_amount: number;
  supplier_money_product_id?: Types.ObjectId | IProductInterface;
  supplier_money_product_quantity?: number;
  supplier_money_product_price?: number;
  supplier_id: Types.ObjectId | ISupplierInterface;
  supplier_money_add_publisher_id: Types.ObjectId | IUserInterface;
  supplier_money_add_updated_by?: Types.ObjectId | IUserInterface;
}


export const supplierMoneyAddSearchableField = [
  "supplier_money_add_title"
];