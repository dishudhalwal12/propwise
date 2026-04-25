import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-4 p-10 text-center">
        <div className="rounded-full bg-slate-950 dark:bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white dark:text-slate-950">
          PropWise
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-3xl font-semibold text-slate-950 dark:text-white">{title}</h2>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">{description}</p>
        </div>
        {action ? <div className="pt-2">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
