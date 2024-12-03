import { Types } from "mongoose";
import ApiError from "../../errors/ApiError";
import {
  ISupplierDueInterface,
  supplierDueSearchableField,
} from "./supplier_due.interface";
import SupplierDueModel from "./supplier_due.model";
import SupplierModel from "../supplier/supplier.model";

// Create A SupplierDue
export const postSupplierDueServices = async (
  data: ISupplierDueInterface
): Promise<ISupplierDueInterface | {}> => {
  const createSupplierDue: ISupplierDueInterface | {} =
    await SupplierDueModel.create(data);
  return createSupplierDue;
};

// Find a SupplierDueHistory
export const findASupplierDueHistoryServices = async (
  limit: number,
  skip: number,
  searchTerm: any,
  supplier_id: any
): Promise<ISupplierDueInterface[] | []> => {
  const supplierObjectId = Types.ObjectId.isValid(supplier_id)
    ? { supplier_id: new Types.ObjectId(supplier_id) }
    : { supplier_id };

  const andCondition: any[] = [supplierObjectId];
  if (searchTerm) {
    andCondition.push({
      $or: supplierDueSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findSupplierDue: ISupplierDueInterface[] | any =
    await SupplierDueModel.find(whereCondition)
      .populate(["supplier_due_publisher_id", "supplier_due_updated_by"])
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");

  const supplierDetails: any = await SupplierModel.findOne({
    _id: supplier_id,
  });
  const sendData: any = {
    dueHistory: findSupplierDue,
    supplierDetails: supplierDetails,
  };

  return sendData;
};

// Find all dashboard SupplierDue
export const findAllDashboardSupplierDueServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ISupplierDueInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: supplierDueSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findSupplierDue: ISupplierDueInterface[] | [] =
    await SupplierDueModel.find(whereCondition)
      .populate(["supplier_due_publisher_id", "supplier_due_updated_by"])
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");
  return findSupplierDue;
};

// Update a SupplierDue
export const updateSupplierDueServices = async (
  data: ISupplierDueInterface,
  _id: string
): Promise<ISupplierDueInterface | any> => {
  const updateSupplierDueInfo: ISupplierDueInterface | null =
    await SupplierDueModel.findOne({ _id: _id });
  if (!updateSupplierDueInfo) {
    throw new ApiError(400, "Supplier Due Not Found !");
  }
  const SupplierDue = await SupplierDueModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return SupplierDue;
};
