import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { IBankInterface } from "../bank/bank.interface";
import { ISupplierInterface } from "../supplier/supplier.interface";
import { IProductInterface } from "../product/product.interface";
import { IStockManageInterface } from "../stock_manage/stock_manage.interface";

export interface IExpenseInterface {
  _id?: any;
  expense_title: string;
  expense_amount: number;
  expense_voucher?: string;
  salary_user_id?: Types.ObjectId | IUserInterface;
  expense_date?: string;
  expense_supplier_id?: Types.ObjectId | ISupplierInterface;
  expense_product_id?: Types.ObjectId | IProductInterface;
  expense_publisher_id: Types.ObjectId | IUserInterface;
  expense_updated_by?: Types.ObjectId | IUserInterface;
}

export const expenseSearchableField = [
  "expense_title",
  "expense_date"
];
