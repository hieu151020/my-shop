import React from "react";
import "../styles/home.css";

import Helmet from "../components/Helmet/Helmet";
import Services from "../services/Services";
import ProductsList from "../components/UI/ProductsList";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Row, Col } from "reactstrap";

import heroImg from "../assets/images/hero-img.png";
import counterImg from "../assets/images/counter-timer-img.png";

import { useState } from "react";
import { useEffect } from "react";
import Clock from "../components/UI/Clock";
import useGetData from "../custom-hooks/useGetData";

import { useAuthen } from "../providers/Provider";
import ScrollToTopButton from "../components/UI/ScrollToTopButton";

const Home = () => {
  const [trendingProducts, settrendingProducts] = useState([]);
  const [bestSalesProducts, setBestSalesProducts] = useState([]);
  const [mobileProducts, setMobileProducts] = useState([]);
  const [wirelessProducts, setWirelessProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  let { data: products, loading } = useGetData("products");

  const year = new Date().getFullYear();

  useEffect(() => {
    const filterdTrendingProducts = products?.filter(
      (item) => item.category === "chair"
    );
    const filterdBestSalesProducts = products?.filter(
      (item) => item.category === "sofa"
    );
    const filterdMobileProducts = products?.filter(
      (item) => item.category === "mobile"
    );
    const filterdWirelessProducts = products?.filter(
      (item) => item.category === "wireless"
    );
    const filterdPopularProducts = products?.filter(
      (item) => item.category === "watch"
    );

    settrendingProducts(filterdTrendingProducts);
    setBestSalesProducts(filterdBestSalesProducts);
    setMobileProducts(filterdMobileProducts);
    setWirelessProducts(filterdWirelessProducts);
    setPopularProducts(filterdPopularProducts);
  }, [products]);
  return (
    <Helmet title={"Home"}>
      <section className="hero__section">
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hero__content">
                <p className="hero__subtittle">Trending product in {year}</p>
                <h2>Make your Interior More Minimalistic & Modern</h2>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste
                  optio ratione repudiandae perferendis animi aliquid natus
                  magni alias voluptas vitae quisquam, incidunt corrupti in
                  provident veniam adipisci quod distinctio consequuntur!
                </p>
                <motion.button whileTap={{ scale: 1.2 }} className="buy__btn">
                  <Link to="/shop">SHOP NOW</Link>
                </motion.button>
              </div>
            </Col>

            <Col lg="6" md="6">
              <div className="hero__img">
                <img src={heroImg} alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Services />
      <section className="trending__products">
        <Container>
          <Row>
            <Col lg="12" className="text-center  mb-5">
              <h2 className="section__title">Trending Products</h2>
            </Col>

            {loading ? (
              <h5 className="fw-bold">Loading......</h5>
            ) : (
              <ProductsList data={trendingProducts} />
            )}
          </Row>
        </Container>
      </section>
      <section className="best__sales">
        <Container>
          <Row>
            <Col lg="12" className="text-center  mb-5">
              <h2 className="section__title">Best Sales</h2>
            </Col>

            <ProductsList data={bestSalesProducts} />
          </Row>
        </Container>
      </section>

      <section className="timer__count">
        <Container>
          <Row>
            <Col lg="6" md="12" className="count__down-col">
              <div className="clock__top-content">
                <h4 className="text-white fs-6 mb-2">Limited Offers</h4>
                <h3 className="text-white fs-6 mb-3">Quality Armchair</h3>
              </div>
              <Clock />

              <motion.button whileTap={{ scale: 1.2 }} className=" auth__btn">
                <Link to="/shop">Visit Store</Link>
              </motion.button>
            </Col>
            <Col lg="6" md="12" className="text-end counter__img">
              <img src={counterImg} alt="" />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="new__arrivals">
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-5">
              <h2 className="section__title">New Arrivals</h2>
            </Col>
            {loading ? (
              <h5 className="fw-bold">Loading......</h5>
            ) : (
              <ProductsList data={mobileProducts} />
            )}
            {loading ? (
              <h5 className="fw-bold">Loading......</h5>
            ) : (
              <ProductsList data={wirelessProducts} />
            )}
          </Row>
        </Container>
      </section>

      <section className="popular__category">
        <Container>
          <Row>
            <Col lg="12" className="text-center  mb-5">
              <h2 className="section__title">Popular</h2>
            </Col>
            {loading ? (
              <h5 className="fw-bold">Loading......</h5>
            ) : (
              <ProductsList data={popularProducts} />
            )}
          </Row>
        </Container>
        <ScrollToTopButton/>
      </section>
    </Helmet>
  );
};

export default Home;
