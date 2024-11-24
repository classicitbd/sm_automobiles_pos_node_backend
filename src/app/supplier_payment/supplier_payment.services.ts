import ApiError from "../../errors/ApiError";
import { ISupplierPaymentInterface, supplierPaymentSearchableField } from "./supplier_payment.interface";
import SupplierPaymentModel from "./supplier_payment.model";

// Create A SupplierPayment
export const postSupplierPaymentServices = async (
  data: ISupplierPaymentInterface
): Promise<ISupplierPaymentInterface | {}> => {
  const createSupplierPayment: ISupplierPaymentInterface | {} = await SupplierPaymentModel.create(
    data
  );
  return createSupplierPayment;
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
  const findSupplierPayment: ISupplierPaymentInterface[] | [] = await SupplierPaymentModel.find(
    whereCondition
  )
  .populate(["supplier_payment_publisher_id", "supplier_payment_updated_by"])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findSupplierPayment;
};

// Update a SupplierPayment
export const updateSupplierPaymentServices = async (
  data: ISupplierPaymentInterface,
  _id: string
): Promise<ISupplierPaymentInterface | any> => {
  const updateSupplierPaymentInfo: ISupplierPaymentInterface | null =
    await SupplierPaymentModel.findOne({ _id: _id });
  if (!updateSupplierPaymentInfo) {
    throw new ApiError(400, "SupplierPayment Not Found !");
  }
  const SupplierPayment = await SupplierPaymentModel.updateOne({ _id: _id }, data, {
    runValidators: true,
  });
  return SupplierPayment;
};
