import { Lead } from "@/types/crm";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const statusTint: Record<Lead["status"], "outline" | "mint" | "sky" | "amber"> = {
  new: "outline",
  contacted: "sky",
  qualified: "mint",
  closed: "amber"
};

export function LeadTable({ leads }: { leads: Lead[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead pipeline</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="pb-4">Lead</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Priority</th>
              <th className="pb-4">Budget</th>
              <th className="pb-4">Preferences</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {leads.map((lead) => (
              <tr key={lead.id} className="transition-colors hover:bg-white/5">
                <td className="py-4">
                  <div>
                    <p className="font-medium text-slate-950 dark:text-white">{lead.name}</p>
                    <p className="text-muted-foreground">{lead.email}</p>
                  </div>
                </td>
                <td className="py-4">
                  <Badge variant={statusTint[lead.status]}>{lead.status}</Badge>
                </td>
                <td className="py-4 capitalize text-muted-foreground">{lead.priority}</td>
                <td className="py-4 text-muted-foreground">
                  {formatCurrency(lead.budgetMin)} - {formatCurrency(lead.budgetMax)}
                </td>
                <td className="py-4 text-muted-foreground">
                  {lead.preferences.type ?? "Any"} · {lead.preferences.city ?? "Multi-city"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
