import React from "react";
import { Col, Container, Row } from "reactstrap";
import useGetData from "../custom-hooks/useGetData";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { modalActions } from "../redux/slices/modalSlice";
import useToggleDialog from "../custom-hooks/useToggleDialog";
import ModalConfirmDelete from "../components/Modal/ModalConfirmDelete";
import Helmet from "../components/Helmet/Helmet";
import useSortData from "../custom-hooks/useSortData";

function Users(props) {
  const { data, loading } = useGetData("users");
  const usersData = useSortData(data, "createAt");
  const dispatch = useDispatch();

  const { open, toggle, shouldRender } = useToggleDialog();

  const showModalDeleteProduct = async (item) => {
    toggle();
    dispatch(modalActions.getProduct(item));
  };

  const deleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
    toast.success("Delete user success!!");
  };

  return (
    <Helmet title={"Dashboard"}>
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <h4 className="fw-bold head__title">Users</h4>
            </Col>
            <Col lg="12" className="pt-5">
              <table className="table">
                <thead>
                  <tr>
                    <th>Ngày tạo</th>
                    <th>Image</th>
                    <th>Tên người dùng</th>
                    <th>Email</th>
                    <th>Role người dùng</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <div className="loading-overlay">
                      <div className="loading-spinner" />
                    </div>
                  ) : (
                    usersData?.map((user, index) => (
                      <tr key={index}>
                        <td>{user.createAt}</td>
                        <td>
                          <img src={user.photoURL} alt="" />
                        </td>
                        <td>{user.displayName}</td>
                        <td>{user.email}</td>
                        <td>
                          {user.email.startsWith("admin")
                            ? "ADMIN_ROLE"
                            : "USER_ROLE"}
                        </td>
                        <td>
                          <button
                            className="btn-danger-admin"
                            onClick={() => {
                              showModalDeleteProduct(user);
                            }}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Col>
          </Row>
        </Container>
        {shouldRender && (
          <ModalConfirmDelete
            toggle={toggle}
            open={open}
            content="xóa user"
            onSubmit={deleteUser}
          />
        )}
      </section>
    </Helmet>
  );
}

export default Users;
