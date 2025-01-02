import mongoose from "mongoose";
import ApiError from "../../errors/ApiError";
import { ISalaryInterface, salarySearchableField } from "./salary.interface";
import SalaryModel from "./salary.model";

// Create A Salary
export const postSalaryServices = async (
  data: ISalaryInterface,
  session: mongoose.ClientSession
): Promise<ISalaryInterface | {}> => {
  const createSalary: ISalaryInterface | {} = await SalaryModel.create([data], {
    session,
  });
  return createSalary;
};

// Find all DashboardSalary
export const findAllDashboardSalaryServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ISalaryInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: salarySearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findSalary: ISalaryInterface[] | [] = await SalaryModel.find(
    whereCondition
  )
    .populate([
      "salary_publisher_id",
      "salary_updated_by",
      "user_id",
      "commision_id",
    ])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findSalary;
};

// Find a user all Salary
export const findAUserAllSalaryServices = async (
  limit: number,
  skip: number,
  searchTerm: any,
  user_id: any
): Promise<ISalaryInterface[] | [] | any> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: salarySearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  andCondition.push({ user_id: user_id });
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findSalary: ISalaryInterface[] | [] = await SalaryModel.find(
    whereCondition
  )
    .populate(["salary_publisher_id", "salary_updated_by", "commision_id"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findSalary;
};

// Find a user a SalaryDetails
export const findAUserASalaryDetailsServices = async (
  salary_id: any
): Promise<ISalaryInterface[] | [] | any> => {
  const SalaryDetails: any = await SalaryModel.findOne({
    _id: salary_id,
  }).populate(["salary_publisher_id", "salary_updated_by", "commision_id", "user_id"]);
  return SalaryDetails;
};

// Update a Salary
export const updateSalaryServices = async (
  data: ISalaryInterface,
  _id: string
): Promise<ISalaryInterface | any> => {
  const updateSalaryInfo: ISalaryInterface | null = await SalaryModel.findOne({
    _id: _id,
  });
  if (!updateSalaryInfo) {
    throw new ApiError(400, "Sale Target Not Found !");
  }
  const Salary = await SalaryModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return Salary;
};
