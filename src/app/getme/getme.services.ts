import { IUserInterface } from "../user/user.interface";
import UserModel from "../user/user.model";

// Check a user is exists?
export const findUserInfoServices = async (
  login_credentials: string
): Promise<IUserInterface | null> => {
  const user = await UserModel.findOne({ login_credentials: login_credentials })
    .populate([
      "user_role_id",
      "user_publisher_id",
      "user_updated_by",
    ])
    .select("-user_password -user_otp");
  if (user) {
    return user;
  } else {
    return null;
  }
};
