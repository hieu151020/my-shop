import { configureStore } from "@reduxjs/toolkit";

import cartSlice from "./slices/cartSlice";
import modalSlice from "./slices/modalSlice";

const store = configureStore({
  reducer: {
    cart: cartSlice,
    modal: modalSlice,
  },
});

export default store;
