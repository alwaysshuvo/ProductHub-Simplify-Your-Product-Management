"use client";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { makeStore } from "@/lib/store"; // 👈 Correct import

// ===================== Load Initial Data =====================
function InitialDataFetcher({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return children;
}

// ===================== Export Provider =====================
export default function StoreProvider({ children }) {
  const store = makeStore(); // 👈 Generate Redux Store

  return (
    <Provider store={store}>
      <InitialDataFetcher>{children}</InitialDataFetcher>
    </Provider>
  );
}
