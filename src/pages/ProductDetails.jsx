import React, { useState, useRef, useEffect } from "react";
import "../styles/product-details.css";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { motion } from "framer-motion";
import ProductsList from "../components/UI/ProductsList";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import useGetData from "../custom-hooks/useGetData";

const ProductDetails = () => {
  const [tab, setTab] = useState("desc");
  const reviewUser = useRef("");
  const reviewMsg = useRef("");
  const dispatch = useDispatch();
  const product = useSelector((state) => state.modal.getProduct);

  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const [rating, setRating] = useState(null);
  const { id } = useParams();

  const { data: products } = useGetData("products");

  const {
    imgUrl,
    productName,
    price,
    // avgRating,
    // reviews,
    description,
    shortDesc,
    category,
  } = product;

  const relatedProducts = products.filter((item) => item.category === category);

  const submitHandler = (e) => {
    e.preventDefault();

    const reviewUserName = reviewUser.current.value;
    const reviewUserMsg = reviewMsg.current.value;

    const reviewObj = {
      userName: reviewUserName,
      text: reviewUserMsg,
      rating,
    };

    toast.success("Review Successfully");
  };
  const addToCart = () => {
    dispatch(
      cartActions.addItem({
        id,
        image: imgUrl,
        productName,
        price,
      })
    );

    toast.success("Product add success");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  return (
    <Helmet title={productName}>
      <CommonSection title={productName} />

      <section>
        <Container>
          <Row>
            <Col>
              <span className="btn__back">
                <i className="ri-arrow-drop-left-line"></i>
              </span>
            </Col>
          </Row>
          <Row>
            <Col lg="6" className="product__img">
              <img src={imgUrl} alt="" />
            </Col>
            <Col lg="6">
              <div className="product__details">
                <h2>{productName}</h2>
                <div className="product__rating d-flex align-items-center gap-5 mb-3">
                  <div>
                    <span>
                      <i className="ri-star-s-fill" />
                    </span>
                    <span>
                      <i className="ri-star-s-fill" />
                    </span>
                    <span>
                      <i className="ri-star-s-fill" />
                    </span>
                    <span>
                      <i className="ri-star-s-fill" />
                    </span>
                    <span>
                      <i className="ri-star-half-s-fill" />
                    </span>
                  </div>
                  <p>{/* (<span>{avgRating}</span> rating) */}</p>
                </div>

                <div className="d-flex align-items-center gap-5">
                  <span className="product__price">
                    {Number(price).toLocaleString("vi-VN")}đ
                  </span>
                  <span>Category: {category.toUpperCase()}</span>
                </div>
                <p className="mt-3">{shortDesc}</p>
                {product.available > 0 ? (
                <motion.button
                  whileTap={{ scale: 1.1 }}
                  className="buy__btn"
                  onClick={addToCart}
                >
                  Thêm vào giỏ hàng
                </motion.button>):(
                  <button className="btn btn-danger mt-5" disabled>
                  Hết hàng
                </button>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className="tab__wrapper d-flex align-items-center gap-5">
                <h5
                  className={`${tab === "desc" ? "active__tab" : ""}`}
                  onClick={() => setTab("desc")}
                >
                  Mô tả sản phẩm
                </h5>
                <h5
                  className={`${tab === "rev" ? "active__tab" : ""}`}
                  onClick={() => setTab("rev")}
                >
                  Review
                </h5>
              </div>

              {tab === "desc" ? (
                <div className="tab__content mt-5">
                  {expanded ? (
                    <p>{description}</p>
                  ) : (
                    <p>{description.slice(0, 500)}</p>
                  )}
                    {description.length > 500 &&  (expanded ? <button className="btn__colapse" onClick={toggleExpanded}>Thu gọn</button> : <button className="btn__expand" onClick={toggleExpanded}>Xem thêm</button>)}
                </div>
              ) : (
                <div className="product__review mt-5">
                  <div className="review__wrapper">
                    <ul>
                      {/* {reviews?.map((item, index) => (
                        <li key={index} className="mb-4">
                          <h6>Hieu</h6>
                          <span>{item.rating} (rating)</span>
                          <p>{item.text}</p>
                        </li>
                      ))} */}
                    </ul>

                    <div className="review__form">
                      <h4>Review Product for other</h4>
                      <form action="" onSubmit={submitHandler}>
                        <div className="form__group">
                          <input
                            type="text"
                            placeholder="Enter name"
                            ref={reviewUser}
                            required
                          />
                        </div>
                        <div className="form__group d-flex align-items-center gap-5 rating__group">
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(1)}
                          >
                            1<i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(2)}
                          >
                            2<i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(3)}
                          >
                            3<i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(4)}
                          >
                            4<i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(5)}
                          >
                            5<i className="ri-star-s-fill"></i>
                          </motion.span>
                        </div>

                        <div className="form__group">
                          <textarea
                            ref={reviewMsg}
                            row={4}
                            type="text"
                            placeholder="Review Message..."
                            required
                          />
                        </div>

                        <motion.button
                          whileTap={{ scale: 1.2 }}
                          type="submit"
                          className="buy__btn"
                        >
                          Submit
                        </motion.button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </Col>

            <Col lg="12">
              <h2 className="related__title ">You might also like</h2>
            </Col>

            <ProductsList data={relatedProducts} />
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default ProductDetails;
