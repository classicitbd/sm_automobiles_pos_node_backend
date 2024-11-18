import { Types } from "mongoose";
import {
  ISupplierInterface,
  supplierSearchableField,
} from "./supplier.interface";
import SupplierModel from "./supplier.model";

// Create A Supplier
export const postSupplierServices = async (
  data: ISupplierInterface
): Promise<ISupplierInterface | {}> => {
  const createSupplier: ISupplierInterface | {} = await SupplierModel.create(
    data
  );
  return createSupplier;
};

// Find all dashboard Supplier
export const findAllDashboardSupplierServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ISupplierInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: supplierSearchableField.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  const whereCondition: any =
    andCondition.length > 0 ? { $and: andCondition } : {};

  // Start building the query
  const findSupplier = SupplierModel.find(whereCondition)
    .populate([
      "supplier_publisher_id",
      "supplier_updated_by",
      "panel_owner_id",
    ])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");

  return findSupplier;
};

// Find all self dashboard Supplier
export const findAllSelfDashboardSupplierServices = async (
  limit: number,
  skip: number,
  searchTerm: any,
  panel_owner_id: any
): Promise<ISupplierInterface[] | []> => {
  const panelOwnerIdCondition = Types.ObjectId.isValid(panel_owner_id)
    ? { panel_owner_id: new Types.ObjectId(panel_owner_id) }
    : { panel_owner_id };

  const andCondition: any[] = [panelOwnerIdCondition];
  if (searchTerm) {
    andCondition.push({
      $or: supplierSearchableField.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  const whereCondition: any =
    andCondition.length > 0 ? { $and: andCondition } : {};

  // Start building the query
  const findSupplier = SupplierModel.find(whereCondition)
    .populate([
      "supplier_publisher_id",
      "supplier_updated_by",
      "panel_owner_id",
    ])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");

  return findSupplier;
};

// Find all  Supplier
export const findAllSupplierServices = async (
  panel_owner_id: any
): Promise<ISupplierInterface[] | []> => {
  // Start building the query
  const findSupplier = SupplierModel.find({
    panel_owner_id: panel_owner_id,
    supplier_status: "active",
  })
    .sort({ _id: -1 })
    .select("-__v");

  return findSupplier;
};

// Update a Supplier
export const updateSupplierServices = async (
  data: ISupplierInterface,
  _id: string
): Promise<ISupplierInterface | any> => {
  const updateSupplierInfo: ISupplierInterface | null =
    await SupplierModel.findOne({
      _id: _id,
    });
  if (!updateSupplierInfo) {
    return {};
  }
  const Supplier = await SupplierModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return Supplier;
};

// Delete a Supplier
export const deleteSupplierServices = async (
  _id: string
): Promise<ISupplierInterface | any> => {
  const Supplier = await SupplierModel.deleteOne(
    { _id: _id },
    {
      runValidators: true,
    }
  );
  return Supplier;
};
