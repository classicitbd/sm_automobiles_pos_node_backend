import mongoose from "mongoose";
import { ILedgerInterface, ledgerSearchableField } from "./ledger.interface";
import LedgerModel from "./ledger.model";

// Create A Ledger
export const postLedgerServices = async (
  data: any,
  session: mongoose.ClientSession
): Promise<ILedgerInterface | {}> => {
  const createLedger: ILedgerInterface | {} = await LedgerModel.create([data], {
    session,
  });
  return createLedger;
};

// Find all  Ledger
export const findAllLedgerServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ILedgerInterface[] | []> => {
  const andCondition: any[] = [];
  if (searchTerm) {
    andCondition.push({
      $or: ledgerSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findLedger: ILedgerInterface[] | [] = await LedgerModel.find(
    whereCondition
  )
    .populate("ledger_publisher_id")
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findLedger;
};
