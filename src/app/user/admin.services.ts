import { IUserInterface, userSearchableField } from "./user.interface";
import UserModel from "./user.model";

// Create A User
export const postUserServices = async (
  data: IUserInterface
): Promise<IUserInterface | {}> => {
  const createUser: IUserInterface | {} = await UserModel.create(data);
  return createUser;
};

// Find a User for verify token
export const checkAUserExitsForVerify = async (
  user_phone: any
): Promise<IUserInterface | any> => {
  const findUser: IUserInterface | any = await UserModel.findOne({
    user_phone: user_phone,
  })
    .populate("user_role_id")
    .select("-__v");
  return findUser;
};

// Find a User User
export const findAUserServices = async (
  _id: any
): Promise<IUserInterface | any> => {
  const findUser: IUserInterface | any = await UserModel.findOne({
    _id: _id,
  }).select("-__v");
  return findUser;
};

// Find all  User Role User
export const findAllUserServices = async (): Promise<IUserInterface[] | []> => {
  const findUser: IUserInterface[] | [] = await UserModel.find({
    user_status: "active",
  })
    .sort({ _id: 1 })
    .select("-__v");
  return findUser;
};

// Find all dashboard User Role User
export const findAllDashboardUserServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<IUserInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: userSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findUser: IUserInterface[] | [] = await UserModel.find(whereCondition)
    .populate(["user_role_id", "user_publisher_id", "user_updated_by"])
    .sort({ _id: 1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findUser;
};

// Update a User
export const updateUserServices = async (
  data: IUserInterface,
  _id: string
): Promise<IUserInterface | any> => {
  const updateUserInfo: IUserInterface | null = await UserModel.findOne({
    _id: _id,
  });
  if (!updateUserInfo) {
    return {};
  }
  const User = await UserModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return User;
};
