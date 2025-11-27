import Navbar from "@/components/Navbar";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Navbar />
          {children}
          <Footer />
          <Toaster position="top-center" reverseOrder={false} />
        </StoreProvider>
      </body>
    </html>
  );
}
