"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

import { LogoMark } from "@/components/layout/logo-mark";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
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
            ? "border-black/5 bg-white/72 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-black/60"
            : "border-white/10 bg-black/18 backdrop-blur-md dark:bg-white/5"
        )}
      >
        <LogoMark invert={!scrolled} />
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition",
                scrolled 
                  ? "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white" 
                  : "text-white/72 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          <Button variant={scrolled ? "default" : "secondary"} asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border",
              scrolled
                ? "border-black/5 bg-white/70 text-slate-950 dark:border-white/10 dark:bg-black/60 dark:text-white"
                : "border-white/15 bg-white/8 text-white"
            )}
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </motion.header>
      {open ? (
        <div className="container-shell mt-3 md:hidden">
          <div className="glass-panel space-y-4 px-5 py-5">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
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
