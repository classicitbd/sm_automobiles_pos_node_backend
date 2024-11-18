import { Types } from "mongoose";
import { IUserInterface } from "../user/user.interface";

export interface IRoleInterface {
  _id?: any;
  role_name: string;
  role_publisher_id: Types.ObjectId | IUserInterface;
  role_updated_by?: Types.ObjectId | IUserInterface;
  dashboard_show?: true | false;
  category_show?: true | false;
  category_create?: true | false;
  category_update?: true | false;
  category_delete?: true | false;
  brand_show?: true | false;
  brand_create?: true | false;
  brand_update?: true | false;
  brand_delete?: true | false;
  product_show?: true | false;
  product_create?: true | false;
  product_update?: true | false;
  product_delete?: true | false;
  staff_show?: true | false;
  staff_create?: true | false;
  staff_update?: true | false;
  staff_delete?: true | false;
  staff_permission_show?: true | false;
  staff_permission_create?: true | false;
  staff_permission_update?: true | false;
  staff_permission_delete?: true | false;
}
