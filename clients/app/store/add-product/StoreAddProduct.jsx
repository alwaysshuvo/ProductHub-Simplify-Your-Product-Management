"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { assets } from "@/assets/assets";

export default function StoreAddProduct() {
  const categories = [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Beauty & Health",
    "Toys & Games",
    "Sports & Outdoors",
    "Books & Media",
    "Food & Drink",
    "Hobbies & Crafts",
    "Others",
  ];

  // === Local States ===
  const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null });
  const [preview, setPreview] = useState({});
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  const [productInfo, setProductInfo] = useState({
    name: "",
    description: "",
    mrp: "",
    price: "",
    category: "",
  });

  // === Protected Route ===
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (!user) {
        toast.error("Login required!");
        window.location.href = "/login";
      } else {
        setUserId(user.uid);
      }
    });
  }, []);

  // === Handle Input Change ===
  const onChangeHandler = (e) => {
    setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
  };

  // === Preview Image Before Upload ===
  const handleImagePreview = (file, key) => {
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return toast.error("Only image files allowed!");

    setImages({ ...images, [key]: file });
    setPreview({ ...preview, [key]: URL.createObjectURL(file) });
  };

  // === Upload Single Image to Imgbb ===
  const uploadImageToImgbb = async (file) => {
    try {
      const data = new FormData();
      data.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
        { method: "POST", body: data }
      );

      const json = await res.json();
      let url = json?.data?.url;

      // Fix malformed hostname (rare bug of Imgbb)
      if (url?.includes("i.ibb.co.com")) {
        url = url.replace("i.ibb.co.com", "i.ibb.co");
      }

      return url;
    } catch {
      toast.error("Image upload failed!");
      return null;
    }
  };

  // === Submit Handler ===
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error("Session expired! Login again.");

    try {
      setLoading(true);
      let uploadedImages = [];

      toast.loading("Uploading images...");

      for (const key of Object.keys(images)) {
        if (images[key]) {
          const url = await uploadImageToImgbb(images[key]);
          if (url) uploadedImages.push(url);
        }
      }

      toast.dismiss();

      if (uploadedImages.length === 0) {
        setLoading(false);
        return toast.error("Upload at least 1 product image!");
      }

      toast.loading("Saving product...");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productInfo,
          userId,
          images: uploadedImages,
          rating: [],
          inStock: true,
          createdAt: Date.now(),
        }),
      });

      toast.dismiss();

      if (res.ok) {
        toast.success("Product added successfully! 🎉");

        // Reset form
        setProductInfo({ name: "", description: "", mrp: "", price: "", category: "" });
        setImages({ 1: null, 2: null, 3: null, 4: null });
        setPreview({});
      } else {
        toast.error("Failed to add product!");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Something went wrong!");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="text-slate-500 mb-28">
      <h1 className="text-2xl">
        Add New <span className="text-slate-800 font-medium">Products</span>
      </h1>
      <p className="mt-7">Product Images</p>

      {/* === Image Inputs === */}
      <div className="flex gap-3 mt-4">
        {Object.keys(images).map((key) => (
          <label key={key} className="cursor-pointer">
            <Image
              width={160}
              height={120}
              className="h-20 sm:h-24 w-auto border border-slate-300 rounded hover:shadow-md transition"
              src={preview[key] || assets.upload_area}
              alt="upload"
            />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleImagePreview(e.target.files[0], key)}
            />
          </label>
        ))}
      </div>

      {/* === Inputs === */}
      <label className="flex flex-col gap-2 my-6">
        Name
        <input
          name="name"
          value={productInfo.name}
          onChange={onChangeHandler}
          placeholder="Enter product name"
          className="w-full max-w-sm p-2 px-4 border border-slate-200 rounded outline-none"
          required
        />
      </label>

      <label className="flex flex-col gap-2 my-6">
        Description
        <textarea
          name="description"
          value={productInfo.description}
          onChange={onChangeHandler}
          placeholder="Enter product description"
          rows={5}
          className="w-full max-w-sm p-2 px-4 border border-slate-200 rounded resize-none outline-none"
          required
        />
      </label>

      <div className="flex gap-5">
        <label className="flex flex-col gap-2">
          Actual Price ($)
          <input
            name="mrp"
            type="number"
            value={productInfo.mrp}
            onChange={onChangeHandler}
            className="w-full max-w-45 p-2 px-4 border border-slate-200 rounded outline-none"
            required
          />
        </label>
        <label className="flex flex-col gap-2">
          Offer Price ($)
          <input
            name="price"
            type="number"
            value={productInfo.price}
            onChange={onChangeHandler}
            className="w-full max-w-45 p-2 px-4 border border-slate-200 rounded outline-none"
            required
          />
        </label>
      </div>

      <select
        value={productInfo.category}
        onChange={(e) => setProductInfo({ ...productInfo, category: e.target.value })}
        className="w-full max-w-sm p-2 px-4 my-6 border border-slate-200 rounded outline-none"
        required
      >
        <option value="">Select a category</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <button
        disabled={loading}
        className="bg-slate-800 text-white px-6 mt-7 py-2 rounded transition hover:bg-slate-900 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Add Product"}
      </button>
    </form>
  );
}
