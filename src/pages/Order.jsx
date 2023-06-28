import React, { useEffect, useMemo, useState } from "react";
import CommonSection from "../components/UI/CommonSection";
import { Col, Container, FormGroup, Row } from "reactstrap";
import { toast } from "react-toastify";
import Helmet from "../components/Helmet/Helmet";
import useAuth from "../custom-hooks/useAuth";
import useGetData from "../custom-hooks/useGetData";
import useToggleDialog from "../custom-hooks/useToggleDialog";
import ModalConfirmDelete from "../components/Modal/ModalConfirmDelete";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../redux/slices/modalSlice";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import useFomatDate from "../custom-hooks/useFomatDate";
import PayPalButton from "../components/Order/Paypal";

function Order(props) {
  const { currentUser } = useAuth();
  const { data: orderData, loading } = useGetData("orders");
  const { open, toggle, shouldRender } = useToggleDialog();
  const [listOrder, setListOrder] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const getProduct = useSelector((state) => state.modal.getProduct);
  const formattedDate = useFomatDate();

  const dispatch = useDispatch();

  const orderList = useMemo(() => {
    const filteredOrders = [];
    orderData.forEach((item) => {
      if (item.customerEmail === currentUser?.email) {
        filteredOrders.push(item);
      }
    });
    return filteredOrders;
  }, [orderData, currentUser]);

  const handleCancleRequest = (item) => {
    toggle();
    dispatch(modalActions.getProduct(item));
  };

  const handleConfirm = (item) => {
    // setCancle(false);
    // toggle();
    dispatch(modalActions.getProduct(item));
  };

  const cancleRequest = (id) => {
    try {
      const collectionRef = collection(db, "orders");
      const docRef = doc(collectionRef, id);
      updateDoc(docRef, {
        isCancle: true,
      });
      setTimeout(() => {
        toast.success("Cancle product successful");
      }, 500);
    } catch (error) {
      toast.error(error);
    }
  };

  const confirm = (id) => {
    try {
      const docRef = collection(db, "revenue");

      addDoc(docRef, {
        orderId: getProduct.id,
        customerEmail: getProduct.customerEmail,
        item: getProduct.item,
        total: getProduct.totalAmount,
        successAt: formattedDate,
      });

      toast.success("Confirm successful");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleChoseOrder = (e, order) => {
    const checked = e.target.checked;
    if (checked === true) {
      setListOrder((prev) => [...prev, order]);
    }
    if (checked === false) {
      setListOrder((prev) => prev.filter((el) => el !== order));
    }
  };

  useEffect(() => {
    let total = listOrder.reduce((acc, cur) => {
      return acc + cur.totalAmount;
    }, 0);
    total = (total * 0.000043).toFixed(2);
    setTotalAmount(total);
  }, [listOrder]);

  console.log(totalAmount);

  return (
    <Helmet title="Đơn hàng của bạn">
      <CommonSection title="Đơn hàng của bạn" />
      <section>
        {loading ? (
          <div className="loading-overlay">
            <div className="loading-spinner" />
          </div>
        ) : (
          <Container>
            <Row>
              {orderList.length === 0 ? (
                <Col lg="12" className="text-center fw-bold">
                  <div style={{ fontSize: "25px", color: "red" }}>
                    Bạn chưa có đơn hàng nào!!
                  </div>
                </Col>
              ) : (
                <>
                <Col lg="9">
                  <table className="table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Ngày tạo</th>
                        {/* <th>Email đặt hàng</th> */}
                        <th>Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                        <th>Thành tiền</th>
                        <th>Địa chỉ giao hàng</th>
                        <th>Trạng thái</th>
                        {/* <th>Thanh toán</th> */}
                        <th>Hủy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderList?.map((item) => {
                        let status = "";
                        if (item.isPaid) {
                          status = "Đã thanh toán";
                        } else if (item.isCancle) {
                          status = "Đã hủy";
                        } else {
                          status = "Đã đặt";
                        }

                        return (
                          <tr key={item.id}>
                            <td>
                              <input
                                type="checkbox"
                                className="my-checkbox"
                                disabled={item.isPaid || item.isCancle}
                                onClick={(e, order = item) =>
                                  handleChoseOrder(e, order)
                                }
                              />
                            </td>
                            <td>{item.checkoutDate}</td>
                            {/* <td>{item.customerEmail}</td> */}
                            <td>
                              {item.item.map((i) => (
                                <div>{i.productName}</div>
                              ))}
                            </td>
                            <td>
                              {item.item.map((i) => (
                                <div>{i.quantity}</div>
                              ))}
                            </td>
                            <td>
                              {item.item.map((i) => (
                                <div>
                                  {Number(i.price).toLocaleString("vi-VN")}đ
                                </div>
                              ))}
                            </td>
                            <td>{item.totalAmount.toLocaleString("vi-VN")}đ</td>
                            <td>{item.customerAddress}</td>
                            <td style={{ minWidth: "100px" }}>
                              <span
                                style={{ color: "red", fontWeight: "bold" }}
                              >
                                {status}
                              </span>
                            </td>
                            <td>
                              <button
                                className={`btn-danger-admin ${
                                  item.isPaid || item.isCancle
                                    ? "btn__disable"
                                    : ""
                                }`}
                                disabled={item.isPaid || item.isCancle}
                                onClick={() => {
                                  handleCancleRequest(item);
                                }}
                              >
                                Hủy
                              </button>
                            </td>
                            <td></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Col>
                <Col lg="3">
                  <PayPalButton
                    amount={totalAmount}
                    disable={listOrder.length === 0}
                    listOrder={listOrder}
                  />
                </Col></>
              )}
            </Row>
          </Container>
        )}
        {shouldRender && (
          <ModalConfirmDelete
            toggle={toggle}
            open={open}
            content=" hủy đơn hàng"
            onSubmit={cancleRequest}
          />
        )}
      </section>
    </Helmet>
  );
}

export default Order;
