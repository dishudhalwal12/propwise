"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

import { LogoMark } from "@/components/layout/logo-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" }
];

export function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <motion.header
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-full border px-5 py-3 transition-all duration-300",
          scrolled
            ? "border-white/70 bg-white/72 shadow-glass backdrop-blur-2xl"
            : "border-transparent bg-transparent"
        )}
      >
        <LogoMark />
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button variant={scrolled ? "default" : "secondary"} asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/70 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </motion.header>
      {open ? (
        <div className="container-shell mt-3 md:hidden">
          <div className="glass-panel space-y-4 px-5 py-5">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="block text-sm font-medium text-slate-700">
                {item.label}
              </Link>
            ))}
            <Button className="w-full" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
