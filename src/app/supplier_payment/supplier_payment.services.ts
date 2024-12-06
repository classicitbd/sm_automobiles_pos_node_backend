import mongoose, { Types } from "mongoose";
import ApiError from "../../errors/ApiError";
import {
  ISupplierPaymentInterface,
  supplierPaymentSearchableField,
} from "./supplier_payment.interface";
import SupplierPaymentModel from "./supplier_payment.model";
import SupplierModel from "../supplier/supplier.model";

// Create A SupplierPayment
export const postSupplierPaymentServices = async (
  data: ISupplierPaymentInterface,
  session?: mongoose.ClientSession
): Promise<ISupplierPaymentInterface | {}> => {
  const createSupplierPayment: ISupplierPaymentInterface | {} =
    await SupplierPaymentModel.create([data], {
      session,
    });
  return createSupplierPayment;
};

// Find a SupplierPaymentHistory
export const findASupplierPaymentHistoryServices = async (
  limit: number,
  skip: number,
  searchTerm: any,
  supplier_id: any
): Promise<ISupplierPaymentInterface[] | []> => {
  const supplierObjectId = Types.ObjectId.isValid(supplier_id)
    ? { supplier_id: new Types.ObjectId(supplier_id) }
    : { supplier_id };

  const andCondition: any[] = [supplierObjectId];
  if (searchTerm) {
    andCondition.push({
      $or: supplierPaymentSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findSupplierPayment: ISupplierPaymentInterface[] | any =
    await SupplierPaymentModel.find(whereCondition)
      .populate([
        "supplier_payment_publisher_id",
        "supplier_payment_updated_by",
        "payment_bank_id",
      ])
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");

  const supplierDetails: any = await SupplierModel.findOne({
    _id: supplier_id,
  });
  const sendData: any = {
    paymentHistory: findSupplierPayment,
    supplierDetails: supplierDetails,
  };

  return sendData;
};

// Find all Paid SupplierPayment
export const findAllPaidSupplierPaymentServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ISupplierPaymentInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: supplierPaymentSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  andCondition.push({ supplier_payment_status: "paid" });
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findSupplierPayment: ISupplierPaymentInterface[] | [] =
    await SupplierPaymentModel.find(whereCondition)
      .populate([
        "supplier_id",
        "payment_bank_id",
        "supplier_payment_publisher_id",
        "supplier_payment_updated_by",
      ])
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");
  return findSupplierPayment;
};

// Find all UnPaid SupplierPayment
export const findAllUnPaidSupplierPaymentServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ISupplierPaymentInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: supplierPaymentSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  andCondition.push({ supplier_payment_status: "unpaid" });
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findSupplierPayment: ISupplierPaymentInterface[] | [] =
    await SupplierPaymentModel.find(whereCondition)
      .populate([
        "supplier_id",
        "payment_bank_id",
        "supplier_payment_publisher_id",
        "supplier_payment_updated_by",
      ])
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");
  return findSupplierPayment;
};

// Find all dashboard SupplierPayment
export const findAllDashboardSupplierPaymentServices = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<ISupplierPaymentInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: supplierPaymentSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const findSupplierPayment: ISupplierPaymentInterface[] | [] =
    await SupplierPaymentModel.find(whereCondition)
      .populate([
        "supplier_payment_publisher_id",
        "supplier_payment_updated_by",
      ])
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");
  return findSupplierPayment;
};

// update A SupplierPayment status
export const updateSupplierPaymentServices = async (
  data: ISupplierPaymentInterface,
  _id: string,
  session: mongoose.ClientSession
): Promise<ISupplierPaymentInterface | any> => {
  const updateCustomerPaymentInfo: ISupplierPaymentInterface | null =
    await SupplierPaymentModel.findOne({ _id: _id }).session(session);
  if (!updateCustomerPaymentInfo) {
    throw new ApiError(400, "Customer Not Found !");
  }
  const CustomerPayment = await SupplierPaymentModel.updateOne(
    { _id: _id },
    data,
    {
      session,
      runValidators: true,
    }
  );
  return CustomerPayment;
};
