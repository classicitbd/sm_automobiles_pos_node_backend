import ApiError from "../../errors/ApiError";
import {
  ICategoryInterface,
  categorySearchableField,
} from "./category.interface";
import CategoryModel from "./category.model";

// Create A Category
export const postCategoryServices = async (
  data: ICategoryInterface
): Promise<ICategoryInterface | {}> => {
  const createCategory: ICategoryInterface | {} = await CategoryModel.create(
    data
  );
  return createCategory;
};

// Find all Category
export const findAllCategoryServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ICategoryInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: categorySearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findCategory: ICategoryInterface[] | [] = await CategoryModel.find(
    whereCondition
  )
  .populate(["category_publisher_id", "category_updated_by"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findCategory;
};

// Update a Category
export const updateCategoryServices = async (
  data: ICategoryInterface,
  _id: string
): Promise<ICategoryInterface | any> => {
  const updateCategoryInfo: ICategoryInterface | null =
    await CategoryModel.findOne({ _id: _id });
  if (!updateCategoryInfo) {
    throw new ApiError(400, "Category Not Found !");
  }
  const Category = await CategoryModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return Category;
};
