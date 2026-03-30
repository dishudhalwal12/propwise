"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { KpiCard } from "@/components/analytics/kpi-card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StateNotice } from "@/components/ui/state-notice";
import { getDemoComparisonCount } from "@/data/demo";
import { useLeads } from "@/hooks/useLeads";
import { useProperties } from "@/hooks/useProperties";
import { useUsers } from "@/hooks/useUsers";
import { getComparisonCount } from "@/lib/firestore/comparisons";

export default function AnalyticsPage() {
  const { leads, viewings, isDemoData: crmDemo, notice: crmNotice, error: crmError } = useLeads();
  const {
    properties,
    isDemoData: propertiesDemo,
    notice: propertiesNotice,
    error: propertiesError
  } = useProperties({ status: "all" });
  const { users, isDemoData: usersDemo, notice: usersNotice, error: usersError } = useUsers();
  const [comparisonCount, setComparisonCount] = useState(0);

  useEffect(() => {
    getComparisonCount()
      .then((count) => setComparisonCount(count > 0 ? count : getDemoComparisonCount()))
      .catch(() => setComparisonCount(getDemoComparisonCount()));
  }, []);

  const notice = crmDemo
    ? crmNotice
    : propertiesDemo
      ? propertiesNotice
      : usersDemo
        ? usersNotice
        : crmError || propertiesError || usersError;

  const pipelineData = [
    { label: "New", total: leads.filter((lead) => lead.status === "new").length },
    { label: "Contacted", total: leads.filter((lead) => lead.status === "contacted").length },
    { label: "Qualified", total: leads.filter((lead) => lead.status === "qualified").length },
    { label: "Closed", total: leads.filter((lead) => lead.status === "closed").length }
  ];

  const portfolioData = properties.map((property) => ({
    name: property.title.split(" ").slice(0, 2).join(" "),
    price: property.price / 100000,
    roi: property.roiPotential ?? 0
  }));

  const viewingData = [
    { label: "Scheduled", total: viewings.filter((viewing) => viewing.status === "scheduled").length },
    { label: "Completed", total: viewings.filter((viewing) => viewing.status === "completed").length },
    { label: "Cancelled", total: viewings.filter((viewing) => viewing.status === "cancelled").length }
  ];

  return (
    <DashboardShell allowedRoles={["agent", "admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Analytics"
          title="Portfolio and CRM performance"
          description="Track inventory, lead movement, comparison usage, and viewing throughput using live collection data."
        />
        {notice && !(crmDemo || propertiesDemo || usersDemo) ? (
          <StateNotice
            tone="warning"
            title="Some analytics inputs could not be loaded"
            description={notice}
          />
        ) : null}
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Users" value={String(users.length)} description="Total user profiles in the platform." />
          <KpiCard label="Properties" value={String(properties.length)} description="Listings available across all statuses." tint="bg-sky-100/80" />
          <KpiCard label="Leads" value={String(leads.length)} description="Total CRM demand captured across the workspace." tint="bg-lime-100/80" />
          <KpiCard label="Saved comps" value={String(comparisonCount)} description="Saved comparison sets persisted by users." tint="bg-fuchsia-100/70" />
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Lead pipeline distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              {leads.length === 0 ? (
                <EmptyState
                  title="No lead analytics yet"
                  description="Lead volume appears here as soon as prospects are captured into Firestore."
                />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pipelineData}
                      dataKey="total"
                      nameKey="label"
                      innerRadius={70}
                      outerRadius={110}
                      fill="#0f172a"
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Listing valuation vs ROI</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              {properties.length === 0 ? (
                <EmptyState
                  title="No portfolio data yet"
                  description="Add listings to compare valuation and ROI visibility across the catalog."
                />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={portfolioData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Area type="monotone" dataKey="price" stroke="#38bdf8" fill="#bae6fd" />
                    <Area type="monotone" dataKey="roi" stroke="#22c55e" fill="#bbf7d0" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Viewing throughput</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            {viewings.length === 0 ? (
              <EmptyState
                title="No viewing activity yet"
                description="Scheduled and completed site visits will surface here once the CRM starts booking them."
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={viewingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Area type="monotone" dataKey="total" stroke="#0f172a" fill="#cbd5e1" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
