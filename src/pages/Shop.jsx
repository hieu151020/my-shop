/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import "../styles/shop.css";

import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";

import { useState } from "react";
import ProductsList from "../components/UI/ProductsList";
import useGetData from "../custom-hooks/useGetData";
import { NextButton, PageNumbers, PrevButton } from "../helper/paging";

const priceRange = [
  {
    name: "0đ - 2.000.000đ",
    value: "0-2000",
  },
  {
    name: "2.000.000đ - 6.000.000đ",
    value: "2000-6000",
  },
  {
    name: "6.000.000đ - 10.000.000đ",
    value: "6000-10000",
  },
  {
    name: "10.000.000đ - 20.000.000đ",
    value: "10000-20000",
  },
  {
    name: "Trên 20.000.000đ",
    value: ">20000",
  },
];

const listStrap = [
  {
    strapName: 'Dây da',
    strapValue: 'dayda'
  },
  {
    strapName: 'Dây mềm',
    strapValue: 'daymem'
  },
  {
    strapName: 'Dây kim loại',
    strapValue: 'daykimloai'
  },
  {
    strapName: 'Dây nhựa',
    strapValue: 'daynhua'
  },
  {
    strapName: 'Dây Titanium',
    strapValue: 'daytitanium'
  },
]

const Shop = () => {
  const { data: products, loading } = useGetData("products");
  const { data: manufactureData } = useGetData("listManufacture");
  const [productData, setProductsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [searchValue, setSearchValue] = useState("");
  
  useEffect(() => {
    setProductsData(products);
  }, [products]);
  
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = productData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageClick = (event) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    setCurrentPage(Number(event.target.id));
  };

  const handlePrevClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    setCurrentPage(currentPage - 1);
  };

  const handleNextClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    setCurrentPage(currentPage + 1);
  };

  const totalPages = Math.ceil(productData?.length / itemsPerPage);

  // ham phan loai sp
  const handleFilter = (e) => {
    const filterValue = e.target.value;
    if (filterValue === "all") {
      const filteredProducts = products;
      setProductsData(filteredProducts);
    } 
    else {
      const dataItem = manufactureData.find(
        (item) => item.manufactureValue === filterValue
      );
      const filteredProducts = products.filter(
        (product) => product.manufacture === dataItem.manufactureValue
      );
      setProductsData(filteredProducts);
      setCurrentPage(1);
    }
    // if(filterValue === "dayda"){
    //   const filteredProducts = products.filter((item)=>item.strapType === "dayda")
    //   setProductsData(filteredProducts)
    // }
    // if(filterValue === "daymem"){
    //   const filteredProducts = products.filter((item)=>item.strapType === "daymem")
    //   setProductsData(filteredProducts)
    // }
  };

  const handleSort = (e) => {
    const sortValue = e.target.value;
    switch (sortValue) {
      case "all":
        setProductsData(products);
        break;
      case "0-2000":
        setProductsData(
          products.filter(
            (item) => Number(item.price) >= 0 && Number(item.price) <= 2000000
          )
        );
        setCurrentPage(1);
        break;
      case "2000-6000":
        setProductsData(
          products.filter(
            (item) =>
              Number(item.price) > 2000000 && Number(item.price) <= 6000000
          )
        );
        setCurrentPage(1);
        break;
      case "6000-10000":
        setProductsData(
          products.filter(
            (item) =>
              Number(item.price) > 6000000 && Number(item.price) <= 10000000
          )
        );
        setCurrentPage(1);
        break;
      case "10000-20000":
        setProductsData(
          products.filter(
            (item) =>
              Number(item.price) > 10000000 && Number(item.price) <= 20000000
          )
        );
        setCurrentPage(1);
        break;
      case ">20000":
        setProductsData(
          products.filter((item) => Number(item.price) > 20000000)
        );
        setCurrentPage(1);
        break;

      default:
        break;
    }
  };

  const handleSearch = () => {
    if (searchValue === "") {
      const filteredProducts = products;
      setProductsData(filteredProducts);
    } else {
      const searchedProducts = products.filter((item) =>
        item.productName
          .toLowerCase()
          .includes(searchValue?.trim().toLowerCase())
      );
      setProductsData(searchedProducts);
    }
  };

  return (
    <Helmet title="Shop">
      <CommonSection title="Sản phẩm" />

      <section>
        <Container>
          <Row>
            <Col lg="3" md="6">
              <div className="filter__widget">
                <select onChange={handleFilter}>
                  <option value="all">Chọn hãng sản xuất</option>
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
            {/* <Col lg="3" md="6">
              <div className="filter__widget">
                <select onChange={handleFilter}>
                  <option value="all">Chọn loại dây</option>
                  {listStrap.map((item, index) => {
                    return (
                      <option key={index} value={item.strapValue}>
                        {item.strapName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </Col> */}
            <Col lg="2" md="6" className="text-end">
              <div className="filter__widget">
                <select onChange={handleSort}>
                  <option value='all'>Chọn khoảng giá</option>
                  {priceRange.map((item, index) => (
                    <option key={index} value={item.value}>{item.name}</option>
                  ))}
                </select>
              </div>
            </Col>
            <Col lg="4" md="12" className="search__box__col">
              <div className="search__box">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên sản phẩm"
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
            <div className="loading-overlay">
              <div className="loading-spinner" />
            </div>
          ) : (
            <Row>
              {productData.length === 0 ? (
                <h1 className="text-center">Không có sản phẩm nào phù hợp!!</h1>
              ) : (
                <>
                  <ProductsList
                    data={productData }
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                  />
                  <div>
                    <ul
                      id="page-numbers"
                      className="d-flex align-items-center justify-content-center mt-5 page__numbers"
                    >
                       <PrevButton currentPage={currentPage} handlePrevClick={handlePrevClick}/>
                  <PageNumbers totalPages={totalPages} currentPage={currentPage} handlePageClick={handlePageClick}/>
                  <NextButton currentPage={currentPage} totalPages={totalPages} handleNextClick={handleNextClick}/>
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
