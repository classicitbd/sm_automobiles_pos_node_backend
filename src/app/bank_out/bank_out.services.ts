import mongoose from "mongoose";
import { IBankOutInterface } from "./bank_out.interface";
import BankOutModel from "./bank_out.model";

// Create A BankOut
export const postBankOutServices = async (
  data: IBankOutInterface,
  session?: mongoose.ClientSession
): Promise<IBankOutInterface | {}> => {
  const createBankOut: IBankOutInterface | {} = await BankOutModel.create(
    [data],
    {
      session,
    }
  );
  return createBankOut;
};
