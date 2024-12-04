import { IBankInInterface } from "./bank_in.interface";
import BankInModel from "./bank_in.model";

// Create A BankIn
export const postBankInServices = async (
  data: IBankInInterface
): Promise<IBankInInterface | {}> => {
  const createBankIn: IBankInInterface | {} = await BankInModel.create(data);
  return createBankIn;
};
