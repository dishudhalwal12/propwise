"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { KpiCard } from "@/components/analytics/kpi-card";
import { InteractionTimeline } from "@/components/crm/interaction-timeline";
import { ViewingList } from "@/components/crm/viewing-list";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StateNotice } from "@/components/ui/state-notice";
import { useAuth } from "@/hooks/useAuth";
import { useLeads } from "@/hooks/useLeads";
import { useProperties } from "@/hooks/useProperties";

export default function AgentDashboardPage() {
  const { profile } = useAuth();
  const crmOptions =
    profile?.role === "agent"
      ? {
          leads: { assignedAgentId: profile.uid },
          interactions: { agentId: profile.uid },
          viewings: { agentId: profile.uid }
        }
      : undefined;
  const {
    leads,
    interactions,
    viewings,
    isDemoData: crmDemo,
    error: crmError
  } = useLeads(crmOptions);
  const {
    properties,
    isDemoData: propertiesDemo,
    error: propertiesError
  } = useProperties({ status: "active" });

  const funnelData = useMemo(
    () => [
      { stage: "New", total: leads.filter((lead) => lead.status === "new").length },
      { stage: "Contacted", total: leads.filter((lead) => lead.status === "contacted").length },
      { stage: "Qualified", total: leads.filter((lead) => lead.status === "qualified").length },
      { stage: "Closed", total: leads.filter((lead) => lead.status === "closed").length }
    ],
    [leads]
  );

  return (
    <DashboardShell allowedRoles={["agent", "admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Agent dashboard"
          title="Manage pipeline, follow-ups, and viewing momentum"
          description="Every metric and timeline below is driven by the live leads, interactions, and viewing records available to your role."
        />
        {(crmError || propertiesError) && !(crmDemo || propertiesDemo) ? (
          <StateNotice
            tone="warning"
            title="Some CRM data could not be loaded"
            description={crmError || propertiesError}
          />
        ) : null}
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard
            label="Total leads"
            value={String(leads.length)}
            description="Assigned prospects in the active CRM pipeline."
            tint="bg-sky-100/80"
          />
          <KpiCard
            label="Qualified"
            value={String(leads.filter((lead) => lead.status === "qualified").length)}
            description="High-intent opportunities ready for property matching."
            tint="bg-lime-100/80"
          />
          <KpiCard
            label="Upcoming visits"
            value={String(viewings.filter((viewing) => viewing.status === "scheduled").length)}
            description="Scheduled viewings that still need preparation."
            tint="bg-fuchsia-100/70"
          />
          <KpiCard
            label="Recent touchpoints"
            value={String(interactions.length)}
            description="Logged CRM interactions driving the current pipeline."
            tint="bg-white/90"
          />
        </div>
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <CardHeader>
              <CardTitle>Conversion funnel</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              {leads.length === 0 ? (
                <EmptyState
                  title="No lead data yet"
                  description="Leads created or assigned to this workspace will appear here and drive the funnel chart."
                />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="stage" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="total" fill="#0f172a" radius={[14, 14, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <ViewingList viewings={viewings} properties={properties} />
        </div>
        <InteractionTimeline interactions={interactions} />
      </div>
    </DashboardShell>
  );
}
