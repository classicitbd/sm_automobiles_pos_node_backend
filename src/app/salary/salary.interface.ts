import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { ISaleTargetInterface } from "../sale_target/sale_target.interface";

export interface ISalaryInterface {
  _id?: any;
  user_id: Types.ObjectId | IUserInterface;
  user_phone: string;
  commision_id?: Types.ObjectId | ISaleTargetInterface;
  commision_amount: number;
  basic_salary: number;
  total_salary: number;
  add_or_deduct_amount: number;
  grand_total_amount: number;
  received_amount: number;
  due_amount: number;
  salary_month: string;
  salary_status: "paid" | "unpaid";
  salary_note?: string;
  salary_publisher_id: Types.ObjectId | IUserInterface;
  salary_updated_by?: Types.ObjectId | IUserInterface;
}

export const salarySearchableField = [
  "user_phone",
  "salary_month",
  "salary_status",
  "salary_note",
];
