import React from "react";
import { Container, Row, Col } from "reactstrap";

import useGetData from "../custom-hooks/useGetData";
import useToggleDialog from "../custom-hooks/useToggleDialog";
import ModalConfirmDelete from "../components/Modal/ModalConfirmDelete";

function Orders(props) {
  const { data: orderData, loading } = useGetData("orders");
  console.log("orderData", orderData);
  const { open, toggle, shouldRender } = useToggleDialog();

  const showModalDeleteProduct = () => {
    toggle();
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
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
                  <th>Giao hàng</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <h4 className="py-5 text-center fw-bold">Loading data....</h4>
                ) : (
                  orderData.map((item) => (
                    <tr key={item.id}>
                      <td>25/4/2023</td>
                      <td>{item.customerEmail}</td>
                      <td>{item.item.map((i) => i.productName)}</td>
                      <td>{item.totalQuantity}</td>
                      <td>{item.totalQuantity}</td>
                      <td>{item.totalAmount}đ</td>
                      <td>{item.customerAddress}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            showModalDeleteProduct(item);
                          }}
                        >
                          Giao
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
      {shouldRender && (
        <ModalConfirmDelete
          toggle={toggle}
          open={open}
          content="giao đơn hàng"
          // onSubmit={deleteProduct}
        />
      )}
    </section>
  );
}

export default Orders;
