"use client";

import { Menu, X, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // ======= User & Cart Data =======
  const cartCount = useSelector((state) => state.cart.total);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  // ======== Check Login State ========
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ======== Logout ========
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // ======== Handle Search ========
  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
  };

  // ======== Active Link Function ========
  const isActive = (path) =>
    pathname === path ? "text-green-600 font-semibold" : "text-slate-600";

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* ==================== Logo ==================== */}
        <Link href="/" className="relative text-3xl font-semibold text-slate-700">
          <span className="text-green-600">Pro</span>Duct
          <span className="text-green-600 text-4xl">.</span>
          <p className="absolute text-[10px] font-bold -top-1 -right-8 px-2 rounded-full text-white bg-green-500">
            Hub
          </p>
        </Link>

        {/* ==================== Mobile Right Side ==================== */}
        <div className="flex gap-4 items-center sm:hidden">
          <Link href="/cart" className="relative">
            <ShoppingCart className="text-slate-700" size={21} />
            <span className="absolute -top-1 -right-2 text-[10px] text-white bg-slate-700 px-1 rounded-full">
              {cartCount}
            </span>
          </Link>

          {!user ? (
            <Link href="/login" className="text-sm bg-indigo-500 text-white px-4 py-1.5 rounded-full">
              Login
            </Link>
          ) : (
            <Image
              onClick={() => setOpenMenu(!openMenu)}
              src={user.photoURL || "/default-user.png"}
              width={32}
              height={32}
              className="rounded-full cursor-pointer border shadow"
              alt="profile"
            />
          )}

          <button onClick={() => setOpenMenu(!openMenu)}>
            {openMenu ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* ==================== Desktop Menu ==================== */}
        <div className="hidden sm:flex items-center gap-6 text-[15px]">
          <Link href="/" className={isActive("/")}>Home</Link>
          <Link href="/shop" className={isActive("/shop")}>Shop</Link>
          <Link href="/about" className={isActive("/about")}>About</Link>
          <Link href="/contact" className={isActive("/contact")}>Contact</Link>

          {user && (
            <>
              <Link href="/store/add-product" className="text-green-600">+ Add Product</Link>
              <Link href="/store/manage-product" className="text-green-600">Manage</Link>
            </>
          )}

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full"
          >
            <Search size={18} className="text-slate-600" />
            <input
              type="text"
              placeholder="Search products"
              className="bg-transparent outline-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              required
            />
          </form>

          {/* Cart */}
          <Link href="/cart" className="relative flex items-center gap-1 text-slate-600">
            <ShoppingCart size={18} />
            Cart
            <span className="absolute -top-1 left-3 text-[9px] text-white bg-slate-600 px-1 rounded-full">
              {cartCount}
            </span>
          </Link>

          {/* Login/User */}
          {!user ? (
            <Link href="/login" className="px-6 py-2 bg-indigo-500 text-white rounded-full">
              Login
            </Link>
          ) : (
            <div className="relative group">
              <Image
                src={user.photoURL || "/default-user.png"}
                width={35}
                height={35}
                alt="profile"
                className="rounded-full cursor-pointer border shadow-sm group-hover:ring-2 ring-green-400 w-[35px] h-[35px] object-cover"
              />
              <div className="absolute right-0 w-48 bg-white shadow-xl rounded-md border invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all">
                <div className="px-4 py-3 border-b">
                  <p className="text-[14px] font-semibold">{user.displayName || "User"}</p>
                  <p className="text-[12px] text-gray-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 font-medium hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== Mobile Dropdown ==================== */}
      {openMenu && (
        <div className="sm:hidden bg-white border-t shadow-sm">
          <div className="flex flex-col gap-4 px-4 py-3 text-[15px]">
            <Link href="/" className={isActive("/")} onClick={() => setOpenMenu(false)}>Home</Link>
            <Link href="/shop" className={isActive("/shop")} onClick={() => setOpenMenu(false)}>Shop</Link>
            <Link href="/about" className={isActive("/about")} onClick={() => setOpenMenu(false)}>About</Link>
            <Link href="/contact" className={isActive("/contact")} onClick={() => setOpenMenu(false)}>Contact</Link>

            {user && (
              <>
                <Link href="/store/add-product" className="text-green-600" onClick={() => setOpenMenu(false)}>+ Add Product</Link>
                <Link href="/store/manage-product" className="text-green-600" onClick={() => setOpenMenu(false)}>Manage</Link>
              </>
            )}

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-sm">
              <Search size={18} className="text-slate-600" />
              <input
                className="bg-transparent outline-none w-full"
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>

            {user && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 font-semibold bg-red-50 rounded"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
