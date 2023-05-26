import React, { useRef, useState } from "react";
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
import { toast } from "react-toastify";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, updateDoc } from "firebase/firestore";
import InputField from "../../../components/Field/InputField";
import TextAreaField from "../../../components/Field/TextAreaField";
import SelectField from "../../../components/Field/SelectField";
import { useSelector } from "react-redux";
import { db, storage } from "../../../firebase.config";

const listManufacture = [
  {
    name: "---------------Choose Manufacture------------------------",
    value: "",
  },
  {
    name: "Casio",
    value: "casio",
  },
];

const listCategory = [
  {
    name: "---------------Choose Category------------------------",
    value: "",
  },
  {
    name: "Nam",
    value: "men",
  },
  {
    name: "Nữ",
    value: "woman",
  },
  {
    name: "Cặp đôi",
    value: "wireless",
  },
];

const ModalEditProduct = ({ open, toggle }) => {
  const [image, setImage] = useState(null);
  const item = useSelector((state) => state.modal.getProduct);
  const formikRef = useRef();

  const editProduct = (values) => {
    const {
      productName,
      shortDesc,
      description,
      category,
      price,
      manufacture,
    } = values;
    try {
      const collectionRef = collection(db, "products");
      const docRef = doc(collectionRef, item.id);
      const storageRef = ref(
        storage,
        `productImages/${Date.now() + image.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        () => {
          toast.error("Images didn't uploaded!!!");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (dowloadURL) => {
            await updateDoc(docRef, {
              productName: productName,
              shortDesc: shortDesc,
              description: description,
              category: category,
              manufacture: manufacture,
              price: price.slice(0,-1),
              imgUrl: dowloadURL,
            });
          });
        }
      );
      setTimeout(() => {
        toggle();
        toast.success("Edit product successful");
      }, 500);
    } catch (error) {
      toast.error(error);
    }
  };

  const closeBtn = (
    <Button color="secondary" className="btn__close" onClick={toggle}>
      <i className="ri-close-line"></i>
    </Button>
  );

  const initialValues = {
    productName: item?.productName,
    shortDesc: item?.shortDesc,
    description: item?.description,
    category: item?.category,
    manufacture: item?.manufacture,
    price: `${item?.price}đ`,
    imageFormik: "",
  };

  const validationSchema = Yup.object().shape({
    productName: Yup.string().required("Trường này là bắt buộc"),
    shortDesc: Yup.string().required("Trường này là bắt buộc"),
    description: Yup.string().required("Trường này là bắt buộc"),
    category: Yup.string().required("Trường này là bắt buộc"),
    manufacture: Yup.string().required("Trường này là bắt buộc"),
    price: Yup.number("Trường này phải là số").required(
      "Trường này là bắt buộc"
    ),
    imageFormik: Yup.string().required("Trường này là bắt buộc"),
  });

  return (
    <section>
      <Modal
        style={{ minWidth: "800px", marginTop: "-150px" }}
        isOpen={open}
        toggle={toggle}
      >
        <ModalHeader toggle={toggle} close={closeBtn}>
          Sửa sản phẩm
        </ModalHeader>
        <ModalBody toggle={toggle} close={closeBtn}>
          <Container>
            <Row>
              <Col lg="12">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  innerRef={formikRef}
                  onSubmit={(values) => editProduct(values)}
                >
                  {(props) => {
                    return (
                      <Form>
                        <FormGroup className="form__group">
                          <Field
                            name="productName"
                            component={InputField}
                            label="Tên sản phẩm"
                            placeholder="Nhập tên sản phẩm"
                            required
                          />
                        </FormGroup>
                        <FormGroup className="form__group">
                          <Field
                            name="shortDesc"
                            component={TextAreaField}
                            rows="2"
                            label="Mô tả ngắn"
                            placeholder="Viết mô tả"
                            required
                          />
                        </FormGroup>
                        <FormGroup className="form__group">
                          <Field
                            name="description"
                            component={TextAreaField}
                            rows="6"
                            label="Chi tiết sản phẩm"
                            placeholder="Mô tả chi tiết"
                            required
                          />
                        </FormGroup>
                        <div className="d-flex align-items-center justify-content-between gap-5">
                          <FormGroup className="form__group w-50">
                            <Field
                              name="category"
                              className="w-100 p-2"
                              component={SelectField}
                              options={listCategory}
                              label="Loại sản phẩm"
                              required
                            />
                          </FormGroup>
                          <FormGroup className="form__group w-50">
                            <Field
                              name="manufacture"
                              className="w-100 p-2"
                              component={SelectField}
                              options={listManufacture}
                              label="Hãng sản xuất"
                              required
                            />
                          </FormGroup>
                        </div>
                        <div className="d-flex align-items-center justify-content-between gap-5">
                          <FormGroup className="form__group w-50">
                            <Field
                              name="price"
                              component={InputField}
                              label="Giá sản phẩm"
                              placeholder="Nhập giá sản phẩm"
                              required
                            />
                          </FormGroup>
                          <FormGroup className="form__group w-50">
                            <Field
                              name="imageFormik"
                              type="file"
                              onChange={(e) => {
                                props.setFieldValue(
                                  "imageFormik",
                                  e.currentTarget.value
                                );
                                setImage(e.target.files[0]);
                              }}
                              component={InputField}
                              style={{ color: "black" }}
                              label="Ảnh của sản phẩm"
                              required
                            />
                          </FormGroup>
                        </div>

                        <button className="buy__btn" type="submit">
                          Lưu
                        </button>
                        <button className="buy__btn" onClick={toggle}>
                          Đóng
                        </button>
                      </Form>
                    );
                  }}
                </Formik>
              </Col>
            </Row>
          </Container>
        </ModalBody>
      </Modal>
    </section>
  );
};

export default ModalEditProduct;
