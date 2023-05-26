import React, { useRef, useEffect } from "react";
import "./header.css";
import { motion } from "framer-motion";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Container, Row } from "reactstrap";
import { useSelector } from "react-redux";

import logo from "../../assets/images/eco-logo.png";
import userIcon from "../../assets/images/user-icon.png";
import useAuth from "../../custom-hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase.config";
import { toast } from "react-toastify";

const nav_links = [
  {
    path: "home",
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

  const isAdmin = currentUser?.displayName === "admin";

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

  const logout = () => {
    signOut(auth)
      .then(() => {
        toast.success("You are log out");
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
                {location.pathname === "/home" ? (
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
                <i className="ri-heart-line"></i>
                <span className="badge">1</span>
              </span>
              <span className="cart__icon" onClick={navigateToCart}>
                <Link to="/cart">
                  <i className="ri-shopping-bag-line"></i>
                </Link>
                <span className="badge">{totalQuantity}</span>
              </span>
              <div className="profile">
                <motion.img
                  whileTap={{ scale: 1.2 }}
                  src={currentUser ? currentUser.photoURL : userIcon}
                  alt=""
                  onClick={toggleProfileActions}
                />
                <div
                  className="profile_actions"
                  ref={profileActionRef}
                  // onClick={toggleProfileActions}
                >
                  {currentUser ? (
                    <>
                      {!!isAdmin ? (
                        <div className="d-flex align-items-center justify-content-center flex-column">
                          <span onClick={logout}>Đăng xuất</span>
                          <Link to="/dashboard/main">
                            <span onClick={toggleProfileActions}>
                              Dashboard
                            </span>
                          </Link>
                        </div>
                      ) : (
                        <span onClick={logout}>Đăng xuất</span>
                      )}
                    </>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center flex-column">
                      <Link to="/signup">
                        <span onClick={toggleProfileActions}>Đăng kí</span>
                      </Link>
                      <Link to="/login">
                        <span onClick={toggleProfileActions}>Đăng nhập</span>
                      </Link>
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
