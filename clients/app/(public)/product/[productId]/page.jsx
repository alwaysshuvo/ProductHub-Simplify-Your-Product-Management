"use client";
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Product() {
  const { productId } = useParams();       // URL থেকে ID
  const [product, setProduct] = useState(null);
  const products = useSelector((state) => state.product.list);

  useEffect(() => {
    if (products?.length > 0) {
      const findProduct = products.find((p) => p._id === productId);
      setProduct(findProduct);
    }

    scrollTo(0, 0);
  }, [productId, products]);

  return (
    <div className="mx-6">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrums */}
        <div className="text-gray-600 text-sm mt-8 mb-5">
          Home / Products / {product?.category || "Loading..."}
        </div>

        {/* Loading State */}
        {!product && (
          <div className="text-center text-gray-500 py-20">
            Loading product details...
          </div>
        )}

        {/* Product Details */}
        {product && <ProductDetails product={product} />}

        {/* Product Description */}
        {product && <ProductDescription product={product} />}
      </div>
    </div>
  );
}
