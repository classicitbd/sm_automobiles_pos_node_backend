import mongoose from "mongoose";
import OrderModel from "./order.model";
import CustomerModel from "../customer/customer.model";
import { postCustomerDueWhenOrderServices } from "../customer_due/customer_due.services";
import { postCustomerPaymentWhenOrderServices } from "../customer_payment/customer_payment.services";
import ProductModel from "../product/product.model";

// Generate a unique Order ID
export const generateOrderId = async () => {
  let isUnique = false;
  let uniqueOrderId;

  while (!isUnique) {
    // Generate a random alphanumeric string of length 8
    uniqueOrderId = Array.from({ length: 8 }, () =>
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
        Math.floor(Math.random() * 62)
      )
    ).join("");

    // Check if the generated order_id is unique in the database
    const existingOrder = await OrderModel.findOne({
      order_id: uniqueOrderId,
    });

    // If no existing order found, mark the order_id as unique
    if (!existingOrder) {
      isUnique = true;
    }
  }

  return uniqueOrderId;
};

// Helper functions

export const handleProductQuantity = async (
  order_products: any,
  session: mongoose.ClientSession
) => {
  await Promise.all(
    order_products?.map((product: any) =>
      ProductModel.updateOne(
        { _id: product?.product_id },
        { $inc: { product_quantity: -product?.product_quantity } },
        { session }
      )
    )
  );
};

export const handleDuePayment = async (
  customer_id: string,
  grand_total_amount: number,
  findCustomer: any,
  session: mongoose.ClientSession
) => {
  if (findCustomer?.previous_due && !findCustomer?.previous_advance) {
    const data = {
      previous_due: findCustomer?.previous_due + grand_total_amount,
    };
    await CustomerModel.updateOne({ _id: customer_id }, data, {
      session,
      runValidators: true,
    });
  } else if (!findCustomer?.previous_due && findCustomer?.previous_advance) {
    if (findCustomer?.previous_advance > grand_total_amount) {
      const data = {
        previous_advance: findCustomer?.previous_advance - grand_total_amount,
      };
      await CustomerModel.updateOne({ _id: customer_id }, data, {
        session,
        runValidators: true,
      });
    } else {
      const due = grand_total_amount - findCustomer?.previous_advance;
      const data = {
        previous_due: findCustomer?.previous_due
          ? findCustomer?.previous_due + due
          : due,
        previous_advance: 0,
      };
      await CustomerModel.updateOne({ _id: customer_id }, data, {
        session,
        runValidators: true,
      });
    }
  }
  const sendData = {
    customer_due_publisher_id: customer_id,
    customer_due_updated_by: customer_id,
    due_note: "From POS Selling Due Payment",
    due_amount: grand_total_amount,
    customer_id,
    previous_due: findCustomer.previous_due,
    previous_advance: findCustomer.previous_advance,
  };
  await postCustomerDueWhenOrderServices(sendData, session);
};

export const handleFullPayment = async (
  customer_id: string,
  payment_transaction_id: string,
  payment_bank_id: string,
  payment_amount: number,
  findCustomer: any,
  session: mongoose.ClientSession
) => {
  const sendData = {
    customer_payment_publisher_id: customer_id,
    customer_payment_updated_by: customer_id,
    transaction_id: payment_transaction_id,
    payment_note: "From POS Selling Full Payment",
    payment_amount,
    customer_id,
    payment_bank_id,
    previous_due: findCustomer.previous_due,
    previous_advance: findCustomer.previous_advance,
  };

  await postCustomerPaymentWhenOrderServices(sendData, session);
};

export const handlePartialPayment = async (
    customer_id: string,
    payment_transaction_id: string,
    payment_bank_id: string,
    received_amount: number,
    due_amount: number,
    findCustomer: any,
    session: mongoose.ClientSession
  ) => {
    if (received_amount) {
      const sendData = {
        customer_payment_publisher_id: customer_id,
        customer_payment_updated_by: customer_id,
        transaction_id: payment_transaction_id,
        payment_note: "From POS Selling Partial Payment",
        payment_amount: received_amount,
        customer_id,
        payment_bank_id: payment_bank_id,
        previous_due: findCustomer?.previous_due,
        previous_advance: findCustomer?.previous_advance,
      };
      await postCustomerPaymentWhenOrderServices(sendData, session);
    }
    if (due_amount) {
      const findCustomerData: any = await CustomerModel.findById(customer_id).session(
          session
        );
  
      if (findCustomerData?.previous_due && (!findCustomerData?.previous_advance || findCustomerData?.previous_advance == 0)) {
        const data = {
          previous_due: findCustomerData?.previous_due + due_amount,
        };
        await CustomerModel.updateOne({ _id: customer_id }, data, {
          session,
          runValidators: true,
        });
      } else if ((!findCustomerData?.previous_due || findCustomerData?.previous_due == 0) && findCustomerData?.previous_advance) {
        if (findCustomerData?.previous_advance > due_amount) {
          const data = {
            previous_advance: findCustomerData?.previous_advance - due_amount,
          };
          await CustomerModel.updateOne({ _id: customer_id }, data, {
            session,
            runValidators: true,
          });
        } else {
          const due = due_amount - findCustomerData?.previous_advance;
          const data = {
            previous_due: due,
            previous_advance: 0,
          };
          await CustomerModel.updateOne({ _id: customer_id }, data, {
            session,
            runValidators: true,
          });
        }
      }

      const sendData = {
        customer_due_publisher_id: customer_id,
        customer_due_updated_by: customer_id,
        due_note: "From POS Selling Partial Due",
        due_amount: due_amount,
        customer_id,
        previous_due: findCustomer?.previous_due,
        previous_advance: findCustomer?.previous_advance,
      };
      await postCustomerDueWhenOrderServices(sendData, session);
    }
  };

// export const handlePartialPayment = async (
//   customer_id: string,
//   payment_transaction_id: string,
//   payment_bank_id: string,
//   received_amount: number,
//   due_amount: number,
//   findCustomer: any,
//   session: mongoose.ClientSession
// ) => {
//   if (received_amount) {
//     if (findCustomer?.previous_due && findCustomer?.previous_due > 0) {
//       if (findCustomer?.previous_due > received_amount) {
//         const data = {
//           previous_due: findCustomer?.previous_due - received_amount,
//         };
//         await CustomerModel.updateOne({ _id: customer_id }, data, {
//           session,
//           runValidators: true,
//         });
//       } else {
//         const advance = received_amount - findCustomer?.previous_due;
//         const data = {
//           previous_due: 0,
//           previous_advance: advance,
//         };
//         await CustomerModel.updateOne({ _id: customer_id }, data, {
//           session,
//           runValidators: true,
//         });
//       }
//     } else {
//       const data = {
//         previous_due: 0,
//         previous_advance: findCustomer?.previous_advance
//           ? findCustomer?.previous_advance + received_amount
//           : received_amount,
//       };
//       await CustomerModel.updateOne({ _id: customer_id }, data, {
//         session,
//         runValidators: true,
//       });
//     }
//     const sendData = {
//       customer_payment_publisher_id: customer_id,
//       customer_payment_updated_by: customer_id,
//       transaction_id: payment_transaction_id,
//       payment_note: "From POS Selling Partial Payment",
//       payment_amount: received_amount,
//       customer_id,
//       payment_bank_id: payment_bank_id,
//       previous_due: findCustomer?.previous_due,
//       previous_advance: findCustomer?.previous_advance,
//     };
//     await postCustomerPaymentWhenOrderServices(sendData, session);
//   }
//   if (due_amount) {
//     const findCustomerData: any = await CustomerModel.findById(customer_id).session(
//         session
//       );

//     if (findCustomerData?.previous_due && (!findCustomerData?.previous_advance || findCustomerData?.previous_advance == 0)) {
//       const data = {
//         previous_due: findCustomerData?.previous_due + due_amount,
//       };
//       await CustomerModel.updateOne({ _id: customer_id }, data, {
//         session,
//         runValidators: true,
//       });
//     } else if ((!findCustomerData?.previous_due || findCustomerData?.previous_due == 0) && findCustomerData?.previous_advance) {
//       if (findCustomerData?.previous_advance > due_amount) {
//         const data = {
//           previous_advance: findCustomerData?.previous_advance - due_amount,
//         };
//         await CustomerModel.updateOne({ _id: customer_id }, data, {
//           session,
//           runValidators: true,
//         });
//       } else {
//         const due = due_amount - findCustomerData?.previous_advance;
//         const data = {
//           previous_due: due,
//           previous_advance: 0,
//         };
//         await CustomerModel.updateOne({ _id: customer_id }, data, {
//           session,
//           runValidators: true,
//         });
//       }
//     }
//     const sendData = {
//       customer_due_publisher_id: customer_id,
//       customer_due_updated_by: customer_id,
//       due_note: "From POS Selling Partial Due",
//       due_amount: due_amount,
//       customer_id,
//       previous_due: findCustomer?.previous_due,
//       previous_advance: findCustomer?.previous_advance,
//     };
//     await postCustomerDueWhenOrderServices(sendData, session);
//   }
// };
