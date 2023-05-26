import React, { useRef, useState } from "react";
import { Col, Container, FormGroup, Row } from "reactstrap";
import { toast } from "react-toastify";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import { db, storage } from "../../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

import InputField from "../../components/Field/InputField";
import TextAreaField from "../../components/Field/TextAreaField";
import SelectField from "../../components/Field/SelectField";

const listManufacture = [
  {
    name:"------------------------Choose Manufacture------------------------",
    value:''
  },
  {
    name: "Casio",
    value: "casio",
  },
]

const listCategory = [
  {
    name:"------------------------Choose Category------------------------",
    value:''
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

function AddProduct(props) {
  const [image, setImage] = useState(null);

  const formikRef = useRef();

  const clearForm = () => {
    formikRef.current.setFieldValue("productName", "");
    formikRef.current.setFieldValue("shortDesc", "");
    formikRef.current.setFieldValue("description", "");
    formikRef.current.setFieldValue("category", "");
    formikRef.current.setFieldValue("manufacture", "");
    formikRef.current.setFieldValue("price", "");
    formikRef.current.setFieldValue("imageFormik", "");
    setImage(null);
  };

  const addProduct = async (values) => {
    // add product firebase database

    const { productName, shortDesc, description, category,manufacture, price } = values;

    try {
      const docRef = collection(db, "products");
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
            await addDoc(docRef, {
              productName: productName,
              shortDesc: shortDesc,
              description: description,
              category: category,
              manufacture:manufacture,
              price: price,
              imgUrl: dowloadURL,
            });
          });
        }
      );
      clearForm();
      toast.success("Add product successful");
    } catch (error) {
      toast.error(error);
    }
  };

  const initialValues = {
    productName: "",
    shortDesc: "",
    description: "",
    category: "",
    manufacture:"",
    price: "",
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
      <Container>
        <Row>
          <Col lg="12">
            <h4 className="fw-bold mb-5 head__title">Thêm mới sản phẩm</h4>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              innerRef={formikRef}
              onSubmit={addProduct}
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
                      Thêm sản phẩm
                    </button>
                    <button className="buy__btn" type="reset">
                      Clear
                    </button>
                  </Form>
                );
              }}
            </Formik>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default AddProduct;
