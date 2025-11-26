import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ===== Backend থেকে Products Load =====
export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  return await res.json();
});

const productSlice = createSlice({
  name: "product",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {
    clearProduct: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
