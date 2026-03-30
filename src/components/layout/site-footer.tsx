import Link from "next/link";

import { LogoMark } from "@/components/layout/logo-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/50 py-10">
      <div className="container-shell flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <LogoMark />
        <div className="flex flex-wrap gap-5 text-sm text-slate-600">
          <Link href="/properties">Properties</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/calculator">Calculator</Link>
          <Link href="/profile">Profile</Link>
        </div>
        <p className="text-sm text-slate-500">© 2026 PropWise. Built for smarter property decisions.</p>
      </div>
    </footer>
  );
}
