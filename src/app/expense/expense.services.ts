import { expenseSearchableField, IExpenseInterface } from "./expense.interface";
import ExpenseModel from "./expense.model";
import ApiError from "../../errors/ApiError";

// Create A Expense
export const postExpenseServices = async (
  data: IExpenseInterface
): Promise<IExpenseInterface | {}> => {
  const createExpense: IExpenseInterface | {} = await ExpenseModel.create(data);
  return createExpense;
};

// Find all Dashboard Expense
export const findAllDashboardExpenseServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<IExpenseInterface[] | []> => {
  const andCondition: any[] = [];
  if (searchTerm) {
    andCondition.push({
      $or: expenseSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findExpense: IExpenseInterface[] | [] = await ExpenseModel.find(
    whereCondition
  )
    .populate(["expense_publisher_id", "expense_updated_by", "expense_bank_id"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findExpense;
};

// Update a Expense
export const updateExpenseServices = async (
  data: IExpenseInterface,
  _id: string
): Promise<IExpenseInterface | any> => {
  const updateExpenseInfo: IExpenseInterface | null =
    await ExpenseModel.findOne({
      _id: _id,
    });
  if (!updateExpenseInfo) {
    throw new ApiError(400, "Expense Not Found !");
  }

  // আপডেট করার ডেটা তৈরি করা হচ্ছে
  const updateData: any = { ...data };

  // যদি `expense_bank_id` পাঠানো না হয়, তাহলে সেটি ডিলিট করা হবে
  const unsetData: any = {};
  if (!data.hasOwnProperty("expense_bank_id")) {
    unsetData.expense_bank_id = "";
  }
  if (!data.hasOwnProperty("expense_voucher")) {
    unsetData.expense_voucher = "";
  }
  if (!data.hasOwnProperty("expense_voucher_key")) {
    unsetData.expense_voucher_key = "";
  }

  const Expense = await ExpenseModel.updateOne(
    { _id: _id },
    {
      $set: updateData, // পাঠানো ফিল্ড আপডেট করা
      $unset: unsetData, // পাঠানো না হলে ফিল্ডগুলো মুছে ফেলা
    },
    {
      runValidators: true,
    }
  );
  return Expense;
};
