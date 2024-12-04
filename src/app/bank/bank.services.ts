import { bankSearchableField, IBankInterface } from "./bank.interface";
import BankModel from "./bank.model";

// Create A Bank
export const postBankServices = async (
  data: IBankInterface
): Promise<IBankInterface | {}> => {
  const createBank: IBankInterface | {} = await BankModel.create(data);
  return createBank;
};

// Find Bank
export const findAllBankServices = async (): Promise<
  IBankInterface[] | []
> => {
  const findBank: IBankInterface[] | [] = await BankModel.find({})
    .sort({ _id: -1 })
    .select("-__v");
  return findBank;
};

// Find all dashboard Bank
export const findAllDashboardBankServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<IBankInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: bankSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findBank: IBankInterface[] | [] = await BankModel.find(
    whereCondition
  ).populate(["bank_publisher_id", "bank_updated_by"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findBank;
};

// Update a Bank
export const updateBankServices = async (
  data: IBankInterface,
  _id: string
): Promise<IBankInterface | any> => {
  const updateBankInfo: IBankInterface | null = await BankModel.findOne({
    _id: _id,
  });
  if (!updateBankInfo) {
    return {};
  }
  const Bank = await BankModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return Bank;
};
