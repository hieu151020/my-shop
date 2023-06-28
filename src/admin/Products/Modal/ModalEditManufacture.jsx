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
import useFomatDate from "../../../custom-hooks/useFomatDate";

const ModalEditManufacture = ({ open, toggle, data, isManufacture }) => {
  const formattedDate = useFomatDate();
  const item = useSelector((state) => state.modal.getProduct);
  const editManufacture = (values) => {
    const dataName = isManufacture ? item.manufactureName : item.categoryName;
    let dataValue = values.dataName;
    dataValue = dataValue.replace(/\s/g, "").toLowerCase();
    if (values.dataName === dataName) {
      setTimeout(() => {
        toggle();
        toast.success("Update successful");
      }, 500);
    } else if (
      data.find((i) => i.manufactureValue || i.categoryValue === dataValue)
    ) {
      setTimeout(() => {
        toast.warning("Duplicate data");
      }, 500);
    } else {
      const collectionName = isManufacture ? "listManufacture" : "listCategory";
      try {
        const collectionRef = collection(db, collectionName);
        const docRef = doc(collectionRef, item.id);
        if (isManufacture) {
          updateDoc(docRef, {
            manufactureName: values.dataName,
            manufactureValue: dataValue,
            createAt: formattedDate,
          });
        } else {
          updateDoc(docRef, {
            categoryName: values.dataName,
            categoryValue: dataValue,
            createAt: formattedDate,
          });
        }
        setTimeout(() => {
          toggle();
          toast.success("Update successful");
        }, 500);
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const closeBtn = (
    <Button color="secondary" className="btn__close" onClick={toggle}>
      <i className="ri-close-line"></i>
    </Button>
  );

  return (
    <section>
      <Modal style={{ minWidth: "500px" }} isOpen={open} toggle={toggle}>
        <ModalHeader toggle={toggle} close={closeBtn}>
          {isManufacture ? "Sửa hãng sản xuất" : "Sửa loại sản phẩm"}
        </ModalHeader>
        <ModalBody toggle={toggle} close={closeBtn}>
          <Container>
            <Row>
              <Col lg="12">
                <Formik
                  initialValues={{
                    dataName: isManufacture
                      ? item.manufactureName
                      : item.categoryName,
                  }}
                  onSubmit={(values) => editManufacture(values)}
                >
                  {(props) => {
                    return (
                      <Form>
                        <FormGroup className="form__group">
                          <Field
                            name="dataName"
                            component={InputField}
                            label={
                              isManufacture ? "Hãng sản xuất" : "Loại sản phẩm"
                            }
                            placholder={
                              isManufacture
                                ? "Nhập hãng sản xuất"
                                : "Nhập loại sản phẩm"
                            }
                          />
                        </FormGroup>

                        <button className="buy__btn" type="submit">
                          Lưu
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

export default ModalEditManufacture;
