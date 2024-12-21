import { IBankBalanceUpdateHistoryInterface } from "./bankBalanceUpdateHistory.interface";
import BankBalanceUpdateHistoryModel from "./bankBalanceUpdateHistory.model";

// Create A BankBalanceUpdateHistory
export const postBankBalanceUpdateHistoryServices = async (
  data: IBankBalanceUpdateHistoryInterface,
  session: any
): Promise<IBankBalanceUpdateHistoryInterface | {}> => {
  const createBankBalanceUpdateHistory:
    | IBankBalanceUpdateHistoryInterface
    | {} = await BankBalanceUpdateHistoryModel.create([data], { session });
  return createBankBalanceUpdateHistory;
};

// Find BankBalanceUpdateHistory
export const findABankBalanceUpdateHistoryServices = async (
  limitNumber: number,
  skip: number,
  bank_id: any
): Promise<IBankBalanceUpdateHistoryInterface[] | any> => {
  const findBankBalanceUpdateHistory:
    | IBankBalanceUpdateHistoryInterface[]
    | any = await BankBalanceUpdateHistoryModel.find({ bank_id: bank_id })
    .populate("publisher_id")
    .skip(skip)
    .limit(limitNumber)
    .sort({ _id: -1 })
    .select("-__v");
  return findBankBalanceUpdateHistory;
};
