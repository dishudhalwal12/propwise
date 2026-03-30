"use client";

import Link from "next/link";

import { KpiCard } from "@/components/analytics/kpi-card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StateNotice } from "@/components/ui/state-notice";
import { useAuth } from "@/hooks/useAuth";
import { useComparisons } from "@/hooks/useComparisons";
import { useProperties } from "@/hooks/useProperties";
import { formatDateTime } from "@/lib/utils";

export default function BuyerDashboardPage() {
  const { profile } = useAuth();
  const {
    filteredProperties,
    loading: propertiesLoading,
    error: propertiesError,
    isDemoData: propertiesDemo
  } = useProperties({ status: "active" });
  const {
    comparisons,
    loading: comparisonsLoading,
    isDemoData: comparisonsDemo
  } = useComparisons(profile?.uid);
  const topProperties = filteredProperties.slice(0, 2);
  const dashboardNotice =
    propertiesDemo || comparisonsDemo ? "" : propertiesError;

  return (
    <DashboardShell allowedRoles={["buyer", "investor"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Buyer dashboard"
          title={`Welcome back, ${profile?.fullName?.split(" ")[0] ?? "there"}`}
          description="Track your live shortlist, reopen saved comparisons, and keep the next property decision in motion."
          actions={
            <>
              <Button asChild>
                <Link href="/properties">Explore listings</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/compare">Open compare workspace</Link>
              </Button>
            </>
          }
        />

        {dashboardNotice ? (
          <StateNotice
            tone="warning"
            title="Some live data could not be loaded"
            description={dashboardNotice}
          />
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard
            label="Saved comparisons"
            value={String(comparisons.length)}
            description="Comparison sets you can reopen and refine."
            tint="bg-sky-100/80"
          />
          <KpiCard
            label="Available listings"
            value={String(filteredProperties.length)}
            description="Active properties currently discoverable from Firestore."
            tint="bg-lime-100/80"
          />
          <KpiCard
            label="Best visible ROI"
            value={`${Math.max(...filteredProperties.map((property) => property.roiPotential ?? 0), 0)}%`}
            description="Highest ROI potential across your active catalog right now."
            tint="bg-fuchsia-100/70"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Suggested properties</CardTitle>
            </CardHeader>
            <CardContent>
              {propertiesLoading ? (
                <div className="grid gap-6 2xl:grid-cols-2">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton key={index} className="h-[470px] rounded-[28px]" />
                  ))}
                </div>
              ) : topProperties.length === 0 ? (
                <EmptyState
                  title="No active properties yet"
                  description="Once listings are added to Firestore, buyer recommendations will appear here."
                  action={
                    <Button variant="secondary" asChild>
                      <Link href="/properties">Visit listings</Link>
                    </Button>
                  }
                />
              ) : (
                <div className="grid gap-6 2xl:grid-cols-2">
                  {topProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent comparison activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comparisonsLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-24 rounded-[24px]" />
                  ))
                ) : comparisons.length === 0 ? (
                  <EmptyState
                    title="No saved comparisons yet"
                    description="Compare two or more properties and save the result to build a living shortlist."
                    action={
                      <Button asChild>
                        <Link href="/compare">Start comparing</Link>
                      </Button>
                    }
                  />
                ) : (
                  comparisons.slice(0, 4).map((comparison) => (
                    <div key={comparison.id} className="rounded-[24px] bg-slate-50/80 p-5 text-sm leading-7 text-slate-600">
                      <p className="font-medium text-slate-950">
                        {comparison.propertyIds.length} properties compared
                      </p>
                      <p className="mt-1">
                        Saved {comparison.createdAt ? formatDateTime(comparison.createdAt) : "recently"}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next best actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button asChild>
                  <Link href="/calculator">Run calculators</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/properties">Browse more properties</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
