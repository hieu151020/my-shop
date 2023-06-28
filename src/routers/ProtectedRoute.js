import useAuth from "../custom-hooks/useAuth";
import React from "react";
import {  Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthen } from "../userContext/AuthenticationProvider";
import baseUrl from "../contants/routeBaseUrl";

const ProtectedRoute = (props) => {
  // const { currentUser } = useAuth();
  const { isLogged } = useAuthen();
  const navigate = useNavigate();

  // if (!currentUser) {
    if (!isLogged) {
    //   if(!isAdmin){
      toast.warning("You don't have permission");
    // navigate('/')
  // }
// navigate("/login");
  //   toast.success("You must sign in first");
  // }
  // if (currentUser?.displayName !== "aadmin") {
  // if (isAdmin === true) {
    // navigate("/");
  return <Navigate to={baseUrl.home} />;

  
  // return props.children;
  }
  // return currentUser ? props.children : <Navigate to="/login" />;
  return props.children;
  // return <Navigate to={baseUrl.home} />;
}

export default ProtectedRoute;
