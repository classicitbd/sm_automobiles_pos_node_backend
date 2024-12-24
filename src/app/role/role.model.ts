import { Schema, model } from "mongoose";
import { IRoleInterface } from "./role.interface";

// Role Schema
const roleSchema = new Schema<IRoleInterface>(
  {
    role_name: {
      required: true,
      type: String,
    },
    role_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    role_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    dashboard_show: {
      type: Boolean,
      default: false,
    },
    category_post: {
      type: Boolean,
      default: false,
    },
    category_patch: {
      type: Boolean,
      default: false,
    },
    brand_post: {
      type: Boolean,
      default: false,
    },
    brand_patch: {
      type: Boolean,
      default: false,
    },
    unit_dashboard_show: {
      type: Boolean,
      default: false,
    },
    unit_post: {
      type: Boolean,
      default: false,
    },
    unit_patch: {
      type: Boolean,
      default: false,
    },
    site_setting_patch: {
      type: Boolean,
      default: false,
    },
    user_post: {
      type: Boolean,
      default: false,
    },
    user_patch: {
      type: Boolean,
      default: false,
    },
    user_dashboard_show: {
      type: Boolean,
      default: false,
    },
    role_post: {
      type: Boolean,
      default: false,
    },
    role_patch: {
      type: Boolean,
      default: false,
    },
    sale_target_post: {
      type: Boolean,
      default: false,
    },
    sale_target_patch: {
      type: Boolean,
      default: false,
    },
    supplier_dashboard_show: {
      type: Boolean,
      default: false,
    },
    supplier_post: {
      type: Boolean,
      default: false,
    },
    supplier_patch: {
      type: Boolean,
      default: false,
    },
    supplier_payment_post: {
      type: Boolean,
      default: false,
    },
    supplier_payment_patch: {
      type: Boolean,
      default: false,
    },
    supplier_paid_payment_show: {
      type: Boolean,
      default: false,
    },
    supplier_unpaid_payment_show: {
      type: Boolean,
      default: false,
    },
    supplier_check_or_cash_out_payment_show: {
      type: Boolean,
      default: false,
    },
    supplier_payment_dashboard_show: {
      type: Boolean,
      default: false,
    },
    cash_patch: {
      type: Boolean,
      default: false,
    },
    bank_dashboard_show: {
      type: Boolean,
      default: false,
    },
    bank_post: {
      type: Boolean,
      default: false,
    },
    bank_patch: {
      type: Boolean,
      default: false,
    },
    customer_dashboard_show: {
      type: Boolean,
      default: false,
    },
    customer_post: {
      type: Boolean,
      default: false,
    },
    customer_patch: {
      type: Boolean,
      default: false,
    },
    check_dashboard_show: {
      type: Boolean,
      default: false,
    },
    customer_ar_show: {
      type: Boolean,
      default: false,
    },
    check_today_dashboard_show: {
      type: Boolean,
      default: false,
    },
    check_due_dashboard_show: {
      type: Boolean,
      default: false,
    },
    check_or_cash_in_payment_show: {
      type: Boolean,
      default: false,
    },
    product_post: {
      type: Boolean,
      default: false,
    },
    product_patch: {
      type: Boolean,
      default: false,
    },
    product_dashboard_show: {
      type: Boolean,
      default: false,
    },
    stock_post: {
      type: Boolean,
      default: false,
    },
    stock_ap_show: {
      type: Boolean,
      default: false,
    },
    expense_show: {
      type: Boolean,
      default: false,
    },
    expense_post: {
      type: Boolean,
      default: false,
    },
    income_show: {
      type: Boolean,
      default: false,
    },
    order_post: {
      type: Boolean,
      default: false,
    },
    order_patch: {
      type: Boolean,
      default: false,
    },
    order_dashboard_show: {
      type: Boolean,
      default: false,
    },
    profit_show: {
      type: Boolean,
      default: false,
    },
    management_order_show: {
      type: Boolean,
      default: false,
    },
    account_order_show: {
      type: Boolean,
      default: false,
    },
    warehouse_order_show: {
      type: Boolean,
      default: false,
    },
    out_of_warehouse_order_show: {
      type: Boolean,
      default: false,
    },
    ledger_show: {
      type: Boolean,
      default: false,
    },
    order_invoice_print: {
      type: Boolean,
      default: false,
    },
    order_challan_print: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const RoleModel = model<IRoleInterface>("roles", roleSchema);

export default RoleModel;
