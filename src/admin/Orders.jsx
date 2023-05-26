import React from "react";
import { Container, Row, Col } from "reactstrap";

import useGetData from "../custom-hooks/useGetData";
import useToggleDialog from "../custom-hooks/useToggleDialog";
import ModalConfirmDelete from "../components/Modal/ModalConfirmDelete";
import Helmet from "../components/Helmet/Helmet";

function Orders(props) {
  const { data: orderData, loading } = useGetData("orders");
  const { open, toggle, shouldRender } = useToggleDialog();

  const showModalDeleteProduct = () => {
    toggle();
  };

  return (
    <Helmet title={"Dashboard"}>
    <section>
      <Container>
        <Row>
        <Col lg="12">
            <h4 className="fw-bold mb-5 head__title">Quản lí đơn hàng</h4>
          </Col>
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
                  <th>Hủy đơn</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <h4 className="py-5 text-center fw-bold">Loading data....</h4>
                ) : (
                  orderData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.checkoutDate}</td>
                      <td>{item.customerEmail}</td>
                      <td>{item.item.map((i) => <div>{i.productName}</div>)}</td>
                      <td>{item.item.map((i) => <div>{i.quantity}</div>)}</td>
                      <td>{item.item.map((i) => <div>{i.price}đ</div>)}</td>
                      <td>{item.totalAmount}đ</td>
                      <td>{item.customerAddress}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                           
                          }}
                        >
                          Giao
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            showModalDeleteProduct(item);
                          }}
                        >
                          Hủy
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
          content="đơn hàng"
          // onSubmit={deleteProduct}
        />
      )}
    </section>
    </Helmet>
  );
}

export default Orders;
