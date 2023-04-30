import React from "react";
import "../styles/checkout.css";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";

import { Col, Container, FormGroup, Row } from "reactstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import useAuth from "../custom-hooks/useAuth";

import InputField from "../components/Field/InputField";
import TextAreaField from "../components/Field/TextAreaField";

import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import { db } from "../firebase.config";
import { collection, addDoc } from "firebase/firestore";

const Checkout = () => {
  const { cartItems, totalQuantity, totalAmount } = useSelector(
    (state) => state.cart
  );

  // const totalAmount = useSelector((state) => state.cart.totalAmount);
  const { currentUser } = useAuth();

  const addOrder = async (values) => {
    const { customerName, customerNumber, customerAddress, note } = values;

    if (totalQuantity === 0) {
      toast.error("Bạn chưa có sản phẩm nào trong giỏ hàng");
    } else {
      try {
        const docRef = collection(db, "orders");

        await addDoc(docRef, {
          customerName: customerName,
          customerNumber: customerNumber,
          customerAddress: customerAddress,
          note: note,
          customerEmail: currentUser?.email,
          item: [...cartItems],
          totalQuantity: totalQuantity,
          totalAmount: totalAmount,
        });

        // clearForm();
        toast.success("Bạn đã đặt hàng thành công");
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const initialValues = {
    customerName: "",
    customerNumber: "",
    customerAddress: "",
    note: "",
  };

  const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;

  const validationSchema = Yup.object().shape({
    customerName: Yup.string().required("Trường này là bắt buộc"),
    customerNumber: Yup.string().matches(
      vnf_regex,
      "Vui lòng nhập số điện thoại hợp lệ bao gồm 10 chữ số"
    ),
    customerAddress: Yup.string().required("Trường này là bắt buộc"),
  });

  return (
    <Helmet title="Thông tin đặt hàng">
      <CommonSection title="Thông tin đặt hàng" />
      <section>
        <Container>
          <Row>
            <Col>
              <span className="btn__back">
                <i className="ri-arrow-drop-left-line"></i>
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
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                // innerRef={formikRef}
                onSubmit={addOrder}
              >
                {(props) => {
                  return (
                    <Form>
                      <FormGroup className="form__group">
                        <Field
                          name="customerName"
                          component={InputField}
                          label="Họ và tên"
                          placeholder="Nhập họ tên"
                          required
                        />
                      </FormGroup>
                      <FormGroup className="form__group">
                        <Field
                          name="customerNumber"
                          component={InputField}
                          label="Số điện thoại"
                          placeholder="Nhập số điện thoại"
                          required
                        />
                      </FormGroup>
                      <FormGroup className="form__group">
                        <Field
                          name="customerAddress"
                          component={InputField}
                          label="Địa chỉ giao hàng"
                          placeholder="Nhập địa chỉ"
                          required
                        />
                      </FormGroup>
                      <FormGroup className="form__group">
                        <Field
                          name="note"
                          component={TextAreaField}
                          rows="2"
                          label="Ghi chú cho người bán"
                          placeholder="Viết ghi chú"
                        />
                      </FormGroup>

                      <button className="buy__btn" type="submit">
                        Tạo đơn hàng
                      </button>
                      <button className="buy__btn" type="reset">
                        Clear
                      </button>
                    </Form>
                  );
                }}
              </Formik>
            </Col>
            <Col lg="4">
              <div className="checkout__cart">
                <h6>
                  Tổng sản phẩm: <span>{totalQuantity} sản phẩm</span>
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
                {/* <button className="buy__btn auth__btn w-100">Đặt hàng</button> */}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Checkout;
