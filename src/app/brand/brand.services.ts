import { brandSearchableField, IBrandInterface } from "./brand.interface";
import BrandModel from "./brand.model";

// Create A Brand
export const postBrandServices = async (
  data: IBrandInterface
): Promise<IBrandInterface | {}> => {
  const createBrand: IBrandInterface | {} = await BrandModel.create(data);
  return createBrand;
};

// Find Brand
export const findAllBrandServices = async (): Promise<
  IBrandInterface[] | []
> => {
  const findBrand: IBrandInterface[] | [] = await BrandModel.find({
    brand_status: "active",
  })
    .sort({ _id: -1 })
    .select("-__v");
  return findBrand;
};

// Find all dashboard Brand
export const findAllDashboardBrandServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<IBrandInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: brandSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findBrand: IBrandInterface[] | [] = await BrandModel.find(
    whereCondition
  )
    .populate(["brand_publisher_id", "brand_updated_by"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findBrand;
};

// Update a Brand
export const updateBrandServices = async (
  data: IBrandInterface,
  _id: string
): Promise<IBrandInterface | any> => {
  const updateBrandInfo: IBrandInterface | null = await BrandModel.findOne({
    _id: _id,
  });
  if (!updateBrandInfo) {
    return {};
  }
  const Brand = await BrandModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return Brand;
};
