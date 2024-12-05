import { Schema, model } from "mongoose";
import { ISupplierInterface } from "./supplier.interface";

// Coupon Schema
const supplierSchema = new Schema<ISupplierInterface>(
  {
    supplier_name: {
      required: true,
      type: String,
    },
    supplier_wallet_amount: {
      required: true,
      type: Number,
      default: 0,
    },
    oppening_balance: {
      required: true,
      type: Number,
      default: 0,
    },
    supplier_phone: {
      required: true,
      type: String,
    },
    supplier_address: {
      required: true,
      type: String,
    },
    supplier_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    supplier_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const SupplierModel = model<ISupplierInterface>("suppliers", supplierSchema);

export default SupplierModel;
