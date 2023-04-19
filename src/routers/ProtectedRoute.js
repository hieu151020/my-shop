import { useSelector } from "react-redux";
import useAuth from "../custom-hooks/useAuth";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ProtectedRoute(props) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate("/login");
    toast.success("You must sign in first");
  }
  // if (currentUser?.displayName === "admin") {
  // if (isAdmin === true) {
  //   navigate("/");
  // toast.warning("You dont have permission");
  // return props.children;
  // }
  // return currentUser ? props.children : <Navigate to="/login" />;
  return props.children;
  // return <Navigate to="/" />;
}

export default ProtectedRoute;
