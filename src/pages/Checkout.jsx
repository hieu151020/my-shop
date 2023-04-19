import React from "react";
import "../styles/checkout.css";
import { Col, Container, Form, FormGroup, Row } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { useSelector } from "react-redux";

const Checkout = () => {
  const totalQty = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  return (
    <Helmet title="Thông tin đặt hàng">
      <CommonSection title="Thông tin đặt hàng" />
      <section>
        <Container>
          <Row>
            <Col>
              <span className="btn__back">
                <i class="ri-arrow-drop-left-line"></i>
              </span>
            </Col>
          </Row>
          <Row>
            <Col lg="8">
              <h4 className="mb-2 fw-bold">Thông tin đặt hàng</h4>
              <i>
                <h6 className="mb-4" style={{ color: "red" }}>
                  Lưu ý: Hãy điền đầy đủ và đúng thông tin của bạn để được hỗ
                  trợ tốt nhất!
                </h6>
              </i>
              <Form className="billing__form">
                <FormGroup className="form__group">
                  <h6 className="mb-2">Họ và tên:</h6>
                  <input type="text" placeholder="Nhập họ tên" />
                </FormGroup>
                <FormGroup className="form__group">
                  <h6 className="mb-2">Số điện thoại:</h6>
                  <input type="number" placeholder="Nhập số điện thoại" />
                </FormGroup>
                <FormGroup className="form__group">
                  <h6 className="mb-2">Địa chỉ:</h6>
                  <input type="text" placeholder="Nhập địa chỉ" />
                </FormGroup>
                <FormGroup className="form__group">
                  <h6 className="mb-2">Ghi chú:</h6>
                  <input type="text" placeholder="Ghi chú" />
                </FormGroup>
                <FormGroup className="form__group">
                  <h6 className="mb-2">Phương thức thanh toán:</h6>
                  <input type="text" placeholder="Phương thức" />
                </FormGroup>
              </Form>
            </Col>
            <Col lg="4">
              <div className="checkout__cart">
                <h6>
                  Tổng sản phẩm: <span>{totalQty} sản phẩm</span>
                </h6>
                <h6>
                  Tổng tiền:
                  <span>{totalAmount} đ</span>
                </h6>
                <h6>
                  Phí giao hàng: <span>15 000 đ</span>
                </h6>
                <h6>
                  Miễn phí giao hàng<span>0</span>
                </h6>

                <h5>Tổng số tiền thanh toán: </h5>
                <div className="total__cost mt-2">
                  <span>{totalAmount} đ</span>
                </div>
                <button className="buy__btn auth__btn w-100">Đặt hàng</button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Checkout;
