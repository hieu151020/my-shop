import React, { useEffect } from "react";
import "../styles/checkout.css";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";

import { Col, Container, FormGroup, Row } from "reactstrap";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../custom-hooks/useAuth";

import InputField from "../components/Field/InputField";
import TextAreaField from "../components/Field/TextAreaField";

import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import { db } from "../firebase.config";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import useFomatDate from "../custom-hooks/useFomatDate";
import { cartActions } from "../redux/slices/cartSlice";

const Checkout = () => {
  const { cartItems, totalQuantity, totalAmount } = useSelector(
    (state) => state.cart
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formattedDate = useFomatDate()

  // const totalAmount = useSelector((state) => state.cart.totalAmount);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      toast.warning("Please login first");
    }
  }, [currentUser]);

  const addOrder = async (values) => {
    const { customerName, customerNumber, customerAddress, note } = values;
    if (totalQuantity === 0) {
      toast.warning("Empty cart");
    } else {
      if (!currentUser) {
        toast.warning("Please login first");
      } else {
        try {
          cartItems.forEach(async (product) => {
            const collectionRef = collection(db, "products");
            const docRef = doc(collectionRef, product.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const docData = docSnap.data();
              await updateDoc(docRef, {
                available: docData.available - product.quantity,
              });
            }
            
          });
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
            checkoutDate: formattedDate,
            isConfirm: false,
            isPaid: false,
            isCancle:false,
          });

          dispatch(cartActions.clearCard());
          toast.success("Checkout successfull");
          navigate("/order");
        } catch (error) {
          toast.error(error);
        }
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
    customerNumber: Yup.string()
      .matches(
        vnf_regex,
        "Vui lòng nhập số điện thoại hợp lệ bao gồm 10 chữ số"
      )
      .required("Trường này là bắt buộc"),
    customerAddress: Yup.string().required("Trường này là bắt buộc"),
  });

  return (
    <Helmet title="Thông tin đặt hàng">
      <CommonSection title="Thông tin đặt hàng" />
      <section>
        <Container>
          {/* <Row>
            <Col>
              <span className="btn__back">
                <i className="ri-arrow-drop-left-line"></i>
              </span>
            </Col>
          </Row> */}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            // innerRef={formikRef}
            onSubmit={addOrder}
          >
            {(props) => {
              return (
                <Form>
                  <Row>
                    <Col lg="8">
                      <h4 className="mb-2 fw-bold">Thông tin đặt hàng</h4>
                      <i>
                        <h6 className="mb-4" style={{ color: "red" }}>
                          Lưu ý: Hãy điền đầy đủ và đúng thông tin của bạn để
                          được hỗ trợ tốt nhất!
                        </h6>
                      </i>
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
                      <button className="buy__btn" type="reset">
                        Clear
                      </button>
                    </Col>

                    <Col lg="4">
                      <div className="checkout__cart">
                        <h6>
                          Tổng sản phẩm: <span>{totalQuantity} sản phẩm</span>
                        </h6>
                        <h6>
                          Tổng tiền:
                          <span>{totalAmount.toLocaleString("vi-VN")}đ</span>
                        </h6>
                        {/* <h6>
                          Phí giao hàng: <span>15 000 đ</span>
                        </h6> */}
                        <h6>
                          Phí giao hàng: <span style={{color:'#1cc88a'}}>+0đ</span>
                        </h6>

                        <h6>Tổng số tiền thanh toán: <span className="total__cost mt-2">{totalAmount.toLocaleString("vi-VN")}đ</span></h6>
                        <button
                          className="buy__btn auth__btn w-100"
                          type="submit"
                        >
                          Đặt hàng
                        </button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </Container>
      </section>
    </Helmet>
  );
};

export default Checkout;
