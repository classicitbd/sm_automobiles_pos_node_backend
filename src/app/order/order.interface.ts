import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { IProductInterface } from "../product/product.interface";
import { ICustomerInterface } from "../customer/customer.interface";
import { IBankInterface } from "../bank/bank.interface";

export interface IOrderProductInterface {
  product_id: Types.ObjectId | IProductInterface;
  product_quantity: number;
  product_price: number;
  product_buying_price: number;
  total_amount: number;
  discount_percent: number;
  grand_total: number;
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
  order_note?: string;
  order_barcode?: string;
  order_barcode_image?: string;
  payment_type: string;
  payment_method?: string;
  pay_amount?: number;
  bank_id?: Types.ObjectId | IBankInterface;
  check_number?: string;
  check_withdraw_date?: string;
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