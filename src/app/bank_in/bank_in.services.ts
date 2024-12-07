import mongoose from "mongoose";
import { IBankInInterface } from "./bank_in.interface";
import BankInModel from "./bank_in.model";

// Create A BankIn
export const postBankInServices = async (
  data: any,
  session: mongoose.ClientSession
): Promise<IBankInInterface | {}> => {
  const createBankIn: IBankInInterface | {} = await BankInModel.create([data], {
    session,
  });
  return createBankIn;
};
