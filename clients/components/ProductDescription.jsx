"use client";
import { ArrowRight, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ProductDescription = ({ product }) => {
  const [selectedTab, setSelectedTab] = useState("Description");

  // ======= SAFE DATA =======
  const ratings = Array.isArray(product?.rating) ? product.rating : [];
  const store = product?.store || {};
  const storeName = store?.name || "Unknown Store";
  const storeLogo = store?.logo || null;
  const storeUsername = store?.username || "#";

  return (
    <div className="my-18 text-sm text-slate-600">

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 max-w-2xl">
        {["Description", "Reviews"].map((tab, index) => (
          <button
            key={index}
            onClick={() => setSelectedTab(tab)}
            className={`px-3 py-2 font-medium ${
              tab === selectedTab
                ? "border-b-[1.5px] font-semibold"
                : "text-slate-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Description */}
      {selectedTab === "Description" && (
        <p className="max-w-xl">{product?.description || "No description."}</p>
      )}

      {/* Reviews */}
      {selectedTab === "Reviews" && (
        <div className="flex flex-col gap-3 mt-14">
          {ratings.length > 0 ? (
            ratings.map((item, index) => (
              <div key={index} className="flex gap-5 mb-10">
                <Image
                  src={item?.user?.image || "/user.png"}
                  alt=""
                  className="size-10 rounded-full"
                  width={100}
                  height={100}
                />
                <div>
                  <div className="flex items-center">
                    {Array(5)
                      .fill("")
                      .map((_, i) => (
                        <StarIcon
                          key={i}
                          size={18}
                          className="text-transparent mt-0.5"
                          fill={item?.rating >= i + 1 ? "#00C950" : "#D1D5DB"}
                        />
                      ))}
                  </div>
                  <p className="text-sm max-w-lg my-4">{item?.review}</p>
                  <p className="font-medium text-slate-800">
                    {item?.user?.name || "Anonymous"}
                  </p>
                  <p className="mt-3 font-light">
                    {item?.createdAt
                      ? new Date(item.createdAt).toDateString()
                      : ""}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500">No reviews yet.</p>
          )}
        </div>
      )}

      {/* Store Info */}
      <div className="flex gap-3 mt-14">
        <div className="size-11 rounded-full overflow-hidden ring ring-slate-400 flex items-center justify-center bg-gray-100">
          {storeLogo ? (
            <Image src={storeLogo} alt="" width={100} height={100} />
          ) : (
            <span className="text-xs text-gray-500">No Logo</span>
          )}
        </div>
        <div>
          <p className="font-medium text-slate-600">Product by {storeName}</p>
          <Link
            href={`/shop/${storeUsername}`}
            className="flex items-center gap-1.5 text-green-500"
          >
            View Store <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
