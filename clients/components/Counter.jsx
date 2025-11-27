"use client";

import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { auth } from "@/lib/firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Counter = ({ productId }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleAdd = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login to change quantity");
      return;
    }

    dispatch(addToCart({ productId }));

    await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.uid, productId }),
    });
  };

  const handleRemove = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login to change quantity");
      return;
    }

    dispatch(removeFromCart({ productId }));

    await fetch(`${API_URL}/cart/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.uid,
        productId,
        qty: cartItems[productId] - 1,
      }),
    });
  };

  return (
    <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
      <button onClick={handleRemove} className="p-1 select-none">
        -
      </button>
      <p className="p-1">{cartItems[productId]}</p>
      <button onClick={handleAdd} className="p-1 select-none">
        +
      </button>
    </div>
  );
};

export default Counter;
