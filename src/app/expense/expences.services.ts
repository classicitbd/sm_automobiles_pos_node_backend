import { Types } from "mongoose";
import { expenceSearchableField, IExpenceInterface } from "./expences.interface";
import ExpenceModel from "./expences.model";

// Create A Expence
export const postExpenceServices = async (
  data: IExpenceInterface
): Promise<IExpenceInterface | {}> => {
  const createExpence: IExpenceInterface | {} = await ExpenceModel.create(data);
  return createExpence;
};

// Find all Self Expence
export const findAllSelfExpenceServices = async (
  limit: number,
  skip: number,
  searchTerm: any,
  panel_owner_id: any
): Promise<IExpenceInterface[] | []> => {
  const panelOwnerIdCondition = Types.ObjectId.isValid(panel_owner_id)
  ? { panel_owner_id: new Types.ObjectId(panel_owner_id) }
  : { panel_owner_id };

const andCondition: any[] = [
  panelOwnerIdCondition
];
  if (searchTerm) {
    andCondition.push({
      $or: expenceSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findExpence: IExpenceInterface[] | [] = await ExpenceModel.find(
    whereCondition
  )
    .populate(["expence_publisher_id", "panel_owner_id"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findExpence;
};

// Update a Expence
export const updateExpenceServices = async (
  data: IExpenceInterface,
  _id: string
): Promise<IExpenceInterface | any> => {
  const updateExpenceInfo: IExpenceInterface | null = await ExpenceModel.findOne({
    _id: _id,
  });
  if (!updateExpenceInfo) {
    return {};
  }
  const Expence = await ExpenceModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return Expence;
};

// Delete a Expence
export const deleteExpenceServices = async (
  _id: string
): Promise<IExpenceInterface | any> => {
  const updateExpenceInfo: IExpenceInterface | null = await ExpenceModel.findOne({
    _id: _id,
  });
  if (!updateExpenceInfo) {
    return {};
  }
  const Expence = await ExpenceModel.deleteOne(
    { _id: _id },
    {
      runValidators: true,
    }
  );
  return Expence;
};
