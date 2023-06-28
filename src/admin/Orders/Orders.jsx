import React from "react";
import { Container, Row, Col } from "reactstrap";
import useGetData from "../../custom-hooks/useGetData";
import useToggleDialog from "../../custom-hooks/useToggleDialog";
import Helmet from "../../components/Helmet/Helmet";
import ModalConfirmDelete from "../../components/Modal/ModalConfirmDelete";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../redux/slices/modalSlice";
import ModalDetailOrder from "./ModalDetailOrder";
import useSortData from "../../custom-hooks/useSortData";

function Orders(props) {
  const { data: orderData, loading } = useGetData("orders");
  const { open, toggle, shouldRender } = useToggleDialog();
  const {
    open: openDetail,
    toggle: toggleDetail,
    shouldRender: shouldRenderDetail,
  } = useToggleDialog();
  const getProductDelete = useSelector((state) => state.modal.getProduct);
  const dispatch = useDispatch();

  const dataSort = useSortData(orderData, "checkoutDate");

  const showModalDeleteProduct = (item) => {
    toggle();
    dispatch(modalActions.getProduct(item));
  };

  const deleteProduct = async (id) => {
    try {
      await getProductDelete.item.forEach(async (pro) => {
        const collectionRef = collection(db, "products");
        const docRef = doc(collectionRef, pro.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const docData = docSnap.data();
          await updateDoc(docRef, {
            available: docData.available + pro.quantity,
          });
        }
      });
      await deleteDoc(doc(db, "orders", id));
      toast.success("Delete order success!!");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleViewDetail = (item) => {
    toggleDetail();
    dispatch(modalActions.getProduct(item));
  };

  return (
    <Helmet title={"Dashboard"}>
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <h4 className="fw-bold mb-5 head__title">Quản lí đơn hàng</h4>
            </Col>
            {/* <Col lg="4" md="12" className="mb-2 search__box__col">
              <div className="search__box">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên sản phẩm"
                  onChange={(e) =>
                    setTimeout(() => setSearchValue(e.target.value), 1000)
                  }
                />
                <span>
                  <i className="ri-search-line" 
                  onClick={handleSearch}
                  ></i>
                </span>
              </div>
            </Col> */}
            <Col lg="12">
              <table className="table">
                <thead>
                  <tr>
                    <th>Ngày tạo</th>
                    <th>Email đặt hàng</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th>Địa chỉ giao hàng</th>
                    <th>Chi tiết</th>
                    <th>Trạng thái</th>
                    <th>Hủy</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <div className="loading-overlay">
                      <div className="loading-spinner" />
                    </div>
                  ) : (
                    dataSort?.map((item) => {
                      let status = "";
                      if (item.isPaid) {
                        status = "Đã thanh toán";
                      } else if (item.isCancle) {
                        status = "Đã hủy";
                      } else {
                        status = "Đã đặt";
                      }
                      return(
                        <tr key={item.id}>
                          <td>{item.checkoutDate}</td>
                          <td>{item.customerEmail}</td>
                          <td>
                            {item.item.map((i) => (
                              <div>{i.productName}</div>
                            ))}
                          </td>
                          <td>
                            {item.item.map((i) => (
                              <div>{i.quantity}</div>
                            ))}
                          </td>
                          <td>{item.totalAmount.toLocaleString("vi-VN")}đ</td>
                          <td>{item.customerAddress}</td>
                          <td
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Chi tiết"
                          >
                            <button
                              className="btn-primary-admin"
                              onClick={() => handleViewDetail(item)}
                            >
                              <i className="ri-eye-fill"></i>
                            </button>
                          </td>
                          <td style={{ minWidth: "100px" }}>
                              <span
                                style={{ color: "red", fontWeight: "bold" }}
                              >
                                {status}
                              </span>
                            </td>
                            {item.isCancle === false ? (
                                <td
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="bottom"
                                  title="Hủy"
                                >
                                  <button
                                    className={`btn-danger-admin ${item.isPaid?"btn__disable":""}`}
                                    disabled={item.isPaid}
                                    onClick={() => {
                                      showModalDeleteProduct(item);
                                    }}
                                  >
                                    <i className="ri-delete-bin-line"></i>
                                  </button>
                                </td>
                              ) : (
                                <td
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="bottom"
                                  disabled={item.isPaid}
                                  title="Xác nhận hủy"
                                >
                                  <button
                                    className={`btn-danger-admin ${item.isPaid?"btn__disable":""}`}
                                    onClick={() => {
                                      showModalDeleteProduct(item);
                                    }}
                                  >
                                    {/* <i className="ri-delete-bin-3-line"></i> */}
                                    Xác nhận
                                  </button>
                                </td>
                              )}
                        </tr>
                      )
                    }
                    )
                    
                  )}
                </tbody>
              </table>
            </Col>
          </Row>
        </Container>
        {shouldRender && (
          <ModalConfirmDelete
            toggle={toggle}
            open={open}
            content="xóa đơn hàng"
            onSubmit={deleteProduct}
          />
        )}
        {shouldRenderDetail && (
          <ModalDetailOrder toggle={toggleDetail} open={openDetail} />
        )}
      </section>
    </Helmet>
  );
}

export default Orders;
