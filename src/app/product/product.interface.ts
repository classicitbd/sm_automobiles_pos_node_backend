import { Types } from "mongoose";
import { ICategoryInterface } from "../category/category.interface";
import { IBrandInterface } from "../brand/brand.interface";
import { IUserInterface } from "../user/user.interface";
import { IProductUnitInterface } from "../productUnit/unit.interface";
import { ISupplierInterface } from "../supplier/supplier.interface";

export interface IProductInterface {
  _id?: any;
  product_name: string;
  product_status: "active" | "in-active";
  product_image: string;
  product_image_key?: string;
  product_details?: string;
  category_id: Types.ObjectId | ICategoryInterface;
  brand_id?: Types.ObjectId | IBrandInterface;
  supplier_id: Types.ObjectId | ISupplierInterface; 
  product_unit_id: Types.ObjectId | IProductUnitInterface;
  product_price?: number;
  product_buying_price?: number;
  product_quantity?: number;
  product_stock_low_alert?: number;
  total_sale?: number;
  product_barcode: string;
  product_barcode_image?: string;
  product_id: string;
  product_publisher_id: Types.ObjectId | IUserInterface;
  product_updated_by?: Types.ObjectId | IUserInterface;
}

export const productSearchableField = [
  "product_name",
  "product_status",
  "product_details",
  "product_barcode",
  "product_id",
  "product_unit",
];
