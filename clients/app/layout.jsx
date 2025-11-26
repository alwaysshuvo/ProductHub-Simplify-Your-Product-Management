import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
  title: "ProductHub. - Shop smarter",
  description: "ProductHub. - Shop smarter",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        <StoreProvider>
          
          {/* Navbar সব পেজে show করবে */}
          <Navbar />

          <Toaster />

          {/* এখানে পেজের কন্টেন্ট লোড হবে */}
          {children}

          {/* Footer সব পেজে show করবে */}
          <Footer />

        </StoreProvider>
      </body>
    </html>
  );
}
