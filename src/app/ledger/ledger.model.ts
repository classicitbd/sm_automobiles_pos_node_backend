import { Schema, model } from "mongoose";
import { ILedgerInterface } from "./ledger.interface";

// ledger Schema
const ledgerSchema = new Schema<ILedgerInterface>(
  {
    ledger_title: {
      required: true,
      type: String,
    },
    ledger_category: {
      required: true,
      type: String,
    },
    ledger_debit: {
      type: Number,
    },
    ledger_credit: {
      type: Number,
    },
    ledger_balance: {
      required: true,
      type: Number,
      default: 0,
    },
    ledger_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LedgerModel = model<ILedgerInterface>("ledgers", ledgerSchema);

export default LedgerModel;
