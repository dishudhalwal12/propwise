import { Viewing } from "@/types/crm";
import { Property } from "@/types/property";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/utils";

export function ViewingList({
  viewings,
  properties
}: {
  viewings: Viewing[];
  properties: Property[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled viewings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {viewings.length === 0 ? (
          <EmptyState
            title="No viewings scheduled"
            description="Once leads are matched with properties and site visits are booked, they will appear here."
          />
        ) : (
          viewings.map((viewing) => {
            const property = properties.find((entry) => entry.id === viewing.propertyId);
            return (
              <div key={viewing.id} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-200">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-950">{property?.title ?? "Property viewing"}</p>
                    <p className="text-sm text-slate-500">{formatDateTime(viewing.scheduledAt)}</p>
                  </div>
                  <div className="rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {viewing.status}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{viewing.notes}</p>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
