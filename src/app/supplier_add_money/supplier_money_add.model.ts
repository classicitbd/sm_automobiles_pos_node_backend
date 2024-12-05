import { Schema, model } from "mongoose";
import { ISupplierMoneyAddInterface } from "./supplier_money_add.interface";

// Supplier money add Schema
const supplierMoneyAddSchema = new Schema<ISupplierMoneyAddInterface>(
  {
    supplier_money_add_title: {
      required: true,
      type: String,
    },
    supplier_money_add_amount: {
      required: true,
      type: Number,
    },
    supplier_money_product_id: {
      type: Schema.Types.ObjectId,
      ref: "products",
    },
    supplier_money_product_quantity: {
      type: Number,
    },
    supplier_money_product_price: {
      type: Number,
    },
    supplier_id: {
      type: Schema.Types.ObjectId,
      ref: "suppliers",
      required: true,
    },
    supplier_money_add_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    supplier_money_add_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const SupplierMoneyAddModel = model<ISupplierMoneyAddInterface>(
  "suppliermoneyadds",
  supplierMoneyAddSchema
);

export default SupplierMoneyAddModel;
