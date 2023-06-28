import React from "react";
import { Container, Row } from "reactstrap";
import useAuth from "../custom-hooks/useAuth";
import "../styles/admin-nav.css";
import { Link, NavLink } from "react-router-dom";
import { useAuthen } from "../userContext/AuthenticationProvider";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.config";
import { toast } from "react-toastify";
import userIcon from "../assets/images/user-icon.png";

const admin__nav = [
  {
    display: "Dashboard",
    path: "/dashboard/main",
  },
  {
    display: "Products",
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
  const { logout } = useAuthen();

  const handleLogout = async() => {
    await signOut(auth)
      .then(() => {
        logout();
        // toast.success("You are log out");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };


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
              {/* <span className="noti__admin">
                <i className="ri-notification-3-line"></i>
                <span className="badge__admin">1</span>
              </span>
              <span className="mail__admin">
                <i className="ri-mail-line"></i>
                <span className="badge__admin">1</span>
              </span> */}
              <Link to={"/"}>
                <span
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title="Trang chủ"
                >
                  <i className="ri-home-2-line"></i>
                </span>
              </Link>
              <span style={{ flexDirection: "column" }}>
                <img src={currentUser ? currentUser.photoURL : userIcon} alt="" />
                <span style={{ color: "whitesmoke", marginLeft: "10px" }}>
                  {currentUser?.displayName}
                </span>
              </span>
              <button className="btn btn-danger" onClick={handleLogout}>Đăng xuất</button>
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
