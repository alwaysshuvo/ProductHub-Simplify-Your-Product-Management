"use client";
import { useRef, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { makeStore } from "../lib/store";
import { fetchProducts } from "@/lib/features/product/productSlice";  // 🔥 IMPORT

// 🔥 First Time Data Load
function InitialDataFetcher({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts()); // Backend থেকে Product Load
  }, []);

  return children;
}

export default function StoreProvider({ children }) {
  const storeRef = useRef(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <InitialDataFetcher>{children}</InitialDataFetcher>
    </Provider>
  );
}
