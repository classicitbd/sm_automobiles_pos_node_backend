import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";
import { IBrandInterface } from "../brand/brand.interface";

export interface ISaleTargetInterface {
  _id?: any;
  user_id: Types.ObjectId | IUserInterface;
  sale_target_start_date: string;
  sale_target_end_date: string;
  brand_id: Types.ObjectId | IBrandInterface;
  brand_sale_target: number;
  brand_sale_target_fillup: number;
  brand_sale_target_success: true | false;
  sale_target: number;
  sale_target_fillup: number;
  sale_target_success: true | false;
  first_half_amount_per_unit: number;
  second_half_amount_per_unit: number;
  sale_target_publisher_id: Types.ObjectId | IUserInterface;
  sale_target_updated_by?: Types.ObjectId | IUserInterface;
}

export const saleTargetSearchableField = [
  "sale_target_start_date",
  "sale_target_end_date",
];


// import { Types } from "mongoose";
// import { IUserInterface } from "../user/user.interface";

// export interface ISaleTargetInterface {
//   _id?: any;
//   user_id: Types.ObjectId | IUserInterface;
//   sale_target_start_date: string;
//   sale_target_end_date: string;
//   sale_target: number;
//   sale_target_amount: number;
//   sale_target_filup: number;
//   sale_target_success: true | false;
//   sale_target_publisher_id: Types.ObjectId | IUserInterface;
//   sale_target_updated_by?: Types.ObjectId | IUserInterface;
// }

// export const saleTargetSearchableField = [
//   "sale_target_start_date",
//   "sale_target_end_date",
// ];
