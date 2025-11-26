import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
  name: "address",
  initialState: {
    list: [], 
  },
  reducers: {
    setAddress: (state, action) => {
      state.list = action.payload;
    },
    addAddress: (state, action) => {
      state.list.push(action.payload);
    }
  }
});

export const { setAddress, addAddress } = addressSlice.actions;
export default addressSlice.reducer;
