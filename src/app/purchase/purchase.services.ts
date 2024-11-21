import ApiError from "../../errors/ApiError";
import { IPurchaseInterface, purchaseSearchableField } from "./purchase.interface";
import PurchaseModel from "./purchase.model";

// Create A Purchase
export const postPurchaseServices = async (
  data: IPurchaseInterface
): Promise<IPurchaseInterface | {}> => {
  const createPurchase: IPurchaseInterface | {} = await PurchaseModel.create(data);
  return createPurchase;
};

// Find all Dashboard Purchase
export const findAllDashboardPurchaseServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<IPurchaseInterface[] | []> => {
  const andCondition: any[] = [];
  if (searchTerm) {
    andCondition.push({
      $or: purchaseSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findPurchase: IPurchaseInterface[] | [] = await PurchaseModel.find(
    whereCondition
  )
    .populate(["purchase_publisher_id", "purchase_updated_by"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findPurchase;
};

// Update a Purchase
export const updatePurchaseServices = async (
  data: IPurchaseInterface,
  _id: string
): Promise<IPurchaseInterface | any> => {
  const updatePurchaseInfo: IPurchaseInterface | null =
    await PurchaseModel.findOne({
      _id: _id,
    });
  if (!updatePurchaseInfo) {
    throw new ApiError(400, "Purchase Not Found !");
  }
  const Purchase = await PurchaseModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return Purchase;
};
