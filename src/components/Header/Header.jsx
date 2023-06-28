import React, { useRef, useEffect, useState, useMemo } from "react";
import "./header.css";
import { motion } from "framer-motion";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Tooltip } from "reactstrap";
import { useSelector } from "react-redux";

import logo from "../../assets/images/eco-logo.png";
import userIcon from "../../assets/images/user-icon.png";
import useAuth from "../../custom-hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase.config";
import { toast } from "react-toastify";
import useGetData from "../../custom-hooks/useGetData";
import { useAuthen } from "../../userContext/AuthenticationProvider";

const nav_links = [
  {
    path: "/",
    display: "Trang chủ",
  },
  {
    path: "shop",
    display: "Sản phẩm",
  },
  {
    path: "cart",
    display: "Giỏ hàng",
  },
];
const Header = () => {
  const headerRef = useRef(null);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const profileActionRef = useRef(null);

  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { data: orderData } = useGetData("orders");
  const { logout } = useAuthen();

  const isAdmin =
    currentUser?.displayName === "admin" &&
    currentUser?.email === "admin@gmail.com";

  const stickyHeaderFunc = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef?.current?.classList?.add("sticky__header");
      } else {
        headerRef?.current?.classList?.remove("sticky__header");
      }
    });
  };

  const orderList = useMemo(() => {
    const filteredOrders = [];
    orderData.forEach((item) => {
      if (item.customerEmail === currentUser?.email) {
        filteredOrders.push(item);
      }
    });
    return filteredOrders;
  }, [orderData, currentUser]);

  const handleLogout = async() => {
    await signOut(auth)
      .then(() => {
        // toast.success("You are log out");
        logout();
      })
      .catch((err) => {
        toast.error(err.message);
      });
    profileActionRef.current.classList.toggle("show__profileActions");
  };

  useEffect(() => {
    stickyHeaderFunc();

    return () => window.removeEventListener("scroll", stickyHeaderFunc);
  });

  // ham bam nav responsive
  const menuToggle = () => menuRef.current.classList.toggle("active__menu");

  const navigateToCart = () => {
    navigate("/cart");
  };

  const toggleProfileActions = () =>
    profileActionRef.current.classList.toggle("show__profileActions");

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper">
            <div className="logo">
              <img src={logo} alt="logo" />
              <div>
                {location.pathname === "/" ? (
                  <h1>My Shop</h1>
                ) : (
                  <Link to={"/"}>
                    <h1>My Shop</h1>
                  </Link>
                )}
              </div>
            </div>
            <div className="navigation" ref={menuRef} onClick={menuToggle}>
              <ul className="menu">
                {nav_links.map((item, index) => (
                  <motion.li
                    whileHover={{ scale: 1.2 }}
                    className="nav__item"
                    key={index}
                  >
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "nav__active" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="nav__icons">
              <span className="fav__icon">
                <Link
                  to="/order"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title="Đơn hàng"
                >
                  <i className="ri-truck-line"></i>
                  <span className="badge">
                    {orderList?.length !== 0 && orderList?.length}
                  </span>
                </Link>
              </span>
              <span className="cart__icon" onClick={navigateToCart}>
                <Link to="/cart">
                  <i
                    className="ri-shopping-cart-line"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Giỏ hàng"
                  ></i>
                </Link>
                <span className="badge">{totalQuantity}</span>
              </span>
              <div
                className="profile"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="Tài khoản"
              >
                <motion.img
                  whileTap={{ scale: 1.2 }}
                  src={currentUser ? currentUser.photoURL : userIcon}
                  alt=""
                  onClick={toggleProfileActions}
                />
                <span style={{ marginLeft: "5px" }}>
                  {currentUser?.displayName}
                </span>
                <div
                  className="profile_actions"
                  ref={profileActionRef}
                  // onClick={toggleProfileActions}
                >
                  {currentUser ? (
                    <>
                      {!!isAdmin ? (
                        <div className="d-flex align-items-center justify-content-center flex-column ">
                          <span
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Đăng xuất"
                            onClick={handleLogout}
                          >
                            Đăng xuất
                          </span>
                          <span onClick={toggleProfileActions}>
                            <Link
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Dashboard"
                              to="/dashboard/main"
                            >
                              Dashboard
                            </Link>
                          </span>
                        </div>
                      ) : (
                        <span
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          title="Đăng xuất"
                          onClick={handleLogout}
                        >
                          Đăng xuất
                        </span>
                      )}
                    </>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center flex-column">
                      <span
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title="Đăng kí"
                        onClick={toggleProfileActions}
                      >
                        <Link to="/signup">Đăng kí</Link>
                      </span>
                      <span
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title="Đăng nhập"
                        onClick={toggleProfileActions}
                      >
                        <Link to="/login">Đăng nhập</Link>
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mobile__menu">
                <span onClick={menuToggle}>
                  <i className="ri-menu-line"></i>
                </span>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
