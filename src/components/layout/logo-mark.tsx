import Link from "next/link";

import { cn } from "@/lib/utils";

export function LogoMark({ className, invert = false }: { className?: string; invert?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold shadow-soft",
          invert ? "bg-white text-slate-950" : "bg-slate-950 text-white"
        )}
      >
        PW
      </div>
      <div>
        <p className={cn("font-display text-lg font-semibold tracking-tight", invert ? "text-white" : "text-slate-950")}>
          PropWise
        </p>
        <p className={cn("text-xs", invert ? "text-white/70" : "text-slate-500")}>Real Estate Intelligence</p>
      </div>
    </Link>
  );
}
