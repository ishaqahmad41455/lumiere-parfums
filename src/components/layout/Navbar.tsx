"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Volume2,
  VolumeX,
  Sun,
  Moon,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Women", href: "/shop?gender=WOMEN" },
  { label: "Men", href: "/shop?gender=MEN" },
  { label: "Collections", href: "/collections" },
  { label: "Limited Edition", href: "/shop?collection=limited-edition" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const openCart = useCartStore((s) => s.open);
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        scrolled ? "glass py-3" : "bg-transparent py-6"
      )}
    >
      <nav className="container flex items-center justify-between" aria-label="Primary">
        <button
          className="lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link href="/" className="font-display text-xl tracking-widest2 md:text-2xl" data-cursor-hover>
          LUMIÈRE
        </Link>

        <ul className="hidden gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="eyebrow text-noir/80 transition-colors hover:text-gold dark:text-cream/80"
                data-cursor-hover
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <button aria-label="Search" data-cursor-hover className="hidden sm:block">
            <Search size={19} />
          </button>
          <button
            aria-label={soundOn ? "Mute ambient sound" : "Unmute ambient sound"}
            onClick={() => setSoundOn((v) => !v)}
            data-cursor-hover
            className="hidden sm:block"
          >
            {soundOn ? <Volume2 size={19} /> : <VolumeX size={19} />}
          </button>
          <button
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => setDark((v) => !v)}
            data-cursor-hover
            className="hidden sm:block"
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <Link href="/wishlist" aria-label="Wishlist" data-cursor-hover className="relative">
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] text-noir">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link href="/account" aria-label="Account" data-cursor-hover className="hidden sm:block">
            <User size={19} />
          </Link>
          <button aria-label="Open cart" onClick={openCart} data-cursor-hover className="relative">
            <ShoppingBag size={19} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] text-noir">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <motion.ul
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="container mt-6 flex flex-col gap-4 lg:hidden"
        >
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="eyebrow" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </motion.ul>
      )}
    </header>
  );
}
