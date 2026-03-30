import { AlertCircle, DatabaseZap, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const tones = {
  info: {
    icon: Sparkles,
    wrapper: "border-sky-200/80 bg-sky-50/80 text-sky-950",
    iconWrap: "bg-white text-sky-600"
  },
  warning: {
    icon: AlertCircle,
    wrapper: "border-amber-200/80 bg-amber-50/80 text-amber-950",
    iconWrap: "bg-white text-amber-600"
  },
  demo: {
    icon: DatabaseZap,
    wrapper: "border-emerald-200/80 bg-emerald-50/80 text-emerald-950",
    iconWrap: "bg-white text-emerald-600"
  }
} as const;

export function StateNotice({
  title,
  description,
  tone = "info",
  action,
  className
}: {
  title: string;
  description?: string;
  tone?: keyof typeof tones;
  action?: React.ReactNode;
  className?: string;
}) {
  const config = tones[tone];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-[26px] border px-5 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:flex-row sm:items-start sm:justify-between",
        config.wrapper,
        className
      )}
    >
      <div className="flex gap-3">
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", config.iconWrap)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-[0.01em]">{title}</p>
          {description ? <p className="text-sm leading-6 opacity-80">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="sm:pl-4">{action}</div> : null}
    </div>
  );
}
