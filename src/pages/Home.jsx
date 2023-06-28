import React from "react";
import "../styles/home.css";

import Helmet from "../components/Helmet/Helmet";
import Services from "../services/Services";
import ProductsList from "../components/UI/ProductsList";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Row, Col } from "reactstrap";

import heroImg from "../assets/images/hero-img.png";
import heroImg2 from "../assets/images/hero-img2.png";
// import counterImg from "../assets/images/counter-timer-img.png";

import { useState } from "react";
import { useEffect } from "react";
import useGetData from "../custom-hooks/useGetData";

import ScrollToTopButton from "../components/UI/ScrollToTopButton";
import Slider from "../services/Slider";

const Home = () => {
  const [casioProducts, setCasioProducts] = useState([]);
  const [citizenProducts, setCitizenProducts] = useState([]);
  const [orientProducts, setOrientProducts] = useState([]);
  const [wirelessProducts, setWirelessProducts] = useState([]);
  const [tissotProducts, setTissotProducts] = useState([]);
  console.log(tissotProducts);
  let { data: products, loading } = useGetData("products");

  const year = new Date().getFullYear();

  useEffect(() => {
    const filterdCasioProducts = products?.filter(
      (item) => item.manufacture === "casio"
    );
    const filterdCitizenProducts = products?.filter(
      (item) => item.manufacture === "citizen"
    );
    const filterdOrientProducts = products?.filter(
      (item) => item.manufacture === "orient"
    );
    const filterdWirelessProducts = products?.filter(
      (item) => item.category === "wireless"
    );
    const filterdTissotProducts = products?.filter(
      (item) => item.manufacture === "tissot"
    );

    setCasioProducts(filterdCasioProducts);
    setCitizenProducts(filterdCitizenProducts);
    setOrientProducts(filterdOrientProducts);
    setWirelessProducts(filterdWirelessProducts);
    setTissotProducts(filterdTissotProducts);
  }, [products]);
  return (
    <Helmet title={"Home"}>
      <section className="hero__section">
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hero__content">
                <p className="hero__subtittle">Trending product in {year}</p>
                <h2>Phong cách vượt thời gian cho mọi khoảnh khắc</h2>
                <p>
                  Chào mừng đến với cửa hàng đồng hồ của chúng tôi! Chúng tôi tự
                  hào cung cấp cho khách hàng những sản phẩm đồng hồ chất lượng
                  và đa dạng về mẫu mã, từ những chiếc đồng hồ cổ điển đến những
                  mẫu đồng hồ thể thao hiện đại. Với chất lượng đảm bảo và giá
                  cả cạnh tranh, chúng tôi tin rằng sẽ có một chiếc đồng hồ phù
                  hợp với nhu cầu và phong cách của bạn. Hãy tìm kiếm và khám
                  phá ngay hôm nay để sở hữu một chiếc đồng hồ đẳng cấp và đặc
                  biệt cho riêng mình!
                </p>
                <motion.button whileTap={{ scale: 1.2 }} className="buy__btn">
                  <Link to="/shop">SHOP NOW</Link>
                </motion.button>
              </div>
            </Col>

            <Col lg="6" md="6">
              <div className="hero__img">
                <img src={heroImg} alt="" className="hero__img1"/>
                <img src={heroImg2} alt="" className="hero__img2" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Services />
      <section className="casio">
        <Container>
          <Row>
            <Col lg="12" className="text-center  mb-5">
              <h2 className="section__title">Casio</h2>
            </Col>

            {loading ? (
              <h5 className="fw-bold">Loading......</h5>
            ) : (
              <ProductsList data={casioProducts.slice(0, 4)} />
            )}
          </Row>
        </Container>
      </section>
      <section className="citizen">
        <Container>
          <Row>
            <Col lg="12" className="text-center  mb-5">
              <h2 className="section__title">Citizen</h2>
            </Col>

            <ProductsList data={citizenProducts.slice(0, 4)} />
          </Row>
        </Container>
      </section>

      {/* <section className="timer__count">
        <Container>
          <Row>
            <Col lg="6" md="12" className="count__down-col">
              <div className="clock__top-content">
                <h4 className="text-white fs-6 mb-2">Limited Offers</h4>
                <h3 className="text-white fs-6 mb-3">Quality Watches</h3>
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
      </section> */}
      <Slider />

      <section className="orient">
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-5">
              <h2 className="section__title">Orient</h2>
            </Col>
            {loading ? (
              <h5 className="fw-bold">Loading......</h5>
            ) : (
              <ProductsList data={orientProducts.slice(0, 4)} />
            )}
            {loading ? (
              <h5 className="fw-bold">Loading......</h5>
            ) : (
              <ProductsList data={wirelessProducts.slice(0, 4)} />
            )}
          </Row>
        </Container>
      </section>

      <section className="tissot">
        <Container>
          <Row>
            <Col lg="12" className="text-center  mb-5">
              <h2 className="section__title">Tissot</h2>
            </Col>
            {loading ? (
              <h5 className="fw-bold">Loading......</h5>
            ) : (
              <ProductsList data={tissotProducts.slice(0, 4)} />
            )}
          </Row>
        </Container>
        <ScrollToTopButton />
      </section>
    </Helmet>
  );
};

export default Home;
