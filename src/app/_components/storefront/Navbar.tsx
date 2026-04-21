"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  const { toggleCart, getTotalItems } = useCartStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const transparentOrigins = ["/"];
  const isTransparentOrigin = transparentOrigins.includes(pathname);

  const navClasses = isTransparentOrigin && !scrolled && !mobileMenuOpen
    ? "bg-transparent text-gray-900 border-transparent shadow-none"
    : "bg-white/80 backdrop-blur-md text-gray-900 border-gray-100 shadow-sm";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${navClasses}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold tracking-tighter">
              Art From Heart.
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link href="/shop" className="text-sm font-medium hover:text-rose-500 transition-colors">
                Shop All
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-rose-500 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-rose-500 transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Cart & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => toggleCart(true)}
              className="p-2 hover:bg-gray-100/50 rounded-full transition-colors relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {mounted && getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center translate-x-1 -translate-y-1">
                  {getTotalItems()}
                </span>
              )}
            </button>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute top-16 w-full shadow-lg">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-rose-500">
              Shop All
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-rose-500">
              About
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-rose-500">
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
