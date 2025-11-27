"use client";
import Navbar from "@/components/Navbar";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import CartSync from "./CartSync";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
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
