import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { Col, Container, FormGroup, Row } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
import { auth, storage, db } from "../firebase.config";

import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import InputField from "../components/Field/InputField";
import useFomatDate from "../custom-hooks/useFomatDate";

const Signup = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const formattedDate = useFomatDate()
  const navigate = useNavigate();

  const signup = async (values) => {
    const { username, email, password } = values;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const storageRef = ref(storage, `images/${Date.now() + username}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        (error) => {
          toast.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (dowloadURL) => {
            await updateProfile(user, {
              displayName: username,
              photoURL: dowloadURL,
            });
            await setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              displayName: username,
              email,
              photoURL: dowloadURL,
              createAt:formattedDate,
            });
          });
        }
      );
      console.log("user", user);
      setLoading(false);
      toast.success("Account created");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      toast.error("Account create fail");

      console.log("error", error);
    }
  };

  const initialValues = {
    username: "",
    email: "",
    password: "",
    imageFormik: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Trường này là bắt buộc"),
    email: Yup.string()
      .email("Vui lòng nhập đúng dạng email")
      .required("Trường này là bắt buộc"),
    password: Yup.string()
      .min(6, "Mật khẩu phải có ít nhất 6 kí tự")
      .required("Trường này là bắt buộc"),
    imageFormik: Yup.string().required("Trường này là bắt buộc"),
  });

  return (
    <Helmet title="Signup">
      <section>
        <Container>
          <Row>
            {loading ? (
              <div className="loading-overlay">
              <div className="loading-spinner" />
            </div>
            ) : (
              <Col lg="6" className="m-auto ">
                <h3 className="fw-bold fs-4 mb-4 text-center">
                  Đăng kí tài khoản
                </h3>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={signup}
                >
                  {(props) => {
                    return (
                      <Form className="auth__form">
                        <FormGroup className="form__group">
                          <Field
                            name="username"
                            component={InputField}
                            label="Tên người dùng"
                            labelStyle="white"
                            placeholder="Nhập tên người dùng"
                            required
                          />
                        </FormGroup>
                        <FormGroup className="form__group">
                          <Field
                            name="email"
                            component={InputField}
                            label="Email"
                            labelStyle="white"
                            placeholder="Nhập email"
                            required
                          />
                        </FormGroup>
                        <FormGroup className="form__group">
                          <Field
                            name="password"
                            component={InputField}
                            type='password'
                            label="Mật khẩu"
                            labelStyle="white"
                            placeholder="Nhập mật khẩu"
                            required
                          />
                        </FormGroup>

                        <FormGroup className="form__group">
                          <Field
                            name="imageFormik"
                            type="file"
                            onChange={(e) => {
                              props.setFieldValue(
                                "imageFormik",
                                e.currentTarget.value
                              );
                              setFile(e.target.files[0]);
                            }}
                            component={InputField}
                            style={{
                              color: "#0a1d37",
                              backgroundColor: "#fff",
                            }}
                            label="Avatar"
                            labelStyle="white"
                            required
                          />
                        </FormGroup>

                        <div className="text-center">
                          <button className="buy__btn auth__btn" type="submit">
                            Đăng kí tài khoản
                          </button>
                          <p>
                            Đã có tài khoản
                            <u>
                              <Link to="/login">Đăng nhập ngay</Link>
                            </u>
                          </p>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Signup;
