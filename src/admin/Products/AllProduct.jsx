/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import "../../styles/all-products.css";
import { Row, Col } from "reactstrap";
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
import ModalManageManufacture from "./Modal/ModalManageManufacture";
import useGetData from "../../custom-hooks/useGetData";

function AllProduct(props) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [loading, setLoading] = useState(true);
  const [isEdit, setEdit] = useState(false);
  const [isManufacture, setManufacture] = useState(false);
  const { data: categoryData, loadingCategory } = useGetData("listCategory");
  const { data: manufactureData, loadingManufacture } =
    useGetData("listManufacture");

  const dispatch = useDispatch();

  const { open, toggle, shouldRender } = useToggleDialog();
  const {
    open: openManufacture,
    toggle: toggleManufacture,
    shouldRender: shouldRenderManufacture,
  } = useToggleDialog();
  const {
    open: openEdit,
    toggle: toggleEdit,
    shouldRender: shouldRenderEdit,
  } = useToggleDialog();

  const showModalDeleteProduct = async (item) => {
    toggle();
    dispatch(modalActions.getProduct(item));
  };

  const handleManufacture = () => {
    setManufacture(true);
    toggleManufacture();
  };

  const handleCategory = () => {
    setManufacture(false);
    toggleManufacture();
  };

  const handleEditProduct = (item) => {
    setEdit(true);
    toggleEdit();
    dispatch(modalActions.getProduct(item));
  };

  const handleImportProduct = (item) => {
    setEdit(false);
    toggleEdit();
    dispatch(modalActions.getProduct(item));
  };

  const deleteProduct = (id) => {
    deleteDoc(doc(db, "products", id));
    toast.success("Delete success!!");
  };

  useEffect(() => {
    const q = query(collection(db, "products"));

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
    return currentPage === 1 ? (
      <li className="disabled">
        <span>
          <i className="ri-arrow-left-s-line"></i>
        </span>
      </li>
    ) : (
      <li>
        <a
          className="d-flex align-items-center justify-content-center"
          onClick={handlePrevClick}
        >
          <i className="ri-arrow-left-s-line"></i>
        </a>
      </li>
    );
  };

  const renderNextButton = () => {
    return currentPage === totalPages ? (
      <li className="disabled">
        <span>
          <i className="ri-arrow-right-s-line"></i>
        </span>
      </li>
    ) : (
      <li>
        <a
          className="d-flex align-items-center justify-content-center"
          onClick={handleNextClick}
        >
          <i className="ri-arrow-right-s-line"></i>
        </a>
      </li>
    );
  };

  return (
    <section>
      <Row>
        <div className="left-nav">
          <div>
            <h3 className="pb-3 mb-4 mt-3 title__left-nav">
              Danh mục sản phẩm
            </h3>
            {/* <ul className="filter__product__list">
              <li className="mb-2 ">Nam</li>
              <li className="mb-2">Nữ</li>
              <li className="mb-2">Cặp đôi</li>
            </ul> */}
            <ul className="filter__product__list">
              {manufactureData.map((item, index) => (
                <li key={index} className="mb-2">
                  {item.manufactureName}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Col lg="9">
          <Link to="/dashboard/all-products/add-products">
            <button
              className="btn btn-primary mb-5"
              style={{ marginRight: "10px" }}
            >
              Thêm sản phẩm mới
            </button>
          </Link>
          <button
            className="btn btn-primary mb-5 "
            style={{ marginRight: "10px" }}
            onClick={handleManufacture}
          >
            Danh sách hãng sản xuất
          </button>
          <button className="btn btn-primary mb-5" onClick={handleCategory}>
            Danh sách loại sản phẩm
          </button>
          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Loại sản phẩm</th>
                <th>Hãng sản xuất</th>
                <th>Giá</th>
                <th>Số lượng trong kho</th>
                <th>Nhập</th>
                <th>Sửa</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <h4 className="py-5 text-center fw-bold">Loading data....</h4>
              ) : (
                currentItems.map((item, index) => {
                  let price = item.price;
                  price = +price;
                  return (
                    <>
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>
                          <img src={item.imgUrl} alt="" />
                        </td>
                        <td>{item.productName}</td>
                        <td>{item.category}</td>
                        <td>{item.manufacture}</td>
                        <td>{price.toLocaleString("vi-VN")} đ</td>
                        <td>{item.stockNumber}</td>
                        <td
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          title="Nhập hàng"
                        >
                          <button
                            className="btn btn-primary"
                            onClick={() => handleImportProduct(item)}
                          >
                            <i class="ri-download-line"></i>
                          </button>
                        </td>
                        <td
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          title="Sửa"
                        >
                          <button
                            className="btn btn-primary"
                            onClick={() => handleEditProduct(item)}
                          >
                            <i class="ri-edit-line"></i>
                          </button>
                        </td>
                        <td
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          title="Xóa"
                        >
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              showModalDeleteProduct(item);
                            }}
                          >
                            <i class="ri-delete-bin-line"></i>
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
      {shouldRenderManufacture && (
        <ModalManageManufacture
          toggle={toggleManufacture}
          open={openManufacture}
          data={isManufacture ? manufactureData : categoryData}
          loading={isManufacture ? loadingManufacture : loadingCategory}
          isManufacture={isManufacture}
        />
      )}
      {shouldRenderEdit && (
        <ModalEditProduct
          toggle={toggleEdit}
          open={openEdit}
          manufactureData={manufactureData}
          categoryData={categoryData}
          handleEditProduct={handleEditProduct}
          isEdit={isEdit}
        />
      )}
    </section>
  );
}

export default AllProduct;
