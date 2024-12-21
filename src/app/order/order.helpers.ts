import mongoose from "mongoose";
import OrderModel from "./order.model";
import CustomerModel from "../customer/customer.model";
// import { postCustomerDueWhenOrderServices } from "../customer_due/customer_due.services";
// import { postCustomerPaymentWhenOrderServices } from "../customer_payment/customer_payment.services";
import ProductModel from "../product/product.model";
import ApiError from "../../errors/ApiError";
import QRCode from "qrcode";
import ProductPerformanceModel from "../productPerformanceHistory/productSaleHistory.model";

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

// Generate bar code image
export const generateBarcodeImage = async (order_id: any) => {
  try {
    const order_barcode_image = await QRCode.toDataURL(order_id);

    // Use the barcode image URL wherever needed
    return order_barcode_image;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};

// Helper functions
export const handleProductQuantity = async (
  order_products: any,
  session: mongoose.ClientSession,
  requestData: any,
  user_id: string
) => {
  await Promise.all(
    order_products?.map((product: any) =>
      ProductModel.updateOne(
        { _id: product?.product_id },
        {
          $inc: {
            product_quantity: -product?.product_quantity,
            total_sale: +product?.total_measurement,
          },
        },
        { session }
      )
    )
  );
  // save product sale in performance hostory
  await Promise.all(
    order_products?.map((product: any) => {
      const performanceData = {
        product_id: product?.product_id,
        order_id: requestData?._id,
        product_sale_history_publisher_id: user_id,
      };
      ProductPerformanceModel.create([performanceData], { session });
    })
  );
};

// handle cancel or returned order then increase product quantity
export const handleReturnOrCancelOrderIncrementProductQuantity = async (
  order_products: any,
  customer_id: string,
  grand_total_amount: number,
  session: mongoose.ClientSession
) => {
  await Promise.all(
    order_products?.map((product: any) =>
      ProductModel.updateOne(
        { _id: product?.product_id },
        { $inc: { product_quantity: +product?.product_quantity } },
        { session }
      )
    )
  );

  const findCustomer = await CustomerModel.findOne({
    _id: customer_id,
  }).session(session);
  if (!findCustomer) {
    throw new ApiError(400, "Customer Not Found !");
  }

  // if (findCustomer?.previous_due) {
  //   if (findCustomer?.previous_due > grand_total_amount) {
  //     const data = {
  //       previous_due: findCustomer?.previous_due - grand_total_amount,
  //     };
  //     await CustomerModel.updateOne({ _id: customer_id }, data, {
  //       runValidators: true,
  //       session
  //     });
  //   } else {
  //     const advance = grand_total_amount - findCustomer?.previous_due;
  //     const data = {
  //       previous_due: 0,
  //       previous_advance: findCustomer?.previous_advance
  //         ? findCustomer?.previous_advance + advance
  //         : advance,
  //     };
  //     await CustomerModel.updateOne({ _id: customer_id }, data, {
  //       runValidators: true,
  //       session
  //     });
  //   }
  // } else {
  //   const data = {
  //     previous_due: 0,
  //     previous_advance: findCustomer?.previous_advance
  //       ? findCustomer?.previous_advance + grand_total_amount
  //       : grand_total_amount,
  //   };
  //   await CustomerModel.updateOne({ _id: customer_id }, data, {
  //     runValidators: true,
  //     session
  //   });
  // }
};

export const handleDuePayment = async (
  customer_id: string,
  grand_total_amount: number,
  findCustomer: any,
  session: mongoose.ClientSession,
  order_publisher_id: any
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
    customer_due_publisher_id: order_publisher_id,
    customer_due_updated_by: order_publisher_id,
    due_note: "From POS Selling Due Payment",
    due_amount: grand_total_amount,
    customer_id,
    previous_due: findCustomer.previous_due,
    previous_advance: findCustomer.previous_advance,
  };
  // await postCustomerDueWhenOrderServices(sendData, session);
};

// export const handleFullPayment = async (
//   customer_id: string,
//   payment_transaction_id: string,
//   payment_bank_id: string,
//   payment_amount: number,
//   findCustomer: any,
//   session: mongoose.ClientSession
// ) => {
//   const sendData = {
//     customer_payment_publisher_id: customer_id,
//     customer_payment_updated_by: customer_id,
//     transaction_id: payment_transaction_id,
//     payment_note: "From POS Selling Full Payment",
//     payment_amount,
//     customer_id,
//     payment_bank_id,
//     previous_due: findCustomer.previous_due,
//     previous_advance: findCustomer.previous_advance,
//   };

//   await postCustomerPaymentWhenOrderServices(sendData, session);
// };

// export const handlePartialPayment = async (
//     customer_id: string,
//     payment_transaction_id: string,
//     payment_bank_id: string,
//     received_amount: number,
//     due_amount: number,
//     findCustomer: any,
//     session: mongoose.ClientSession
//   ) => {
//     if (received_amount) {
//       const sendData = {
//         customer_payment_publisher_id: customer_id,
//         customer_payment_updated_by: customer_id,
//         transaction_id: payment_transaction_id,
//         payment_note: "From POS Selling Partial Payment",
//         payment_amount: received_amount,
//         customer_id,
//         payment_bank_id: payment_bank_id,
//         previous_due: findCustomer?.previous_due,
//         previous_advance: findCustomer?.previous_advance,
//       };
//       await postCustomerPaymentWhenOrderServices(sendData, session);
//     }
//     if (due_amount) {
//       const findCustomerData: any = await CustomerModel.findById(customer_id).session(
//           session
//         );

//       if (findCustomerData?.previous_due && (!findCustomerData?.previous_advance || findCustomerData?.previous_advance == 0)) {
//         const data = {
//           previous_due: findCustomerData?.previous_due + due_amount,
//         };
//         await CustomerModel.updateOne({ _id: customer_id }, data, {
//           session,
//           runValidators: true,
//         });
//       } else if ((!findCustomerData?.previous_due || findCustomerData?.previous_due == 0) && findCustomerData?.previous_advance) {
//         if (findCustomerData?.previous_advance > due_amount) {
//           const data = {
//             previous_advance: findCustomerData?.previous_advance - due_amount,
//           };
//           await CustomerModel.updateOne({ _id: customer_id }, data, {
//             session,
//             runValidators: true,
//           });
//         } else {
//           const due = due_amount - findCustomerData?.previous_advance;
//           const data = {
//             previous_due: due,
//             previous_advance: 0,
//           };
//           await CustomerModel.updateOne({ _id: customer_id }, data, {
//             session,
//             runValidators: true,
//           });
//         }
//       }

//       const sendData = {
//         customer_due_publisher_id: customer_id,
//         customer_due_updated_by: customer_id,
//         due_note: "From POS Selling Partial Due",
//         due_amount: due_amount,
//         customer_id,
//         previous_due: findCustomer?.previous_due,
//         previous_advance: findCustomer?.previous_advance,
//       };
//       await postCustomerDueWhenOrderServices(sendData, session);
//     }
//   };

// export const postOrder: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const {
//       payment_type,
//       customer_id,
//       grand_total_amount,
//       payment_transaction_id,
//       payment_bank_id,
//       received_amount,
//       due_amount,
//       first_payment_status,
//       order_products,
//     } = req.body;

//     // Validate customer existence
//     const findCustomer = await CustomerModel.findById(customer_id).session(
//       session
//     );
//     if (!findCustomer) {
//       throw new ApiError(400, "Customer Not Found!");
//     }

//     // Generate order ID and add to request data
//     const order_id = await generateOrderId();
//     req.body.order_id = order_id;

//     // Save order in database
//     const result = await postOrderServices(req.body, session);
//     if (!result) {
//       throw new ApiError(400, "Order Addition Failed!");
//     }

//     // modify product quantity
//     await handleProductQuantity(order_products, session);

//     // Update customer status if first payment is inactive
//     if (
//       first_payment_status === "in-active" &&
//       (payment_type === "full-payment" || payment_type === "partial-payment")
//     ) {
//       await CustomerModel.updateOne(
//         { _id: customer_id },
//         {
//           first_payment_status: "active",
//           customer_status: "active",
//         },
//         { session, runValidators: true }
//       );
//     }

//     // Handle payment types
//     switch (payment_type) {
//       case "due-payment":
//         await handleDuePayment(
//           customer_id,
//           grand_total_amount,
//           findCustomer,
//           session
//         );
//         break;

//       case "full-payment":
//         await handleFullPayment(
//           customer_id,
//           payment_transaction_id,
//           payment_bank_id,
//           grand_total_amount,
//           findCustomer,
//           session
//         );
//         break;

//       case "partial-payment":
//         await handlePartialPayment(
//           customer_id,
//           payment_transaction_id,
//           payment_bank_id,
//           received_amount,
//           due_amount,
//           findCustomer,
//           session
//         );
//         break;

//       default:
//         throw new ApiError(400, "Invalid Payment Type!");
//     }

//     // Commit transaction
//     await session.commitTransaction();
//     session.endSession();

//     // Send response
//     return sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Order Added Successfully!",
//     });
//   } catch (error: any) {
//     await session.abortTransaction();
//     session.endSession();
//     next(error);
//   }
// };
