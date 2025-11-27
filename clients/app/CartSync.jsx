"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setWholeCart } from "@/lib/features/cart/cartSlice";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CartSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        dispatch(setWholeCart({}));
        return;
      }

      try {
        const res = await fetch(`${API_URL}/cart/${user.uid}`);
        const data = await res.json();

        const mapped = {};
        (data.items || []).forEach((item) => {
          mapped[item.productId] = item.qty;
        });

        dispatch(setWholeCart(mapped));
      } catch (err) {
        console.log("Cart load error", err);
      }
    });
  }, [dispatch]);

  return null;
}
