import { brandSearchableField, IBrandInterface } from "./brand.interface";
import BrandModel from "./brand.model";

// Create A Brand
export const postBrandServices = async (
  data: IBrandInterface
): Promise<IBrandInterface | {}> => {
  const createBrand: IBrandInterface | {} = await BrandModel.create(data);
  return createBrand;
};

// Find all  Brand
export const findAllBrandServices = async (
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
