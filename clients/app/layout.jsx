"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import CartSync from "./CartSync";
import Loader from "@/components/Loader"; // 👈 Loader Import

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loader for a small, smooth time
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body>
        {loading && <Loader />} {/* 👈 Show Global Loader */}

        <StoreProvider>
          <Navbar />
          <Toaster position="top-center" />
          <CartSync />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
