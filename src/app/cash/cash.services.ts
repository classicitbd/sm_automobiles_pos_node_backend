import { ICashInterface } from "./cash.interface";
import CashModel from "./cash.model";

// Create A Cash
export const postCashServices = async (
  data: ICashInterface
): Promise<ICashInterface | {}> => {
  const createCash: ICashInterface | {} = await CashModel.create(data);
  return createCash;
};

// Find Cash
export const findACashServices = async (): Promise<ICashInterface | any> => {
  const findCash: ICashInterface | any = await CashModel.findOne({}).populate(["cash_publisher_id", "cash_updated_by"])
    .select("-__v");
  return findCash;
};

// Update a Cash
export const updateCashServices = async (
  data: ICashInterface,
  _id: string
): Promise<ICashInterface | any> => {
  const updateCashInfo: ICashInterface | null = await CashModel.findOne({
    _id: _id,
  });
  if (!updateCashInfo) {
    return {};
  }
  const Cash = await CashModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return Cash;
};
