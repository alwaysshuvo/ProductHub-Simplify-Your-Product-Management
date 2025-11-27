"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react";
import Counter from "./Counter";
import { toast } from "react-hot-toast";

// 🔥 Firebase import
import { auth } from "@/lib/firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ProductDetails = ({ product }) => {
  const productId = product._id || product.id;
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  // ==== FIX WRONG IMAGE HOSTNAME ====
  const fixedImages = product.images?.map((url) =>
    url?.includes("i.ibb.co.com") ? url.replace("i.ibb.co.com", "i.ibb.co") : url
  );
  const [mainImage, setMainImage] = useState(fixedImages?.[0] || "");

  // 🔥 Add to cart handler (Firebase version)
  const addToCartHandler = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }

    dispatch(addToCart({ productId }));

    // send to backend
    await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.uid, productId }),
    });
  };

  // ⭐ SAFE RATING CALCULATION
  const ratingArray = Array.isArray(product.rating) ? product.rating : [];
  const averageRating = ratingArray.length
    ? ratingArray.reduce((sum, item) => sum + (item?.rating || 0), 0) / ratingArray.length
    : 0;

  return (
    <div className="flex max-lg:flex-col gap-12">
      {/* ==== Images ==== */}
      <div className="flex max-sm:flex-col-reverse gap-3">
        <div className="flex sm:flex-col gap-3">
          {fixedImages?.map((img, index) => (
            <div
              key={index}
              onClick={() => setMainImage(img)}
              className="bg-slate-100 flex items-center justify-center size-26 rounded-lg cursor-pointer group"
            >
              <Image src={img} className="group-hover:scale-105 transition" alt="" width={45} height={45} />
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg">
          <Image src={mainImage} alt="" width={250} height={250} />
        </div>
      </div>

      {/* ==== Product Info ==== */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold text-slate-800">{product.name}</h1>

        {/* Rating */}
        <div className="flex items-center mt-2">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <StarIcon
                key={i}
                size={14}
                fill={averageRating >= i + 1 ? "#00C950" : "#D1D5DB"}
                className="text-transparent mt-0.5"
              />
            ))}
          <p className="text-sm ml-3 text-slate-500">{ratingArray.length} Reviews</p>
        </div>

        {/* Price */}
        <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
          <p>{currency}{product.price}</p>
          {product.mrp && <p className="text-xl text-slate-500 line-through">{currency}{product.mrp}</p>}
        </div>

        {/* Discount */}
        {product.mrp && (
          <div className="flex items-center gap-2 text-slate-500">
            <TagIcon size={14} />
            <p>Save {((product.mrp - product.price) / product.mrp * 100).toFixed(0)}% right now</p>
          </div>
        )}

        {/* Cart + Quantity */}
        <div className="flex items-end gap-5 mt-10">
          {cartItems[productId] && (
            <div className="flex flex-col gap-3">
              <p className="text-lg text-slate-800 font-semibold">Quantity</p>
              <Counter productId={productId} />
            </div>
          )}

          <button
            onClick={() => (cartItems[productId] ? router.push("/cart") : addToCartHandler())}
            className="bg-slate-800 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition"
          >
            {!cartItems[productId] ? "Add to Cart" : "View Cart"}
          </button>
        </div>

        <hr className="border-gray-300 my-5" />

        {/* More Info */}
        <div className="flex flex-col gap-4 text-slate-500">
          <p className="flex gap-3"><EarthIcon className="text-slate-400" /> Free shipping worldwide</p>
          <p className="flex gap-3"><CreditCardIcon className="text-slate-400" /> 100% Secured Payment</p>
          <p className="flex gap-3"><UserIcon className="text-slate-400" /> Trusted by top brands</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
