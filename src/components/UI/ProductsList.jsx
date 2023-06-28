import React from "react";
import ProductsCard from "./ProductsCard";

const ProductsList = ({ data, currentPage, itemsPerPage }) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);
  return currentPage ? (
    <>
      {currentItems?.map((item, index) => (
        <ProductsCard item={item} key={index} />
      ))}
    </>
  ) : (
    <>
      {data?.map((item, index) => (
        <ProductsCard item={item} key={index} />
      ))}
    </>
  );
};

export default ProductsList;
