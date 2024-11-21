import ApiError from "../../errors/ApiError";
import { IShowroomInterface, showroomSearchableField } from "./showroom.interface";
import ShowroomModel from "./showroom.model";

// Create A Showroom
export const postShowroomServices = async (
  data: IShowroomInterface
): Promise<IShowroomInterface | {}> => {
  const createShowroom: IShowroomInterface | {} = await ShowroomModel.create(
    data
  );
  return createShowroom;
};

// Find Showroom
export const findAllShowroomServices = async (): Promise<
  IShowroomInterface[] | []
> => {
  const findShowroom: IShowroomInterface[] | [] = await ShowroomModel.find({
    showroom_status: "active",
  })
    .sort({ _id: -1 })
    .select("-__v");
  return findShowroom;
};

// Find all dashboard Showroom
export const findAllDashboardShowroomServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<IShowroomInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: showroomSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findShowroom: IShowroomInterface[] | [] = await ShowroomModel.find(
    whereCondition
  )
  .populate(["showroom_publisher_id", "showroom_updated_by"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findShowroom;
};

// Update a Showroom
export const updateShowroomServices = async (
  data: IShowroomInterface,
  _id: string
): Promise<IShowroomInterface | any> => {
  const updateShowroomInfo: IShowroomInterface | null =
    await ShowroomModel.findOne({ _id: _id });
  if (!updateShowroomInfo) {
    throw new ApiError(400, "Showroom Not Found !");
  }
  const Showroom = await ShowroomModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return Showroom;
};
