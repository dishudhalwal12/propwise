import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass-panel flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between", className)}>
      <div className="space-y-3">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{eyebrow}</p>
        ) : null}
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h1>
          {description ? <p className="max-w-2xl text-sm leading-7 text-slate-600">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
