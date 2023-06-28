import React from "react";
import ReactDOM from "react-dom/client";
import "remixicon/fonts/remixicon.css";
import "bootstrap/dist/css/bootstrap.css";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthenticationProvider from "./userContext/AuthenticationProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <AuthenticationProvider>
      <BrowserRouter>
        <Provider store={store}>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            closeOnClick
            pauseOnHover={false}
            theme="dark"
          />
          <App />
        </Provider>
      </BrowserRouter>
    </AuthenticationProvider>
  // </React.StrictMode>
);
