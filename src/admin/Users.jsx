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

function Users(props) {
  const { data: usersData, loading } = useGetData("users");
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
                  <th>Image</th>
                  <th>Tên người dùng</th>
                  <th>Email</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <h5 className="pt-5 fw-bold">Loading data.....</h5>
                ) : (
                  usersData?.map((user, index) => (
                    <tr key={index}>
                      <td>
                        <img src={user.photoURL} alt="" />
                      </td>
                      <td>{user.displayName}</td>
                      <td>{user.email}</td>
                      <td>
                        <button
                          className="btn btn-danger"
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
          content="user"
          onSubmit={deleteUser}
        />
      )}
    </section>
    </Helmet>
  );
}

export default Users;
