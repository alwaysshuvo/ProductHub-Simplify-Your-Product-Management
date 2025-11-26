import Navbar from "@/components/Navbar";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Navbar />
          {children}
          <Footer />
          </StoreProvider>
      </body>
    </html>
  );
}
