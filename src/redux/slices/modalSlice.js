import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showModalDelete: false,
  getProduct: {},
};

const modalSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    showModalDelete: (state, action) => {
      state.showModalDelete = true;
    },
    hideModalDelete: (state, action) => {
      state.showModalDelete = false;
    },
    getProduct: (state, action) => {
      state.getProduct = action.payload;
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice.reducer;
