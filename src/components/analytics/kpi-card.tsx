import { Card, CardContent } from "@/components/ui/card";

export function KpiCard({
  label,
  value,
  description,
  tint = "bg-white/80"
}: {
  label: string;
  value: string;
  description: string;
  tint?: string;
}) {
  return (
    <Card className={tint}>
      <CardContent className="space-y-3 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
        <p className="font-display text-4xl font-semibold text-slate-950">{value}</p>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}
