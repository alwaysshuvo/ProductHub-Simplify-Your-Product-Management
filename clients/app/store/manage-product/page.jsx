"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Loading from "@/components/Loading";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function StoreManageProducts() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  // ===================== Authentication Check =====================
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (!user) window.location.href = "/login";
      else setUserId(user.uid);
    });
  }, []);

  // ===================== Fetch Products =====================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/user/${userId}`
      );
      const data = await res.json();
      setProducts(data);
    } catch {
      toast.error("Failed to load products!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchProducts();
  }, [userId]);

  // ===================== Toggle Stock =====================
  const toggleStock = async (productId) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/toggle/${productId}`,
      { method: "PATCH" }
    );
    if (res.ok) {
      toast.success("Stock status updated");
      fetchProducts();
    } else toast.error("Failed to update");
  };

  // ===================== Delete Product =====================
  const confirmDelete = async () => {
    const id = deleteModal.id;
    if (!id) return;

    toast.loading("Deleting...");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      { method: "DELETE" }
    );
    toast.dismiss();

    if (res.ok) {
      toast.success("Product deleted");
      fetchProducts();
    } else toast.error("Delete failed!");

    setDeleteModal({ open: false, id: null });
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
              <th className="px-4 py-3 hidden md:table-cell">MRP</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="text-slate-700">
            {products.map((p) => (
              <tr
                key={p._id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                {/* ===================== Product Info + Details Link ===================== */}
                <td className="px-4 py-3">
                  <Link href={`/product/${p._id}`} className="flex gap-2 items-center">
                    <Image
                      width={40}
                      height={40}
                      className="p-1 shadow rounded"
                      src={p.images[0]}
                      alt=""
                    />
                    <span className="cursor-pointer hover:underline">{p.name}</span>
                  </Link>
                </td>

                <td className="px-4 py-3 hidden md:table-cell">
                  {currency} {p.mrp.toLocaleString()}
                </td>

                <td className="px-4 py-3">
                  {currency} {p.price.toLocaleString()}
                </td>

                {/* ===================== Action Buttons ===================== */}
                <td className="px-4 py-3 flex gap-3 justify-center">

                  {/* Edit Btn */}
                  <Link
                    href={`/store/edit-product/${p._id}`}
                    className="px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
                  >
                    Edit
                  </Link>

                  {/* Toggle Stock */}
                  <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={p.inStock}
                      onChange={() =>
                        toast.promise(toggleStock(p._id), {
                          loading: "Updating...",
                        })
                      }
                    />
                    <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors"></div>
                    <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
                  </label>

                  {/* Delete Btn */}
                  <button
                    onClick={() => setDeleteModal({ open: true, id: p._id })}
                    className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ===================== Delete Modal ===================== */}
      {deleteModal.open && (
        <div className="fixed bg-black/50 inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded shadow-lg text-center">
            <h3 className="text-lg font-medium mb-4 text-slate-700">
              Are you sure you want to delete?
            </h3>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setDeleteModal({ open: false, id: null })}
                className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
