"use client";

import Link from "next/link";
import Image from "next/image";
import ModeToggle from "@/components/mode-toggle";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="border-b bg-background/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* === Logo === */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Logo.png"
            alt="ProductHub Logo"
            width={32}
            height={32}
            className="rounded-md"
          />

          <span className="text-xl font-bold">ProductHub</span>
        </Link>

        {/* === Desktop Menu === */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/contact">Contact</Link>

          <Link href="/login">
            <Button variant="default" size="sm">
              Login
            </Button>
          </Link>

          <ModeToggle />
        </nav>

        {/* === Mobile Menu === */}
        <div className="md:hidden flex items-center gap-2">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pt-10">
              <div className="flex flex-col text-lg gap-6">
                <Link href="/">Home</Link>
                <Link href="/products">Products</Link>
                <Link href="/contact">Contact</Link>

                <Link href="/login">
                  <Button className="w-full">Login</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
