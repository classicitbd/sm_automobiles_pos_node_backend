import mongoose, { mongo } from "mongoose";
import ApiError from "../../errors/ApiError";
import { IProductInterface, productSearchableField } from "./product.interface";
import ProductModel from "./product.model";

// Create A Product
export const postProductServices = async (
  data: IProductInterface
): Promise<IProductInterface | {}> => {
  const createProduct: IProductInterface | {} = await ProductModel.create(data);
  return createProduct;
};

// Find a Product by id
export const findAProductDetailsServices = async (
  _id: string
): Promise<IProductInterface | {}> => {
  const findProduct: IProductInterface | {} | null = await ProductModel.findOne(
    {
      _id: _id,
    }
  ).select("-__v");
  if (!findProduct) {
    throw new ApiError(400, "Product Not Found !");
  }
  return findProduct;
};

// Find all  Product
export const findAllProductServices = async (
  category_id: any,
  brand_id: any,
  product_barcode: any,
  limit: number,
  skip: number,
  searchTerm: any
): Promise<IProductInterface[] | []> => {
  if (product_barcode) {
    const findProduct:
      | IProductInterface[]
      | any
      | null
      | IProductInterface
      | {}
      | [] = await ProductModel.find({
      product_barcode: product_barcode,
      product_status: "active",
    }).select("-__v");
    if (!findProduct) throw new ApiError(400, "Product Not Found !");
    return findProduct;
  }

  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: productSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  if (
    category_id !== null &&
    category_id !== undefined &&
    category_id !== "" &&
    category_id !== "null" &&
    category_id !== "undefined"
  ) {
    andCondition.push({
      category_id: category_id,
    });
  }
  if (
    brand_id !== null &&
    brand_id !== undefined &&
    brand_id !== "" &&
    brand_id !== "null" &&
    brand_id !== "undefined"
  ) {
    andCondition.push({
      brand_id: brand_id,
    });
  }
  andCondition.push({ product_status: "active" });
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findProduct: IProductInterface[] | [] = await ProductModel.find(
    whereCondition
  )
    .populate(["category_id", "brand_id"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");

  return findProduct;
};

// Find all dashboard Product
export const findAllDashboardProductServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<IProductInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: productSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findProduct: IProductInterface[] | [] = await ProductModel.find(
    whereCondition
  )
    .populate([
      "product_publisher_id",
      "product_updated_by",
      "category_id",
      "brand_id",
    ])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findProduct;
};

// Update a Product
export const updateProductServices = async (
  data: IProductInterface,
  _id: string
): Promise<IProductInterface | any> => {
  const updateProductInfo: IProductInterface | null =
    await ProductModel.findOne({
      _id: _id,
    });
  if (!updateProductInfo) {
    throw new ApiError(400, "Product Not Found !");
  }
  // আপডেট করার ডেটা তৈরি করা হচ্ছে
  const updateData: any = { ...data };

  // যদি `brand_id` পাঠানো না হয়, তাহলে সেটি ডিলিট করা হবে
  const unsetData: any = {};
  if (!data.hasOwnProperty("brand_id")) {
    unsetData.brand_id = "";
  }
  const Product = await ProductModel.updateOne(
    { _id: _id },
    {
      $set: updateData, // পাঠানো ফিল্ড আপডেট করা
      $unset: unsetData, // পাঠানো না হলে ফিল্ডগুলো মুছে ফেলা
    },
    {
      runValidators: true,
    }
  );
  return Product;
};

// Update a ProductPrice
export const updateProductPriceServices = async (
  data: any,
  _id: string,
  session: mongoose.ClientSession
): Promise<IProductInterface | any> => {
  const updateProductInfo: IProductInterface | null =
    await ProductModel.findOne({
      _id: _id,
    }).session(session);
  if (!updateProductInfo) {
    throw new ApiError(400, "Product Not Found !");
  }
  const Product = await ProductModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return Product;
};
