import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { FileUploadHelper } from "../../helpers/image.upload";
import ApiError from "../../errors/ApiError";
import { IProductInterface, productSearchableField } from "./product.interface";
import {
  findAllDashboardProductServices,
  findAllProductServices,
  findAProductDetailsServices,
  postProductServices,
  updateProductServices,
} from "./product.services";
import ProductModel from "./product.model";
import QRCode from "qrcode";
import * as fs from "fs";

// Generate bar code image
const generateBarcodeImage = async (product_id: any) => {
  try {
    const product_barcode_image = await QRCode.toDataURL(product_id);

    // Use the barcode image URL wherever needed
    return product_barcode_image;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};

// Generate a unique product ID
const generateProductId = async () => {
  let isUnique = false;
  let uniqueProductId;

  while (!isUnique) {
    // Generate a random alphanumeric string of length 8
    uniqueProductId = Array.from({ length: 8 }, () =>
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
        Math.floor(Math.random() * 62)
      )
    ).join("");

    // Check if the generated barcode is unique in the database
    const existingOrder = await ProductModel.findOne({
      barcode: uniqueProductId,
    });

    // If no existing order found, mark the barcode as unique
    if (!existingOrder) {
      isUnique = true;
    }
  }

  return uniqueProductId;
};

// Add A Product
export const postProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IProductInterface | any> => {
  try {
    if (req.files && "product_image" in req.files && req.body) {
      const requestData = req.body;
      let product_barcode: any;
      let product_barcode_image: any;
      let product_id: any;

      if (requestData?.product_id) {
        const productIdCheck = await ProductModel.findOne({
          product_id: requestData?.product_id,
        });
        if (productIdCheck) {
          fs.unlinkSync(req.files.product_image[0].path);
          throw new ApiError(400, "Product ID already exist !");
        } else {
          product_id = requestData?.product_id;
          product_barcode = requestData?.product_id;
          product_barcode_image = await generateBarcodeImage(
            requestData?.product_id
          );
        }
      } else {
        product_id = await generateProductId();
        product_barcode = product_id;
        product_barcode_image = await generateBarcodeImage(product_id);
      }

      // get the Product image and upload
      let product_image;
      let product_image_key;
      if (req.files && "product_image" in req.files) {
        const ProductImage = req.files["product_image"][0];
        const product_image_upload = await FileUploadHelper.uploadToSpaces(
          ProductImage
        );
        product_image = product_image_upload?.Location;
        product_image_key = product_image_upload?.Key;
      }
      const data = {
        ...requestData,
        product_image,
        product_image_key,
        product_id,
        product_barcode,
        product_barcode_image,
      };
      const result: IProductInterface | {} = await postProductServices(data);
      if (result) {
        return sendResponse<IProductInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Product Added Successfully !",
        });
      } else {
        throw new ApiError(400, "Product Added Failed !");
      }
    } else {
      throw new ApiError(400, "Image upload failed !");
    }
  } catch (error: any) {
    next(error);
  }
};

// Find A Product by id
export const findAProductDetails: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IProductInterface | any> => {
  try {
    const _id = req.params.id;
    const result: IProductInterface[] | any = await findAProductDetailsServices(
      _id
    );
    return sendResponse<IProductInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product Found Successfully !",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All Product
export const findAllProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IProductInterface | any> => {
  try {
    const {
      category_id,
      brand_id,
      product_barcode,
      searchTerm,
      page,
      limit,
    }: any = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IProductInterface[] | any = await findAllProductServices(
      category_id,
      brand_id,
      product_barcode,
      limit,
      skip,
      searchTerm
    );
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
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await ProductModel.countDocuments(whereCondition);
    return sendResponse<IProductInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Find All Dashboard Product
export const findAllDashboardProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IProductInterface | any> => {
  try {
    const { page, limit, searchTerm } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const result: IProductInterface[] | any =
      await findAllDashboardProductServices(limitNumber, skip, searchTerm);

    const andCondition: any[] = [];
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
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const total = await ProductModel.countDocuments(whereCondition);
    return sendResponse<IProductInterface>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product Found Successfully !",
      data: result,
      totalData: total,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update A Product
export const updateProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<IProductInterface | any> => {
  try {
    if (req.files && "product_image" in req.files && req.body) {
      const requestData = req.body;
      // get the Product image and upload
      let product_image;
      let product_image_key;
      if (req.files && "product_image" in req.files) {
        const ProductImage = req.files["product_image"][0];
        const product_image_upload = await FileUploadHelper.uploadToSpaces(
          ProductImage
        );
        product_image = product_image_upload?.Location;
        product_image_key = product_image_upload?.Key;
      }
      const data = { ...requestData, product_image, product_image_key };
      const result: IProductInterface | any = await updateProductServices(
        data,
        requestData?._id
      );
      if (result?.modifiedCount > 0) {
        if (requestData?.product_image_key) {
          await FileUploadHelper.deleteFromSpaces(
            requestData?.product_image_key
          );
        }
        return sendResponse<IProductInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Product Update Successfully !",
        });
      } else {
        throw new ApiError(400, "Product Update Failed !");
      }
    } else {
      const requestData = req.body;
      const result: IProductInterface | any = await updateProductServices(
        requestData,
        requestData?._id
      );
      if (result?.modifiedCount > 0) {
        return sendResponse<IProductInterface>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Product Update Successfully !",
        });
      } else {
        throw new ApiError(400, "Product Update Failed !");
      }
    }
  } catch (error: any) {
    next(error);
  }
};
