import React, { useMemo } from "react";
import '../styles/all-products.css'
import { Container, Row, Col } from "reactstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { db } from "../firebase.config";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

import useGetData from "../custom-hooks/useGetData";
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
        <Row>
          <div className="left-nav">

            <div >
              <h3 className="pb-3 mb-4 mt-3 title__left-nav">Danh mục sản phẩm</h3>
              <ul className="filter__product__list">
                <li className="mb-2 ">Nam</li>
                <li className="mb-2">Nữ</li>
                <li className="mb-2">Cặp đôi</li>
              </ul>

            </div>
          </div>
          <Col lg="9">
          <Link to="/dashboard/add-products">
          <button className="btn btn-primary mb-5">Thêm sản phẩm mới</button>
        </Link>
            <table className="table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Loại sản phẩm</th>
                  <th>Hãng sản xuất</th>
                  <th>Giá</th>
                  <th>Sửa</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <h4 className="py-5 text-center fw-bold">Loading data....</h4>
                ) : (
                  productData.map((item) => {
                    let price = item.price
                    price = +price
                    return (
                      <tr key={item.id}>
                        <td>
                          <img src={item.imgUrl} alt="" />
                        </td>
                        <td>{item.productName}</td>
                        <td>{item.category}</td>
                        <td>{item.manufacture}</td>
                        <td>{price.toLocaleString('vi-VN')} đ</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                             
                            }}
                          >
                            Sửa
                          </button>
                        </td>
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
                    )
                  })
                )}
              </tbody>
            </table>
          </Col>
        </Row>
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
