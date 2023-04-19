import React from "react";
import { Container, Row, Col } from "reactstrap";
import { db } from "../firebase.config";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import useGetData from "../custom-hooks/useGetData";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { modalActions } from "../redux/slices/modalSlice";
import ModalConfirmDelete from "../components/Modal/ModalConfirmDelete";
import useToggleDialog from "../custom-hooks/useToggleDialog";

function AllProduct(props) {
  const { data: productData, loading } = useGetData("products");
  const dispatch = useDispatch();
  console.log(productData);

  const { open, toggle, shouldRender } = useToggleDialog();

  const showModalDeleteProduct = async (item) => {
    toggle();
    dispatch(modalActions.getProduct(item));
  };

  const deleteProduct = (id) => {
    deleteDoc(doc(db, "products", id));
    toast.success("Delete success!!");
  };

  return (
    <section>
      <Container>
        <Link to="/dashboard/add-products">
          <button className="btn btn-primary mb-5">Thêm sản phẩm mới</button>
        </Link>
        <Row>
          <Col lg="12">
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Tên sản phẩm</th>
                  <th>Loại sản phẩm</th>
                  <th>Giá</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <h4 className="py-5 text-center fw-bold">Loading data....</h4>
                ) : (
                  productData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img src={item.imgUrl} alt="" />
                      </td>
                      <td>{item.productName}</td>
                      <td>{item.category}</td>
                      <td>{item.price}VND</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            showModalDeleteProduct(item);
                          }}
                        >
                          Xóa
                        </button>
                      </td>
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
          content="sản phẩm"
          onSubmit={deleteProduct}
        />
      )}
    </section>
  );
}

export default AllProduct;
