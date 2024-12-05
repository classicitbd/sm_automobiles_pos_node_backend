import { checkSearchableField, ICheckInterface } from "./check.interface";
import CheckModel from "./check.model";

// Create A Check
export const postCheckServices = async (
  data: ICheckInterface
): Promise<ICheckInterface | {}> => {
  const createCheck: ICheckInterface | {} = await CheckModel.create(data);
  return createCheck;
};

// Find all dashboard Check
export const findAllDashboardCheckServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ICheckInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: checkSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findCheck: ICheckInterface[] | [] = await CheckModel.find(
    whereCondition
  )
    .populate([
      "order_id",
      "customer_id",
      "bank_id",
      "check_publisher_id",
      "check_approved_by",
      "check_updated_by",
    ])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findCheck;
};

// Find all Duedashboard Check
export const findAllDueDashboardCheckServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ICheckInterface[] | []> => {
  const today = new Date();
  const previousDay = new Date(today.setDate(today.getDate() - 1))
    .toISOString()
    .split("T")[0];

  const startOfPreviousDay = new Date();
  startOfPreviousDay.setDate(startOfPreviousDay.getDate() - 1);
  startOfPreviousDay.setHours(0, 0, 0, 0);

  const endOfPreviousDay = new Date();
  endOfPreviousDay.setDate(endOfPreviousDay.getDate() - 1);
  endOfPreviousDay.setHours(23, 59, 59, 999);

  const searchCondition = searchTerm
    ? {
        $or: checkSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      }
    : {};

  const findCheck: ICheckInterface[] | [] = await CheckModel.find({
    $and: [
      searchCondition,
      {
        $or: [
          // If `payment_method` is "check", filter by `check_withdraw_date`
          {
            $and: [
              { payment_method: "check" },
              { check_withdraw_date: previousDay },
            ],
          },
          // Otherwise, filter by `createdAt` within the previous day
          {
            $and: [
              { payment_method: { $ne: "check" } },
              {
                createdAt: {
                  $gte: startOfPreviousDay,
                  $lte: endOfPreviousDay,
                },
              },
            ],
          },
        ],
      },
    ],
  })
    .populate([
      "order_id",
      "customer_id",
      "bank_id",
      "check_publisher_id",
      "check_approved_by",
      "check_updated_by",
    ])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");

  return findCheck;
};

// export const findAllDueDashboardCheckServices = async (
//   limit: number,
//   skip: number,
//   searchTerm: any
// ): Promise<ICheckInterface[] | []> => {
//   const today = new Date();
//   const previousDay = new Date(today.setDate(today.getDate() - 1))
//     .toISOString()
//     .split("T")[0];

//   const andCondition: any = [{ check_withdraw_date: previousDay }];
//   if (searchTerm) {
//     andCondition.push({
//       $or: checkSearchableField.map((field) => ({
//         [field]: {
//           $regex: searchTerm,
//           $options: "i",
//         },
//       })),
//     });
//   }
//   const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
//   const findCheck: ICheckInterface[] | [] = await CheckModel.find(
//     whereCondition
//   )
//     .populate([
//       "order_id",
//       "customer_id",
//       "bank_id",
//       "check_publisher_id",
//       "check_approved_by",
//       "check_updated_by",
//     ])
//     .sort({ _id: -1 })
//     .skip(skip)
//     .limit(limit)
//     .select("-__v");
//   return findCheck;
// };

// Find all Todaydashboard Check
export const findAllTodayDashboardCheckServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ICheckInterface[] | []> => {
  const todayDate = new Date().toISOString().split("T")[0];

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Build search term condition
  const searchCondition = searchTerm
    ? {
        $or: checkSearchableField.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      }
    : {};

  // Query with conditional logic based on `payment_method`
  const findCheck: ICheckInterface[] | [] = await CheckModel.find({
    $and: [
      searchCondition,
      {
        $or: [
          // If `payment_method` is "check", filter by `check_withdraw_date`
          {
            $and: [
              { payment_method: "check" },
              { check_withdraw_date: todayDate },
            ],
          },
          // Otherwise, filter by `createdAt` within the current day
          {
            $and: [
              { payment_method: { $ne: "check" } },
              {
                createdAt: { $gte: startOfDay, $lte: endOfDay },
              },
            ],
          },
        ],
      },
    ],
  })
    .populate([
      "order_id",
      "customer_id",
      "bank_id",
      "check_publisher_id",
      "check_approved_by",
      "check_updated_by",
    ])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");

  return findCheck;
};

// export const findAllTodayDashboardCheckServices = async (
//   limit: number,
//   skip: number,
//   searchTerm: any
// ): Promise<ICheckInterface[] | []> => {
//   const todayDate = new Date().toISOString().split("T")[0];
//   const andCondition: any = [{ check_withdraw_date: todayDate }];
//   if (searchTerm) {
//     andCondition.push({
//       $or: checkSearchableField.map((field) => ({
//         [field]: {
//           $regex: searchTerm,
//           $options: "i",
//         },
//       })),
//     });
//   }
//   const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
//   const findCheck: ICheckInterface[] | [] = await CheckModel.find(
//     whereCondition
//   )
//     .populate([
//       "order_id",
//       "customer_id",
//       "bank_id",
//       "check_publisher_id",
//       "check_approved_by",
//       "check_updated_by",
//     ])
//     .sort({ _id: -1 })
//     .skip(skip)
//     .limit(limit)
//     .select("-__v");
//   return findCheck;
// };

// Update a Check
export const updateCheckServices = async (
  data: ICheckInterface,
  _id: string
): Promise<ICheckInterface | any> => {
  const updateCheckInfo: ICheckInterface | null = await CheckModel.findOne({
    _id: _id,
  });
  if (!updateCheckInfo) {
    return {};
  }
  const Check = await CheckModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return Check;
};
