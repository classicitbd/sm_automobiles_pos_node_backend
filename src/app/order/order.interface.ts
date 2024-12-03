import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { IProductInterface } from "../product/product.interface";
import { ICustomerInterface } from "../customer/customer.interface";

export interface IOrderProductInterface {
  product_id: Types.ObjectId | IProductInterface;
  product_quantity: number;
  product_price: number;
  product_buying_price: number;
  product_total_price: number;
}

export interface IOrderInterface {
  _id?: any;
  order_id: string;
  order_status:
    | "pending"
    | "processing"
    | "confirmed"
    | "cancelled"
    | "returned";
  customer_id: Types.ObjectId | ICustomerInterface;
  customer_previous_due?: number;
  customer_previous_advance?: number;
  sub_total_amount: number;
  discount_percent_amount?: number;
  grand_total_amount: number;
  order_note?: string;
  order_barcode?: string;
  order_barcode_image?: string;
  order_products: IOrderProductInterface[];
  order_publisher_id: Types.ObjectId | IUserInterface;
  order_updated_by?: Types.ObjectId | IUserInterface;
}

export const orderSearchableField = [
  "payment_type",
  "payment_transaction_id",
  "order_id",
  "order_status",
  "order_note"
];



// export interface IOrderInterface {
//   _id?: any;
//   order_id: string;
//   order_status:
//     | "pending"
//     | "processing"
//     | "confirmed"
//     | "cancelled"
//     | "returned";
//   customer_id: Types.ObjectId | ICustomerInterface;
//   customer_previous_due?: number;
//   customer_previous_advance?: number;
//   payment_type: "full-payment" | "partial-payment" | "due-payment";
//   payment_bank_id?: Types.ObjectId | IBankInterface;
//   payment_transaction_id?: string;
//   sub_total_amount: number;
//   discount_percent_amount?: number;
//   received_amount: number;
//   due_amount: number;
//   grand_total_amount: number;
//   order_note?: string;
//   order_products: IOrderProductInterface[];
//   order_publisher_id: Types.ObjectId | IUserInterface;
//   order_updated_by?: Types.ObjectId | IUserInterface;
// }