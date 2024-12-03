import ApiError from "../../errors/ApiError";
import ProductUnitModel from "./unit.model";
import {
  IProductUnitInterface,
  productUnitSearchableField,
} from "./unit.interface";

// Create A ProductUnit
export const postProductUnitServices = async (
  data: IProductUnitInterface
): Promise<IProductUnitInterface | {}> => {
  const createProductUnit: IProductUnitInterface | {} =
    await ProductUnitModel.create(data);
  return createProductUnit;
};

// Find ProductUnit
export const findAllProductUnitServices = async (): Promise<
  IProductUnitInterface[] | []
> => {
  const findProductUnit: IProductUnitInterface[] | [] =
    await ProductUnitModel.find({
      product_unit_status: "active",
    })
      .sort({ _id: -1 })
      .select("-__v");
  return findProductUnit;
};

// Find all dashboard ProductUnit
export const findAllDashboardProductUnitServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<IProductUnitInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: productUnitSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findProductUnit: IProductUnitInterface[] | [] =
    await ProductUnitModel.find(whereCondition)
      .populate(["product_unit_publisher_id", "product_unit_updated_by"])
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");
  return findProductUnit;
};

// Update a ProductUnit
export const updateProductUnitServices = async (
  data: IProductUnitInterface,
  _id: string
): Promise<IProductUnitInterface | any> => {
  const updateProductUnitInfo: IProductUnitInterface | null =
    await ProductUnitModel.findOne({ _id: _id });
  if (!updateProductUnitInfo) {
    throw new ApiError(400, "Unit Not Found !");
  }
  const ProductUnit = await ProductUnitModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return ProductUnit;
};
