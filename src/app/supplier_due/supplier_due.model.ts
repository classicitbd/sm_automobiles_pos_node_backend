import { Schema, model } from "mongoose";
import { ISupplierDueInterface } from "./supplier_due.interface";

// Supplier Due Schema
const supplierDueSchema = new Schema<ISupplierDueInterface>(
  {
    supplier_due_title: {
      required: true,
      type: String,
    },
    supplier_due_date: {
      type: String,
    },
    supplier_due_amount: {
      required: true,
      type: Number,
    },
    supplier_id: {
      type: Schema.Types.ObjectId,
      ref: "suppliers",
      required: true,
    },
    supplier_due_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    supplier_due_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const SupplierDueModel = model<ISupplierDueInterface>(
  "supplierdues",
  supplierDueSchema
);

export default SupplierDueModel;
