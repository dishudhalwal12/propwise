import { Card, CardContent } from "@/components/ui/card";

export function KpiCard({
  label,
  value,
  description,
  tint = "bg-white/80 dark:bg-white/5"
}: {
  label: string;
  value: string;
  description: string;
  tint?: string;
}) {
  return (
    <Card className={tint}>
      <CardContent className="space-y-3 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
        <p className="font-display text-4xl font-semibold text-slate-950 dark:text-white">{value}</p>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
