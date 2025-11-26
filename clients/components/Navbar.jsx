"use client";
import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const cartCount = useSelector((state) => state.cart.total);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
  };

  return (
    <nav className="relative bg-white">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4">
          <Link
            href="/"
            className="relative text-4xl font-semibold text-slate-700"
          >
            <span className="text-green-600">Pro</span>Duct
            <span className="text-green-600 text-5xl leading-0">.</span>
            <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full text-white bg-green-500">
              Hub
            </p>
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-slate-600">
            <Link href="/">Home</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>

            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full"
            >
              <Search size={18} className="text-slate-600" />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-600"
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>

            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-slate-600"
            >
              <ShoppingCart size={18} />
              Cart
              <span className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            {!user && (
              <Link
                href="/login"
                className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
              >
                Login
              </Link>
            )}

            {user && (
              <div className="relative group">
                <Image
                  src={user.photoURL || "/default-user.png"}
                  width={38}
                  height={38}
                  alt="profile"
                  className="rounded-full cursor-pointer border border-gray-300 shadow-sm group-hover:ring-2 group-hover:ring-green-400 transition-all"
                />

                <div
                  className="absolute right-0 w-52 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 
      translate-y-2 group-hover:translate-y-0
      bg-white/80 backdrop-blur-xl shadow-xl border border-gray-200 rounded-xl mt-2 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b bg-white/60 backdrop-blur-md">
                    <p className="text-[15px] font-semibold text-gray-800 truncate">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-red-600 font-medium hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {!user && (
            <div className="sm:hidden">
              <button className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full">
                Login
              </button>
            </div>
          )}
        </div>
      </div>

      <hr className="border-gray-300" />
    </nav>
  );
};

export default Navbar;
