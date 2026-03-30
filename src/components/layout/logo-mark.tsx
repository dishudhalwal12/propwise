import Link from "next/link";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-3", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-soft">
        PW
      </div>
      <div>
        <p className="font-display text-lg font-semibold tracking-tight text-slate-950">PropWise</p>
        <p className="text-xs text-slate-500">Real Estate Intelligence</p>
      </div>
    </Link>
  );
}
