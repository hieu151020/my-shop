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

const ModalEditProduct = ({ open, toggle, manufactureData,categoryData, isEdit }) => {
  const [image, setImage] = useState(null);
  const item = useSelector((state) => state.modal.getProduct);
  const formikRef = useRef();

  const listManufacture = manufactureData.map((item) => {
    return {
      name: item?.manufactureName,
      value: item?.manufactureValue,
    };
  });

  const listCategory = manufactureData.map((item) => {
    return {
      name: item?.categoryName,
      value: item?.categoryValue,
    };
  });

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
      if (image) {
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
                price: price,
                imgUrl: dowloadURL,
              });
            });
          }
        );
      } else {
        updateDoc(docRef, {
          productName: productName,
          shortDesc: shortDesc,
          description: description,
          category: category,
          manufacture: manufacture,
          price: price,
        });
      }
      setTimeout(() => {
        toggle();
        toast.success("Edit product successful");
      }, 500);
    } catch (error) {
      toast.error(error);
    }
  };

  const importProduct = (values) => {
    const { stockNumber, newStockNumber } = values;
    try {
      const collectionRef = collection(db, "products");
      const docRef = doc(collectionRef, item.id);
      updateDoc(docRef, {
        stockNumber: Number(stockNumber) + Number(newStockNumber),
        available: Number(item.available) + Number(newStockNumber),
      });
      setTimeout(() => {
        toggle();
        toast.success("Import product successful");
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
    price: item?.price,
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
    // imageFormik: Yup.string().required("Trường này là bắt buộc"),
  });

  return (
    <section>
      <Modal
        style={
          isEdit
            ? { minWidth: "800px", marginTop: "-150px" }
            : { minWidth: "800px" }
        }
        isOpen={open}
        toggle={toggle}
      >
        <ModalHeader toggle={toggle} close={closeBtn}>
          {isEdit ? "Sửa sản phẩm" : `Nhập sản phẩm: ${item?.productName}`}
        </ModalHeader>
        <ModalBody toggle={toggle} close={closeBtn}>
          <Container>
            <Row>
              {isEdit ? (
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
                            />
                          </FormGroup>
                          <FormGroup className="form__group">
                            <Field
                              name="shortDesc"
                              component={TextAreaField}
                              rows="2"
                              label="Mô tả ngắn"
                              placeholder="Viết mô tả"
                            />
                          </FormGroup>
                          <FormGroup className="form__group">
                            <Field
                              name="description"
                              component={TextAreaField}
                              rows="6"
                              label="Chi tiết sản phẩm"
                              placeholder="Mô tả chi tiết"
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
                              />
                            </FormGroup>
                            <FormGroup className="form__group w-50">
                              <Field
                                name="manufacture"
                                className="w-100 p-2"
                                component={SelectField}
                                options={listManufacture}
                                label="Hãng sản xuất"
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
              ) : (
                <Col lg="12">
                  <Formik
                    initialValues={{
                      stockNumber: item?.stockNumber,
                      newStockNumber: "",
                    }}
                    validationSchema={Yup.object().shape({
                      newStockNumber: Yup.number(
                        "Trường này phải là số"
                      ).required("Trường này là bắt buộc"),
                    })}
                    onSubmit={(values) => importProduct(values)}
                  >
                    {(props) => (
                      <Form>
                        <div className="d-flex align-items-center justify-content-between gap-5">
                          <FormGroup className="form__group w-50">
                            <Field
                              name="stockNumber"
                              component={InputField}
                              label="Số lượng sản phẩm có trong kho"
                              disable
                            />
                          </FormGroup>
                          <FormGroup className="form__group w-50">
                            <Field
                              name="newStockNumber"
                              component={InputField}
                              label="Nhập sản phẩm"
                              placeholder="Nhập số sản phẩm"
                              required
                            />
                          </FormGroup>
                        </div>
                        <button className="buy__btn" type="submit">
                          Nhập hàng
                        </button>
                      </Form>
                    )}
                  </Formik>
                </Col>
              )}
            </Row>
          </Container>
        </ModalBody>
      </Modal>
    </section>
  );
};

export default ModalEditProduct;
