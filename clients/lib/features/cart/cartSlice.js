import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    total: 0,
    cartItems: {}, // { productId: qty }
  },

  reducers: {
    addToCart: (state, action) => {
      const { productId } = action.payload;

      state.cartItems[productId] = (state.cartItems[productId] || 0) + 1;
      state.total = Math.max(
        0,
        Object.values(state.cartItems).reduce((sum, qty) => sum + qty, 0)
      );
    },

    removeFromCart: (state, action) => {
      const { productId } = action.payload;

      if (!state.cartItems[productId]) return;

      if (state.cartItems[productId] <= 1) {
        delete state.cartItems[productId];
      } else {
        state.cartItems[productId]--;
      }

      state.total = Math.max(
        0,
        Object.values(state.cartItems).reduce((sum, qty) => sum + qty, 0)
      );
    },

    deleteItemFromCart: (state, action) => {
      const { productId } = action.payload;

      if (state.cartItems[productId]) {
        delete state.cartItems[productId];
      }

      state.total = Math.max(
        0,
        Object.values(state.cartItems).reduce((sum, qty) => sum + qty, 0)
      );
    },

    clearCart: (state) => {
      state.cartItems = {};
      state.total = 0;
    },

    setWholeCart: (state, action) => {
      state.cartItems = action.payload || {};
      state.total = Math.max(
        0,
        Object.values(state.cartItems).reduce((sum, qty) => sum + qty, 0)
      );
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  deleteItemFromCart,
  clearCart,
  setWholeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
