"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Loading from "@/components/Loading";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function StoreManageProducts() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);

  // ===================== Logged In User Check =====================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "/login"; // redirect to login
      } else {
        setUserId(user.uid);
      }
    });
    return () => unsub();
  }, []);

  // ===================== Fetch Products =====================
  const fetchProducts = async () => {
    try {
      setLoading(true);

      // only fetch products created by this user
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/user/${userId}`
      );
      const data = await res.json();

      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products!");
    } finally {
      setLoading(false);
    }
  };

  // run fetch after userId confirmed
  useEffect(() => {
    if (userId) fetchProducts();
  }, [userId]);

  // ===================== Toggle Stock =====================
  const toggleStock = async (productId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/toggle/${productId}`,
        { method: "PATCH" }
      );

      if (res.ok) {
        toast.success("Product stock updated!");
        fetchProducts(); // refresh list
      } else {
        toast.error("Error updating stock!");
      }
    } catch (error) {
      toast.error("Server error!");
    }
  };

  if (loading) return <Loading />;

  // ===================== JSX =====================
  return (
    <>
      <h1 className="text-2xl text-slate-500 mb-5">
        Manage <span className="text-slate-800 font-medium">Products</span>
      </h1>

      {products.length === 0 ? (
        <p className="text-slate-600 mt-10">No products found!</p>
      ) : (
        <table className="w-full max-w-4xl text-left ring ring-slate-200 rounded overflow-hidden text-sm">
          <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 hidden md:table-cell">Description</th>
              <th className="px-4 py-3 hidden md:table-cell">MRP</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="text-slate-700">
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <div className="flex gap-2 items-center">
                    <Image
                      width={40}
                      height={40}
                      className="p-1 shadow rounded cursor-pointer"
                      src={product.images[0]}
                      alt=""
                    />
                    {product.name}
                  </div>
                </td>

                <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell truncate">
                  {product.description}
                </td>

                <td className="px-4 py-3 hidden md:table-cell">
                  {currency} {product.mrp.toLocaleString()}
                </td>

                <td className="px-4 py-3">
                  {currency} {product.price.toLocaleString()}
                </td>

                <td className="px-4 py-3 text-center">
                  <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      onChange={() =>
                        toast.promise(toggleStock(product._id), {
                          loading: "Updating data...",
                        })
                      }
                      checked={product.inStock}
                    />
                    <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                    <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
