import React from "react";
import "../../styles/product-card.css";
import { motion } from "framer-motion";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";
import { modalActions } from "../../redux/slices/modalSlice";

const ProductsCard = ({
  item,
}) => {
  const dispatch = useDispatch();
  // const getProduct = useSelector((state) => state.modal.getProduct);
  let price = item.price;
  price = +price
  price = Number(Math.floor(price + price * 0.1))

  const addToCard = () => {
    dispatch(
      cartActions.addItem({
        id: item.id,
        productName: item.productName,
        price: price,
        imgUrl: item.imgUrl,
        itemAvailable: item.available,
        stockNumber: item.stockNumber,
      })
    );

    toast.success("Product added successfully");
  };

  return (
        <Col lg="3" md="4">
          <div className="product__item">
            <div className="product__img">
              <motion.img
                whileHover={{ scale: 1.03 }}
                src={item.imgUrl}
                alt=""
              />
            </div>
            <Link to={`/shop/${item.id}`}>
              <div className="p-2 product__info">
                <h3
                  className="product__name"
                  onClick={() => dispatch(modalActions.getProduct(item))}
                >
                  <Link to={`/shop/${item.id}`}>{item.productName}</Link>
                </h3>
                <span>Manufacture: {item.manufacture}</span>
              </div>
            </Link>
            <div className="product__card-bottom d-flex align-items-center justify-content-between p-2">
              <span className="price">
                {price.toLocaleString("vi-VN")}đ
              </span>
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
