import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-slate-900 text-white",
        outline: "border-slate-200 bg-white text-slate-700",
        mint: "border-emerald-200 bg-emerald-50 text-emerald-700",
        sky: "border-sky-200 bg-sky-50 text-sky-700",
        lilac: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
        amber: "border-amber-200 bg-amber-50 text-amber-700"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
