import { expenseSearchableField, IExpenseInterface } from "./expense.interface";
import ExpenseModel from "./expense.model";
import mongoose from "mongoose";

// Create A Expense
export const postExpenseWhenProductStockAddServices = async (
  data: IExpenseInterface,
  session: mongoose.ClientSession
): Promise<IExpenseInterface | {}> => {
  const createExpense: IExpenseInterface | {} = await ExpenseModel.create([data], {
    session,
  });
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
