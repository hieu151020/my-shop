/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import "../../styles/all-products.css";
import { Row, Col } from "reactstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { db } from "../../firebase.config";
import { doc, deleteDoc } from "firebase/firestore";

import { modalActions } from "../../redux/slices/modalSlice";
import ModalConfirmDelete from "../../components/Modal/ModalConfirmDelete";
import useToggleDialog from "../../custom-hooks/useToggleDialog";
import ModalEditProduct from "./Modal/ModalEditProduct";
import ModalManageManufacture from "./Modal/ModalManageManufacture";
import useGetData from "../../custom-hooks/useGetData";
import ProductTable from "./Component/ProductTable";
import { NextButton, PageNumbers, PrevButton } from "../../helper/paging";

function AllProduct(props) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // const [loading, setLoading] = useState(true);
  const [isEdit, setEdit] = useState(false);
  const [isManufacture, setManufacture] = useState(false);
  const { data: products, loading } = useGetData("products");
  const { data: categoryData, loadingCategory } = useGetData("listCategory");
  const { data: manufactureData, loadingManufacture } =
    useGetData("listManufacture");

  const [selectedItem, setSelectedItem] = useState(null);

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
    // const q = query(collection(db, "products"));

    // const getData = onSnapshot(q, (snapshot) => {
    //   const newData = snapshot.docs.map((doc) => ({
    //     ...doc.data(),
    //     id: doc.id,
    //   }));
    setData(products);
    // setLoading(false);
    // });

    // return () => getData();
  }, [products]);

  const handlePageClick = (event) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setCurrentPage(Number(event.target.id));
  };

  const handlePrevClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setCurrentPage(currentPage - 1);
  };

  const handleNextClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setCurrentPage(currentPage + 1);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleFilter = (e) => {
    const filterValue = e.target.getAttribute("value");
    setSelectedItem(filterValue);
    if (filterValue === "all") {
      const filteredProducts = products;
      setData(filteredProducts);
    } else {
      const dataItem = manufactureData?.find(
        (item) => item.manufactureValue === filterValue
      );
      const filteredProducts = products?.filter(
        (product) => product.manufacture === dataItem.manufactureValue
      );
      setData(filteredProducts);
      setCurrentPage(1);
    }
  };

  return (
    <section style={{padding:'0'}}>
      {loading ? (
        <div className="loading-overlay">
          <div className="loading-spinner" />
        </div>
      ) : (
        <Row>
          <div className="left-nav">
            <div>
              <h3 className="pb-3 mb-4 mt-3 title__left-nav">
                Quản lí sản phẩm
              </h3>
              <ul className="filter__product__list">
                <li
                  value="all"
                  className={`mb-2 ${selectedItem === null ? "active" : ""}`}
                  onClick={handleFilter}
                >
                  All
                </li>
                {manufactureData.map((item, index) => (
                  <li
                    key={index}
                    className={`mb-2 ${
                      selectedItem === item.manufactureValue ? "active" : ""
                    }`}
                    value={item.manufactureValue}
                    onClick={handleFilter}
                  >
                    {item.manufactureName}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Col lg="10" className="mt-3">
            <Link to="/dashboard/all-products/add-products">
              <button
                className=" mb-5 btn-primary-admin"
                style={{ marginRight: "10px" }}
              >
                Thêm mới
              </button>
            </Link>
            <button
              className=" mb-5 btn-primary-admin"
              style={{ marginRight: "10px" }}
              onClick={handleManufacture}
            >
              Hãng sản xuất
            </button>
            <button
              className=" mb-5 btn-primary-admin"
              onClick={handleCategory}
            >
              Loại sản phẩm
            </button>
            {data.length === 0 ? (
              <Col lg="6">
                <h1 className="text-center">Không có sản phẩm nào phù hợp!!</h1>
              </Col>
            ) : (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Ngày tạo</th>
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
                    <ProductTable
                      data={data}
                      handleImportProduct={handleImportProduct}
                      handleEditProduct={handleEditProduct}
                      showModalDeleteProduct={showModalDeleteProduct}
                      currentPage={currentPage}
                      itemsPerPage={itemsPerPage}
                    />
                  </tbody>
                </table>
                <div>
                  <ul
                    id="page-numbers"
                    className="d-flex align-items-center justify-content-center mt-5 page__numbers"
                  >
                    <PrevButton
                      currentPage={currentPage}
                      handlePrevClick={handlePrevClick}
                    />
                    <PageNumbers
                      totalPages={totalPages}
                      currentPage={currentPage}
                      handlePageClick={handlePageClick}
                    />
                    <NextButton
                      currentPage={currentPage}
                      totalPages={totalPages}
                      handleNextClick={handleNextClick}
                    />
                  </ul>
                </div>
              </>
            )}
          </Col>
        </Row>
      )}
      {shouldRender && (
        <ModalConfirmDelete
          toggle={toggle}
          open={open}
          content="xóa sản phẩm"
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
