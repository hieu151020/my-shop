import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import useFomatDate from "../../custom-hooks/useFomatDate";

const PayPalButton = ({ amount, disable, listOrder }) => {
  const [paid, setPaid] = useState(false);
  const formattedDate = useFomatDate();
  console.log();
  const handlePayment = () => {
    window.paypal
    .Buttons({
      createOrder: (data, actions) => {
          const name = listOrder[0]?.customerName
          const address = listOrder[0]?.customerAddress
          // Tạo đơn hàng PayPal với số tiền và các chi tiết khác
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                },
                shipping: {
                  name: {
                    full_name: name,
                  },
                  // address: {
                  //   address_line_1: address,
                  //   address_line_2:"",
                  //   admin_area_2: "",
                  //   admin_area_1: "",
                  //   postal_code: "",
                  //   country_code: "VN",
                  // },
                },
              },
            ],
          });
        },
        onApprove: (data, actions) => {
          // Xác nhận thanh toán và cập nhật trạng thái đã thanh toán
          return actions.order
            .capture()
            .then(() => {
              setPaid(true);
              return new Promise((resolve, reject) => {
                try {
                  listOrder.forEach(async (order) => {
                    const collectionRef = collection(db, "orders");
                    const docRef = doc(collectionRef, order.id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                      const docData = docSnap.data();
                      const updatePromise = updateDoc(docRef, {
                        isPaid: !docData.isPaid,
                      });
                      resolve(updatePromise);
                    }

                    const docRevenueRef = collection(db, "revenue");

                    addDoc(docRevenueRef, {
                      orderId: order.id,
                      customerEmail: order.customerEmail,
                      item: order.item,
                      total: order.totalAmount,
                      successAt: formattedDate,
                    });

                    await order.item.forEach(async (pro) => {
                      const collectionRef = collection(db, "products");
                      const docRef = doc(collectionRef, pro.id);
                      const docSnap = await getDoc(docRef);
                      if (docSnap.exists()) {
                        const docData = docSnap.data();
                        updateDoc(docRef, {
                          stockNumber: docData.stockNumber - pro.quantity,
                        });
                      }
                    });
                  });
                } catch (error) {
                  reject(error);
                }
              });
            })
            .catch((error) => {
              toast.error(error);
            });
        },
        onError: (err) => {
          // Xử lý lỗi khi thanh toán không thành công
          console.error(err);
        },
      })
      .render("#paypal-button");
  };
  return (
    <>
      {!paid && (
        <div
          id="paypal-button"
          className={`btn-primary-admin ${disable ? "btn__disable" : ""}`}
          onClick={handlePayment}
        >
          Thanh toán Paypal
        </div>
      )}
      {paid && <div className="btn btn-danger" style={{pointerEvents:'none'}} >Đã thanh toán thành công!!!</div>}
    </>
  );
};

export default PayPalButton;
