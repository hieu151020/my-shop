import React from "react";
import { Container, Row, Col } from "reactstrap";
import useGetData from "../../custom-hooks/useGetData";
import useToggleDialog from "../../custom-hooks/useToggleDialog";
import Helmet from "../../components/Helmet/Helmet";
import ModalConfirmDelete from "../../components/Modal/ModalConfirmDelete";
import { collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../redux/slices/modalSlice";

function Orders(props) {
  const { data: orderData, loading } = useGetData("orders");
  const { open, toggle, shouldRender } = useToggleDialog();
  const getProductDelete = useSelector((state) => state.modal.getProduct);

  const dispatch = useDispatch();

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
          updateDoc(docRef, {
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

  const handleConfirm = async (item) => {
    try {
      const collectionRef = collection(db, "orders");
      const docRef = doc(collectionRef, item.id);
      await updateDoc(docRef, {
        isConfirm: !item.isConfirm,
      });
      if (item.isConfirm) {
        toast.success("Order unconfirm");
      } else {
        toast.success("Order confirm");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelevery = async (item) => {
    try {
      const collectionRef = collection(db, "orders");
      const docRef = doc(collectionRef, item.id);

      await updateDoc(docRef, {
        isDelevery: !item.isDelevery,
      });
      await item.item.forEach(async (pro) => {
        const collectionRef = collection(db, "products");
        const docRef = doc(collectionRef, pro.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const docData = docSnap.data();
          updateDoc(docRef, {
            stockNumber: docData.stockNumber - pro.quantity,
         });
        }
        // const collectionProductRef = collection(db, "products");
        // const docProductRef = doc(collectionProductRef, pro.id);
        // await updateDoc(docProductRef, {
        //   stockNumber: pro.stockNumber - pro.quantity,
        // });
      });
      toast.success("Order delevery");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Helmet title={"Dashboard"}>
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <h4 className="fw-bold mb-5 head__title">Quản lí đơn hàng</h4>
            </Col>
            <Col lg="12">
              <table className="table">
                <thead>
                  <tr>
                    <th>Ngày tạo</th>
                    <th>Email đặt hàng</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Thành tiền</th>
                    <th>Địa chỉ giao hàng</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <h4 className="py-5 text-center fw-bold">
                      Loading data....
                    </h4>
                  ) : (
                    orderData.map((item) => (
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
                        <td>
                          {item.item.map((i) => (
                            <div>
                              {Number(i.price).toLocaleString("vi-VN")}đ
                            </div>
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
                            className="btn btn-primary"
                            onClick={() => {}}
                          >
                            <i class="ri-eye-fill"></i>
                          </button>
                        </td>
                        {item?.isConfirm === false ? (
                          <td
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Xác nhận đơn"
                          >
                            <button
                              className="btn btn-primary"
                              onClick={() => handleConfirm(item)}
                              disabled={item.isDelevery}
                            >
                              <i class="ri-check-double-line"></i>
                            </button>
                          </td>
                        ) : (
                          <td
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Hủy xác nhận"
                          >
                            <button
                              className="btn btn-primary"
                              disabled={item.isDelevery}
                              onClick={() => handleConfirm(item)}
                            >
                              <i class="ri-arrow-go-back-line"></i>
                            </button>
                          </td>
                        )}
                        {item?.isDelevery === false ? (
                          <td
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Giao hàng"
                          >
                            <button
                              className="btn btn-primary"
                              disabled={!item.isConfirm}
                              onClick={() => handleDelevery(item)}
                            >
                              <i class="ri-file-transfer-fill"></i>
                            </button>
                          </td>
                        ) : (
                          <td
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Đang giao"
                          >
                            <button className="btn btn-primary" disabled>
                              <i class="ri-truck-fill"></i>
                            </button>
                          </td>
                        )}

                        {item.isCancle === false ? (
                          <td
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Hủy"
                          >
                            <button
                              className="btn btn-danger"
                              disabled={item.isDelevery}
                              onClick={() => {
                                showModalDeleteProduct(item);
                              }}
                            >
                              <i class="ri-delete-bin-line"></i>
                            </button>
                          </td>
                        ) : (
                          <td
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Xác nhận hủy"
                          >
                            <button
                              className="btn btn-danger"
                              onClick={() => {
                                showModalDeleteProduct(item);
                              }}
                            >
                              <i class="ri-delete-bin-3-line"></i>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
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
            content="đơn hàng"
            onSubmit={deleteProduct}
          />
        )}
      </section>
    </Helmet>
  );
}

export default Orders;
