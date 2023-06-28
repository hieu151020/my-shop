import React, { useEffect, useRef, useState } from "react";
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
import InputField from "../../../components/Field/InputField";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebase.config";
import { toast } from "react-toastify";
import useToggleDialog from "../../../custom-hooks/useToggleDialog";
import ModalConfirmDelete from "../../../components/Modal/ModalConfirmDelete";
import { modalActions } from "../../../redux/slices/modalSlice";
import { useDispatch } from "react-redux";
import useFomatDate from "../../../custom-hooks/useFomatDate";
import ModalEditManufacture from "./ModalEditManufacture";

function ModalManageManufacture({
  open,
  toggle,
  data,
  loading,
  isManufacture,
}) {
  const [listData, setListData] = useState([]);
  const {
    open: openEdit,
    toggle: toggleEdit,
    shouldRender: shouldRenderEdit,
  } = useToggleDialog();
  const {
    open: openDelete,
    toggle: toggleDelete,
    shouldRender: shouldRenderDelete,
  } = useToggleDialog();
  const dispatch = useDispatch();
  const formikRef = useRef();

  useEffect(() => {
    setListData(data);
  }, [data]);

  const showModalDeleteProduct = async (item) => {
    toggleDelete();
    dispatch(modalActions.getProduct(item));
  };

  const deleteProduct = (id) => {
    if (isManufacture) {
      deleteDoc(doc(db, "listManufacture", id));
    } else {
      deleteDoc(doc(db, "listCategory", id));
    }
    toast.success("Delete success!!");
  };
  
  const formattedDate = useFomatDate()

  const addManufacture = (values) => {
    let dataValue = values.dataName;
    dataValue = dataValue.replace(/\s/g, "").toLowerCase();
    try {
      if (isManufacture) {
        const docRef = collection(db, "listManufacture");

        addDoc(docRef, {
          manufactureName: values.dataName,
          manufactureValue: dataValue,
          createAt: formattedDate,
        });
      } else {
        const docRef = collection(db, "listCategory");

        addDoc(docRef, {
          categoryName: values.dataName,
          categoryValue: dataValue,
          createAt: formattedDate,
        });
      }
      formikRef.current.setFieldValue("dataName", "");
      setListData(...listData, { values });
      toast.success("Add successful");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleEdit=(item)=>{
toggleEdit()
dispatch(modalActions.getProduct(item));
  }

  const closeBtn = (
    <Button color="secondary" className="btn__close" onClick={toggle}>
      <i className="ri-close-line"></i>
    </Button>
  );
  
  return (
    <section>
      <Modal
        style={{ minWidth: "800px", marginTop: "-100px" }}
        isOpen={open}
        toggle={toggle}
      >
        <ModalHeader toggle={toggle} close={closeBtn}>
          {isManufacture
            ? "Danh sách hãng sản xuất"
            : "Danh sách loại sản phẩm"}
        </ModalHeader>
        <ModalBody toggle={toggle} close={closeBtn}>
          <Container>
            <Row>
              <Col lg="12">
                <Formik
                  initialValues={{ dataName: "" }}
                  validationSchema={Yup.object().shape({
                    dataName: Yup.string().required("Trường này là bắt buộc"),
                  })}
                  innerRef={formikRef}
                  onSubmit={(values) => addManufacture(values)}
                >
                  {(props) => {
                    return (
                      <Form>
                        <FormGroup className="d-flex align-items-center justify-content-left  form__group">
                          <Field
                            name="dataName"
                            component={InputField}
                            className='input-default'
                            label={
                              isManufacture
                                ? "Tên hãng sản xuất"
                                : "Tên loại sản phẩm"
                            }
                            placeholder={
                              isManufacture
                                ? "Nhập tên hãng sản xuất"
                                : "Nhập tên loại sản phẩm"
                            }
                          />
                          <button
                            className="btn-primary-admin mt-2"
                            style={{ marginLeft: "20px" }}
                            type="submit"
                          >
                            Thêm
                          </button>
                        </FormGroup>
                      </Form>
                    );
                  }}
                </Formik>
                <div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Ngày tạo</th>
                        {isManufacture ? (
                          <th>Tên hãng sản phẩm</th>
                        ) : (
                          <th>Tên loại sản phẩm</th>
                        )}
                        <th>Sửa</th>
                        <th>Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <h4 className="py-5 text-center fw-bold">
                          Loading data....
                        </h4>
                      ) : (
                        data?.map((item, index) => {
                          return (
                            <>
                              <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.createAt}</td>
                                {isManufacture ? (
                                  <td>{item.manufactureName}</td>
                                ) : (
                                  <td>{item.categoryName}</td>
                                )}
                                <td>
                                  <button
                                    className="btn-primary-admin"
                                    onClick={() => handleEdit(item)}
                                  >
                                    Sửa
                                  </button>
                                </td>
                                <td>
                                  <button
                                    className="btn-danger-admin"
                                    onClick={() => {
                                      showModalDeleteProduct(item);
                                    }}
                                  >
                                    Xóa
                                  </button>
                                </td>
                              </tr>
                            </>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="btn__footer">
                  <button className="buy__btn" onClick={toggle}>
                    Đóng
                  </button>
                </div>
              </Col>
            </Row>
          </Container>
        </ModalBody>
      </Modal>
      {shouldRenderDelete && (
        <ModalConfirmDelete
          toggle={toggleDelete}
          open={openDelete}
          content={isManufacture?"xóa hãng sản xuất":"xóa loại sản phẩm"}
          onSubmit={deleteProduct}
        />
      )}
      {shouldRenderEdit && (
        <ModalEditManufacture
          toggle={toggleEdit}
          open={openEdit}
          isManufacture={isManufacture}
          data={listData}
        />
      )}
    </section>
  );
}

export default ModalManageManufacture;
