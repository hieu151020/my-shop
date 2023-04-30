import React, { Fragment } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProtectedRoute from "./ProtectedRoute";
import AllProduct from "../admin/AllProduct";
import AddProduct from "../admin/AddProduct";
import Dashboard from "../admin/Dashboard";
import Users from "../admin/Users";
import baseUrl from "../contants/routeBaseUrl";
import Orders from "../admin/Orders";

const Routers = () => {
  const routes = [
    {
      path: baseUrl.home,
      element: Home,
      isPrivate: false,
    },
    {
      path: baseUrl.shop,
      element: Shop,
      isPrivate: false,
    },
    {
      path: baseUrl.cart,
      element: Cart,
      isPrivate: false,
    },
    {
      path: baseUrl.product,
      element: ProductDetails,
      isPrivate: false,
    },
    {
      path: baseUrl.checkout,
      element: Checkout,
      isPrivate: true,
    },
    {
      path: baseUrl.login,
      element: Login,
      isPrivate: false,
    },
    {
      path: baseUrl.signup,
      element: Signup,
      isPrivate: false,
    },
    {
      path: baseUrl.dashboard,
      element: Dashboard,
      isPrivate: true,
    },
    {
      path: baseUrl.allproducts,
      element: AllProduct,
      isPrivate: true,
    },
    {
      path: baseUrl.addproducts,
      element: AddProduct,
      isPrivate: true,
    },
    {
      path: baseUrl.orders,
      element: Orders,
      isPrivate: true,
    },
    {
      path: baseUrl.users,
      element: Users,
      isPrivate: true,
    },
  ];

  return (
    <Routes>
      {routes.map((route) => {
        const Wrapper = route.isPrivate ? ProtectedRoute : Fragment;
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Wrapper>
                <route.element />
              </Wrapper>
            }
          />
        );
      })}
      <Route path="/" element={<Navigate to="home" />} />
    </Routes>
  );
};

export default Routers;
