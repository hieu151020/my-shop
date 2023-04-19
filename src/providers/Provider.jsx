import { useState } from "react";
import { createContext, useContext } from "react";
import useGetData from "../custom-hooks/useGetData";
import useAuth from "../custom-hooks/useAuth";

const AuthContext = createContext({
  isAdmin: false,
  listProduct: [],
  login: () => {},
  logout: () => {},
});

export const useAuthen = () => useContext(AuthContext);

const KEY_LOGIN = "token";
const MOCK_TOKEN = "abcyz";

const token = window.localStorage.getItem(KEY_LOGIN);

const Authentication = (props) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { currentUser } = useAuth();

  let { data: listProduct, loading } = useGetData("products");

  const login = (username) => {
    // call API -> attach token to header request -> call API get userInfo -> setUser(user)
    if (username === "admin") {
      setIsAdmin(true);
      console.log("isAdmin");
    }
  };

  const logout = () => {
    window.localStorage.removeItem(KEY_LOGIN);
    window.location.reload();
  };

  const values = {
    listProduct,
    isAdmin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={values}>{props.children}</AuthContext.Provider>
  );
};

export default Authentication;
