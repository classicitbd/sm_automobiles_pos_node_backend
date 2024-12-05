import mongoose, { Types } from "mongoose";
import { ISupplierMoneyAddInterface } from "./supplier_money_add.interface";
import SupplierMoneyAddModel from "./supplier_money_add.model";

// Create A SupplierMoneyAdd
export const postSupplierMoneyAddServices = async (
  data: ISupplierMoneyAddInterface,
  session?: mongoose.ClientSession
): Promise<ISupplierMoneyAddInterface | {}> => {
  const createSupplierMoneyAdd: ISupplierMoneyAddInterface | {} =
    await SupplierMoneyAddModel.create([data], {
      session,
    });
  return createSupplierMoneyAdd;
};
