"use client";
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "@/components/Loading";

export default function Product() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const products = useSelector((state) => state.product.list);

  useEffect(() => {
    if (products?.length > 0) {
      const findProduct = products.find((p) => p._id === productId);
      if (findProduct) setProduct(findProduct);
      else setNotFound(true);
    }
    scrollTo(0, 0);
  }, [productId, products]);

  if (notFound)
    return (
      <div className="text-center text-gray-500 py-20 text-xl">
        Product not found!
      </div>
    );

  if (!product) return <Loading />;

  return (
    <div className="mx-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-gray-600 text-sm mt-8 mb-5">
          Home / Products / {product?.category}
        </div>
        <ProductDetails product={product} />
        <ProductDescription product={product} />
      </div>
    </div>
  );
}
