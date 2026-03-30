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
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="pb-4">Lead</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Priority</th>
              <th className="pb-4">Budget</th>
              <th className="pb-4">Preferences</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="transition-colors hover:bg-white/40">
                <td className="py-4">
                  <div>
                    <p className="font-medium text-slate-950">{lead.name}</p>
                    <p className="text-slate-500">{lead.email}</p>
                  </div>
                </td>
                <td className="py-4">
                  <Badge variant={statusTint[lead.status]}>{lead.status}</Badge>
                </td>
                <td className="py-4 capitalize text-slate-600">{lead.priority}</td>
                <td className="py-4 text-slate-600">
                  {formatCurrency(lead.budgetMin)} - {formatCurrency(lead.budgetMax)}
                </td>
                <td className="py-4 text-slate-600">
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
