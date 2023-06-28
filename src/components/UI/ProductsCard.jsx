import React from "react";
import "../../styles/product-card.css";
import { motion } from "framer-motion";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";
import { modalActions } from "../../redux/slices/modalSlice";

const ProductsCard = ({ item }) => {
  const dispatch = useDispatch();
  // const getProduct = useSelector((state) => state.modal.getProduct);
  let price = item.price;
  price = +price;

  const addToCard = () => {
    dispatch(
      cartActions.addItem({
        id: item.id,
        productName: item.productName,
        price: price,
        imgUrl: item.imgUrl,
        itemAvailable: item.available,
        // stockNumber: item.stockNumber,
      })
    );

    toast.success("Add product successful");
  };

  return (
    <Col lg="3" md="4">
      <div
        className="product__item"
        onClick={() => dispatch(modalActions.getProduct(item))}
      >
        <Link to={`/shop/${item.id}`}>
          <div className="product__img">
            <motion.img whileHover={{ scale: 1.03 }} src={item.imgUrl} alt="" />
          </div>
          <div className="p-2 product__info">
            <div className="product__name">{item.productName}</div>
            <div>
              <span>Thương hiệu: {item.manufacture.toUpperCase()}</span>
            </div>
            <div>
              <span>Giới tính: {item.category.toUpperCase()}</span>
            </div>
          </div>
        </Link>
        <div className="product__card-bottom d-flex align-items-center justify-content-between p-2">
          <span className="price">{price.toLocaleString("vi-VN")}đ</span>
          {item.available > 0 ? (
            <motion.span
              className="add__btn"
              whileTap={{ scale: 1.2 }}
              onClick={addToCard}
            >
              <i className="ri-add-line "></i>
              {/* <button className="buy__btn">Add to card</button> */}
            </motion.span>
          ) : (
            <div
              style={{
                paddingRight: "5px",
                color: "red",
                cursor: "default",
              }}
            >
              Hết hàng
            </div>
          )}
        </div>
      </div>
    </Col>
  );
};

export default ProductsCard;
