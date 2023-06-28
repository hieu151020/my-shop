import React from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Col,
  Container,
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../components/Field/InputField";
import SelectField from "../../components/Field/SelectField";
import TextAreaField from "../../components/Field/TextAreaField";

function ModalDetailOrder({ open, toggle }) {
  const product = useSelector((state) => state.modal.getProduct);
  console.log("getProduct", product);
  const closeBtn = (
    <Button color="secondary" className="btn__close" onClick={toggle}>
      <i className="ri-close-line"></i>
    </Button>
  );

  const initialValues = {
    email: product?.customerEmail,
    orderId: product?.id,
    orderDate: product?.checkoutDate,
    orderAddress: product?.customerAddress,
    orderNote: product?.note,
    price: product?.price,
    imageFormik: "",
  };

  return (
    <div>
      <Modal
        style={{ minWidth: "800px", marginTop: "-100px" }}
        isOpen={open}
        toggle={toggle}
      >
        <ModalHeader toggle={toggle} close={closeBtn}>
          Chi tiết đơn hàng
        </ModalHeader>
        <ModalBody toggle={toggle} close={closeBtn}>
          <Container>
            <Row>
              <Col lg="12">
                <Formik
                  initialValues={initialValues}
                  validationSchema={Yup.object().shape({})}
                  onSubmit={() => {}}
                >
                  {(props) => {
                    return (
                      <Form>
                        <div className="d-flex align-items-center justify-content-between gap-5">
                          <FormGroup className="form__group w-50">
                            <Field
                              name="email"
                              component={InputField}
                              label="Email đặt hàng"
                              disabled
                            />
                          </FormGroup>
                          <FormGroup className="form__group w-50">
                            <Field
                              name="orderId"
                              component={InputField}
                              label="Mã đơn hàng"
                              disabled
                            />
                          </FormGroup>
                        </div>
                        <div className="d-flex align-items-center justify-content-between gap-5">
                          <FormGroup className="form__group w-50">
                            <Field
                              name="orderDate"
                              component={InputField}
                              label="Ngày đặt hàng"
                              disabled
                            />
                          </FormGroup>
                          <FormGroup className="form__group w-50">
                            <Field
                              name="orderAddress"
                              component={InputField}
                              label="Địa chỉ giao hàng"
                              disabled
                            />
                          </FormGroup>
                        </div>
                        <div className="d-flex align-items-center justify-content-between gap-5">
                          <FormGroup className="form__group w-50">
                            <Field
                              name="orderNote"
                              component={TextAreaField}
                              rows="2"
                              label="Ghi chú"
                              disabled
                            />
                          </FormGroup>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
                <div>
                  <table className="table" style={{border:'1px solid'}}>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Ảnh</th>
                        <th>Tên</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product?.item.map((item, index) => {
                        return (
                          <>
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>
                                <img src={item.imgUrl} alt="" />
                              </td>
                              <td>{item.productName}</td>
                              <td>{item.quantity}</td>
                              <td>
                                {Number(item.price).toLocaleString("vi-VN")}đ
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="fw-bold total">Tổng cộng: {Number(product.totalAmount).toLocaleString("vi-VN")}đ</div>
              </Col>
            </Row>
          </Container>

          <Col lg="12">
            <div className="btn__footer">
              <button className="buy__btn" onClick={toggle}>
                Đóng
              </button>
            </div>
          </Col>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default ModalDetailOrder;
