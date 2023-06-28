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
import useGetData from "../../custom-hooks/useGetData";
import useFomatDate from "../../custom-hooks/useFomatDate";

const listStrap = [
  {
    name: 'Dây da',
    value: 'dayda'
  },
  {
    name: 'Dây mềm',
    value: 'daymem'
  },
  {
    name: 'Dây kim loại',
    value: 'daykimloai'
  },
  {
    name: 'Dây nhựa',
    value: 'daynhua'
  },
  {
    name: 'Dây Titanium',
    value: 'daytitanium'
  },
]

function AddProduct(props) {
  const [image, setImage] = useState(null);
  const { data: manufactureData } = useGetData("listManufacture");
  const { data: categoryData } = useGetData("listCategory");

  const listManufacture = manufactureData.map((item) => {
    return {
      name: item?.manufactureName,
      value: item?.manufactureValue,
    };
  });

  const listCategory = categoryData.map((item) => {
    return {
      name: item?.categoryName,
      value: item?.categoryValue,
    };
  });

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
  
  const formattedDate = useFomatDate()
  
  const addProduct = async (values) => {
    // add product firebase database
    
    const { productName, shortDesc, description, category,manufacture,strapType, price } = values;

    try {
      const docRef = collection(db, "products");
      const storageRef = ref(
        storage,
        `productImages/${Date.now() + image.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        () => {
          toast.error("Images didn't uploaded!!");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (dowloadURL) => {
            await addDoc(docRef, {
              productName: productName,
              shortDesc: shortDesc,
              description: description,
              category: category,
              manufacture:manufacture,
              // strapType:strapType,
              price: price,
              createAt:formattedDate,
              stockNumber:0,
              available:0,
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
    // strapType:"",
    price: "",
    imageFormik: "",
  };

  const validationSchema = Yup.object().shape({
    productName: Yup.string().required("Hãy nhập tên sản phẩm"),
    shortDesc: Yup.string().required("Viết mô tả ngắn"),
    description: Yup.string().required("Viết mô tả chi tiết"),
    category: Yup.string().required("Chọn loại sản phẩm"),
    manufacture: Yup.string().required("Chọn hãng sản xuất"),
    // strapType: Yup.string().required("Chọn loại dây"),
    price: Yup.number("Trường này phải là số").required(
      "Hãy nhập giá sản phẩm"
    ),
    imageFormik: Yup.string().required("Hãy chọn ảnh cho sản phẩm"),
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
                    {/* <FormGroup className="form__group w-50">
                        <Field
                          name="strapType"
                          className="w-100 p-2"
                          component={SelectField}
                          options={listStrap}
                          label="Loại dây"
                          required
                        />
                      </FormGroup> */}
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
