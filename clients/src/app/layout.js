import { ThemeProvider } from "next-themes";

import "./globals.css";
import Navbar from "@/Components/Navbar";

export const metadata = {
  title: "Product Hub",
  description: "Best Global Product Directory",
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

