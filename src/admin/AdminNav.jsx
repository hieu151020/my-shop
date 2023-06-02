import React from "react";
import { Container, Row } from "reactstrap";
import useAuth from "../custom-hooks/useAuth";
import "../styles/admin-nav.css";
import { Link, NavLink } from "react-router-dom";

const admin__nav = [
  {
    display: "Dashboard",
    path: "/dashboard/main",
  },
  {
    display: "All Products",
    path: "/dashboard/all-products",
  },
  {
    display: "Orders",
    path: "/dashboard/orders",
  },
  {
    display: "Accounts",
    path: "/dashboard/users",
  },
];
function AdminNav(props) {
  const { currentUser } = useAuth();

  return (
    <>
      <header className="admin__header">
        <div className="admin__nav-top">
          <div className="admin__nav-wrapper-top">
            <div className="logo">
              <span>
                <h3>Admin Dashboard</h3>
              </span>
            </div>
            <div className="admin__nav-top-right">
              <span className="noti__admin">
                <i className="ri-notification-3-line"></i>
                <span className="badge__admin">1</span>
              </span>
              <span className="mail__admin">
                <i className="ri-mail-line"></i>
                <span className="badge__admin">1</span>
              </span>
              <Link to={"/"}>
                <span>
                  <i class="ri-home-2-line"></i>
                </span>
              </Link>
              <span style={{ flexDirection: "column" }}>
                <img src={currentUser && currentUser.photoURL} alt="" />
                <span style={{ color: "whitesmoke", marginLeft: "10px" }}>
                  {currentUser.displayName}
                </span>
              </span>
              <button className="btn btn-danger">Đăng xuất</button>
            </div>
          </div>
        </div>
      </header>
      <section className="admin__menu p-0">
        <Container>
          <Row>
            <div className="admin__navigator">
              <ul className="admin__menu-list">
                {admin__nav.map((item, index) => (
                  <li className="admin__menu-item" key={index}>
                    <NavLink to={item.path}>{item.display}</NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default AdminNav;
