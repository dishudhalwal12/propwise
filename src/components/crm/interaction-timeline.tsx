import { Interaction } from "@/types/crm";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/utils";

export function InteractionTimeline({ interactions }: { interactions: Interaction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interaction history</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {interactions.length === 0 ? (
          <EmptyState
            title="No interactions yet"
            description="Calls, emails, meetings, and viewings will appear here once the CRM starts logging them."
          />
        ) : (
          interactions.map((interaction) => (
            <div key={interaction.id} className="rounded-[24px] border border-border bg-slate-50/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border/80 dark:bg-white/5 dark:hover:border-white/10">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-medium capitalize text-slate-950 dark:text-white">{interaction.type}</p>
                <p className="text-sm text-muted-foreground">{formatDateTime(interaction.interactionAt)}</p>
              </div>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{interaction.notes}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Outcome: {interaction.outcome}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
