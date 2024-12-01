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
  product_total_price: number;
}

export interface IOrderInterface {
  _id?: any;
  order_id: string;
  order_status:
    | "pending"
    | "processing"
    | "shipped"
    | "confirmed"
    | "cancelled"
    | "returned";
  customer_id: Types.ObjectId | ICustomerInterface;
  customer_previous_due?: number;
  customer_previous_advance?: number;
  sub_total_amount: number;
  discount_percent_amount?: number;
  grand_total_amount: number;
  payment_type: "full-payment" | "partial-payment" | "due-payment";
  partial_payment_amount?: number;
  partial_payment_bank_id?: Types.ObjectId | IBankInterface;
  partial_payment_transaction_id?: string;
  received_amount: number;
  due_amount: number;
  final_total_amount: number;
  order_products: IOrderProductInterface[];
  order_publisher_id: Types.ObjectId | IUserInterface;
  order_updated_by?: Types.ObjectId | IUserInterface;
}

export const orderSearchableField = [
  "payment_type",
  "partial_payment_transaction_id",
  "order_id",
  "order_status"
];
