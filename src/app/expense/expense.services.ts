
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
    .populate(["expense_publisher_id", "expense_updated_by"])
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
  const Expense = await ExpenseModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return Expense;
};
