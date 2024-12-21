import { ICashBalanceUpdateHistoryInterface } from "./cashBalanceUpdateHistory.interface";
import CashBalanceUpdateHistoryModel from "./cashBalanceUpdateHistory.model";

// Create A CashBalanceUpdateHistory
export const postCashBalanceUpdateHistoryServices = async (
  data: ICashBalanceUpdateHistoryInterface,
  session: any
): Promise<ICashBalanceUpdateHistoryInterface | {}> => {
  const createCashBalanceUpdateHistory:
    | ICashBalanceUpdateHistoryInterface
    | {} = await CashBalanceUpdateHistoryModel.create([data], { session });
  return createCashBalanceUpdateHistory;
};

// Find CashBalanceUpdateHistory
export const findACashBalanceUpdateHistoryServices = async (
  limitNumber: number,
  skip: number
): Promise<ICashBalanceUpdateHistoryInterface[] | any> => {
  const findCashBalanceUpdateHistory:
    | ICashBalanceUpdateHistoryInterface[]
    | any = await CashBalanceUpdateHistoryModel.find({})
    .populate("publisher_id")
    .skip(skip)
    .limit(limitNumber)
    .sort({ _id: -1 })
    .select("-__v");
  return findCashBalanceUpdateHistory;
};
