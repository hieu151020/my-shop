/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import "../../styles/all-products.css";
import {  Row, Col } from "reactstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { db } from "../../firebase.config";
import {
  doc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";

import { modalActions } from "../../redux/slices/modalSlice";
import ModalConfirmDelete from "../../components/Modal/ModalConfirmDelete";
import useToggleDialog from "../../custom-hooks/useToggleDialog";
import ModalEditProduct from "./Modal/ModalEditProduct";

function AllProduct(props) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { open, toggle, shouldRender } = useToggleDialog();
  const {
    open: openEdit,
    toggle: toggleEdit,
    shouldRender: shouldRenderEdit,
  } = useToggleDialog();

  const showModalDeleteProduct = async (item) => {
    toggle();
    dispatch(modalActions.getProduct(item));
  };

  const handleEditProduct = (item) => {
    toggleEdit();
    dispatch(modalActions.getProduct(item));
  };

  const deleteProduct = (id) => {
    deleteDoc(doc(db, "products", id));
    toast.success("Delete success!!");
  };

  useEffect(() => {
    const q = query(collection(db, "products"));
    // const queryData = query(
    //   collectionRef,
    //   orderBy('price'),
    //   limit(5),
    //   startAfter((currentPage - 1) * 5),
    // );

    const getData = onSnapshot(q, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setData(newData);
      setLoading(false);
    });

    return () => getData();
  }, [currentPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const handlePrevClick = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextClick = () => {
    setCurrentPage(currentPage + 1);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li key={i} className={i === currentPage ? "active" : ""}>
          <a onClick={handlePageClick} id={i}>
            {i}
          </a>
        </li>
      );
    }
    return pageNumbers;
  };

  const renderPrevButton = () => {
    return(
      currentPage === 1 ? (
        <li className="disabled">
          <span>
            <i class="ri-arrow-left-s-line"></i>
          </span>
        </li>
      ) : (
        <li>
          <a className="d-flex align-items-center justify-content-center" onClick={handlePrevClick}>
            <i class="ri-arrow-left-s-line"></i>
          </a>
        </li>
      )
    )
  };

  const renderNextButton = () => {
    return(
      currentPage === totalPages ? (
        <li className="disabled">
          <span>
            <i class="ri-arrow-right-s-line"></i>
          </span>
        </li>
      ) : (
        <li>
          <a className="d-flex align-items-center justify-content-center" onClick={handleNextClick}>
            <i class="ri-arrow-right-s-line"></i>
          </a>
        </li>
      )
    )
  };

  return (
    <section>
      <Row>
        <div className="left-nav">
          <div>
            <h3 className="pb-3 mb-4 mt-3 title__left-nav">
              Danh mục sản phẩm
            </h3>
            <ul className="filter__product__list">
              <li className="mb-2 ">Nam</li>
              <li className="mb-2">Nữ</li>
              <li className="mb-2">Cặp đôi</li>
            </ul>
          </div>
        </div>
        <Col lg="9">
          <Link to="/dashboard/all-products/add-products">
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
                currentItems.map((item) => {
                  let price = item.price;
                  price = +price;
                  return (
                    <>
                      <tr key={item.id}>
                        <td>
                          <img src={item.imgUrl} alt="" />
                        </td>
                        <td>{item.productName}</td>
                        <td>{item.category}</td>
                        <td>{item.manufacture}</td>
                        <td>{price.toLocaleString("vi-VN")} đ</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleEditProduct(item)}
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
                    </>
                  );
                })
              )}
            </tbody>
          </table>
          <div>
            <ul
              id="page-numbers"
              className="d-flex align-items-center justify-content-center mt-5 page__numbers"
            >
              {renderPrevButton()}
              {renderPageNumbers()}
              {renderNextButton()}
            </ul>
          </div>
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
      {shouldRenderEdit && (
                        <ModalEditProduct
                          toggle={toggleEdit}
                          open={openEdit}
                          handleEditProduct={handleEditProduct}
                          // content="sản phẩm"
                          // onSubmit={deleteProduct}
                        />
                      )}
    </section>
  );
}

export default AllProduct;
