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
                  <Link to={"/"}>
                    <h3>Admin Dashboard</h3>
                  </Link>
                </span>
              </div>
              <div className="search__box">
                <input type="text" placeholder="Search....." />
                <span>
                  <i className="ri-search-line"></i>
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
                <img src={currentUser && currentUser.photoURL} alt="" />
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
                    <NavLink to={item.path} >
                      {item.display}
                    </NavLink>
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
