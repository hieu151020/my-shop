import React, { useEffect, useMemo, useState } from "react";
import CommonSection from "../components/UI/CommonSection";

import { Col, Container, FormGroup, Row } from "reactstrap";
import { toast } from "react-toastify";
import Helmet from "../components/Helmet/Helmet";
import useAuth from "../custom-hooks/useAuth";
import useGetData from "../custom-hooks/useGetData";

function Order(props) {
  const { currentUser } = useAuth();
  const { data: orderData, loading } = useGetData("orders");
  // const orderList =[]

  // orderData.forEach((item) => {
  //   if (item.customerEmail === currentUser?.email) {
  //     orderList.push(item)
  //   }
  // });

  const orderList = useMemo(() => {
    const filteredOrders = [];
    orderData.forEach((item) => {
      if (item.customerEmail === currentUser?.email) {
        filteredOrders.push(item);
      }
    });
    return filteredOrders;
  }, [orderData, currentUser]);

  return (
    <Helmet title="Thông tin đơn hàng">
      <CommonSection title="Thông tin đơn hàng" />
      <section>
        <Container>
          <Row>
            <Col lg="12">
              {orderData.length === 0 ? "Bạn chưa có đơn hàng nào" :
              
              <table className="table">
                <thead>
                  <tr>
                    <th>Ngày tạo</th>
                    <th>Email đặt hàng</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Thành tiền</th>
                    <th>Địa chỉ giao hàng</th>
                    <th>Tình trạng</th>
                    {/* <th>Đổi địa chỉ giao hàng</th> */}
                    <th>Hủy đơn</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <h4 className="py-5 text-center fw-bold">
                      Loading data....
                    </h4>
                  ) : (
                    orderList?.map((item) => {
                      let status = "";
                      if (item.isDelevery) {
                        status = 'Đang giao'
                      } else {
                        status = item.isConfirm ? "Đã xác nhận" : "Đã đặt"
                      }
                      return (
                        <tr key={item.id}>
                          <td>{item.checkoutDate}</td>
                          <td>{item.customerEmail}</td>
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
                              <div>{Number(i.price).toLocaleString("vi-VN")}đ</div>
                            ))}
                          </td>
                          <td>{item.totalAmount.toLocaleString("vi-VN")}đ</td>
                          <td>{item.customerAddress}</td>
                          <td>{status}</td>
                          <td>
                        <button
                          className="btn btn-danger"
                          disabled={item.isDelevery}
                          onClick={() => {
                            // showModalDeleteProduct(item);
                          }}
                        >
                          Yêu cầu hủy
                        </button>
                      </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
              }
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}

export default Order;
