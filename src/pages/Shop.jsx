/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import "../styles/shop.css";

import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";

import { useState } from "react";
import ProductsList from "../components/UI/ProductsList";
import useGetData from "../custom-hooks/useGetData";

const Shop = () => {
  const { data: products, loading } = useGetData("products");
  const { data: manufactureData } = useGetData("listManufacture");
  const [productData, setProductsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setProductsData(products);
  }, [products]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageClick = (event) => {
    setCurrentPage(Number(event.target.id));
    // setProductsData(productData.slice((currentPage - 1) * 7, currentPage * 7))
  };

  const handlePrevClick = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextClick = () => {
    setCurrentPage(currentPage + 1);
  };

  const totalPages = Math.ceil(productData?.length / itemsPerPage);

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
  // ham phan loai sp
  const handleFilter = (e) => {
    const filterValue = e.target.value;
    if (filterValue === "all") {
      const filteredProducts = products;
      setProductsData(filteredProducts);
    } else {
      const dataItem = manufactureData.find(
        (item) => item.manufactureValue === filterValue
      );
      const filteredProducts = products.filter(
        (product) => product.manufacture === dataItem.manufactureValue
      );
      setProductsData(filteredProducts);
    }
  };

  const handleSort=()=>{
    
  }

  const handleSearch = () => {
    if (searchValue === "") {
      const filteredProducts = products;
      setProductsData(filteredProducts);
    } else {
      const searchedProducts = products.filter((item) =>
        item.productName.toLowerCase().includes(searchValue?.trim().toLowerCase())
      );
      setProductsData(
        searchedProducts
      );
    }
  };

  return (
    <Helmet title="Shop">
      <CommonSection title="Products" />

      <section>
        <Container>
          <Row>
            <Col lg="3" md="6">
              <div className="filter__widget">
                <select onChange={handleFilter}>
                  <option value="all">Tất cả</option>
                  {manufactureData.map((item, index) => {
                    return (
                      <option key={index} value={item.manufactureValue}>
                        {item.manufactureName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </Col>
            <Col lg="2" md="6" className="text-end">
              <div className="filter__widget">
                <select onChange={handleSort}>
                  <option>Khoảng giá</option>
                  <option value="0-2000000">0đ - 2.000.000đ</option>
                  <option value="2000-6000">2.000.000đ - 6.000.000đ</option>
                  <option value="6000-10000">6.000.000đ - 10.000.000đ</option>
                  <option value="10000-20000">10.000.000đ - 20.000.000đ</option>
                  <option value="20000-40000">20.000.000đ - 40.000.000đ</option>
                </select>
              </div>
            </Col>
            <Col lg="4" md="12" className="search__box__col">
              <div className="search__box">
                <input
                  type="text"
                  placeholder="Search......."
                  onChange={(e) =>
                    setTimeout(() => setSearchValue(e.target.value), 1000)
                  }
                />
                <span>
                  <i className="ri-search-line" onClick={handleSearch}></i>
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="pt-0">
        <Container>
          {loading ? (
            // <h5>Loading...</h5>
            <div className="loading-overlay">
              <div className="loading-spinner" />
            </div>
          ) : (
            <Row>
              {productData.length === 0 ? (
                <h1 className="text-center">No product are found!!</h1>
              ) : (
                <>
                  <ProductsList
                    data={productData !== products ? productData : currentItems}
                  />
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
                </>
              )}
            </Row>
          )}
        </Container>
      </section>
    </Helmet>
  );
};

export default Shop;
