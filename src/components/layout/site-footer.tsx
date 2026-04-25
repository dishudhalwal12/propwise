import Link from "next/link";

import { LogoMark } from "@/components/layout/logo-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/50 py-10 dark:border-white/10">
      <div className="container-shell flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <LogoMark />
        <div className="flex flex-wrap gap-5 text-sm text-slate-600 dark:text-slate-400">
          <Link href="/properties" className="hover:text-slate-950 dark:hover:text-white transition-colors">Properties</Link>
          <Link href="/compare" className="hover:text-slate-950 dark:hover:text-white transition-colors">Compare</Link>
          <Link href="/calculator" className="hover:text-slate-950 dark:hover:text-white transition-colors">Calculator</Link>
          <Link href="/profile" className="hover:text-slate-950 dark:hover:text-white transition-colors">Profile</Link>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">© 2026 PropWise. Built for smarter property decisions.</p>
      </div>
    </footer>
  );
}
