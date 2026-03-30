"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { RotateCcw, Save } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { ComparisonTable } from "@/components/property/comparison-table";
import { HeatmapGrid } from "@/components/property/heatmap-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { StateNotice } from "@/components/ui/state-notice";
import { useAuth } from "@/hooks/useAuth";
import { useComparisons } from "@/hooks/useComparisons";
import { useCompareSelection } from "@/hooks/useCompareSelection";
import { useProperties } from "@/hooks/useProperties";
import {
  buildComparisonScorecards,
  defaultComparisonWeights
} from "@/lib/calculations/comparison";
import { saveComparison } from "@/lib/firestore/comparisons";

export default function ComparePage() {
  const { profile } = useAuth();
  const {
    properties,
    isDemoData: propertiesDemo,
    error: propertiesError
  } = useProperties({ status: "active" });
  const {
    comparisons,
    refetch,
    setComparisons,
    isDemoData: comparisonsDemo,
    error: comparisonsError
  } = useComparisons(profile?.uid);
  const { selectedIds, clear, replace } = useCompareSelection();
  const [weights, setWeights] = useState(defaultComparisonWeights);
  const [feedback, setFeedback] = useState("");
  const [activeComparisonId, setActiveComparisonId] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedProperties = useMemo(
    () => properties.filter((property) => selectedIds.includes(property.id)),
    [properties, selectedIds]
  );
  const fallbackSelection = useMemo(() => properties.slice(0, 3), [properties]);
  const comparisonProperties =
    selectedProperties.length >= 2 && selectedProperties.length <= 4
      ? selectedProperties
      : fallbackSelection;

  useEffect(() => {
    setFeedback("");
  }, [selectedIds]);

  const scorecards = useMemo(
    () => buildComparisonScorecards(comparisonProperties, weights),
    [comparisonProperties, weights]
  );

  async function handleSave() {
    if (!profile || selectedProperties.length < 2 || selectedProperties.length > 4) {
      setFeedback("Select between 2 and 4 properties before saving a comparison.");
      return;
    }

    startTransition(async () => {
      try {
        await saveComparison({
          userId: profile.uid,
          propertyIds: selectedProperties.map((property) => property.id),
          criteriaWeights: weights,
          title: selectedProperties.map((property) => property.title.split(" ")[0]).join(" vs ")
        });
        await refetch();
        setFeedback("Comparison saved to Firestore.");
      } catch (error) {
        if (comparisonsDemo || propertiesDemo) {
          setComparisons((current) => [
            {
              id: `cmp_local_${Date.now()}`,
              userId: profile.uid,
              propertyIds: selectedProperties.map((property) => property.id),
              criteriaWeights: weights,
              title: selectedProperties.map((property) => property.title.split(" ")[0]).join(" vs "),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            ...current
          ]);
          setFeedback("Comparison saved locally.");
          return;
        }

        setFeedback(error instanceof Error ? error.message : "Unable to save comparison.");
      }
    });
  }

  function restoreComparison(comparisonId: string) {
    const comparison = comparisons.find((entry) => entry.id === comparisonId);
    if (!comparison) return;
    replace(comparison.propertyIds);
    setWeights(comparison.criteriaWeights);
    setActiveComparisonId(comparison.id);
    setFeedback("Saved comparison restored.");
  }

  return (
    <DashboardShell allowedRoles={["buyer", "investor", "agent", "admin", "property_manager"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Compare"
          title="Decision-grade property comparison"
          description="Select 2 to 4 properties from listings or reopen a saved set. The charts and table below re-score automatically as you adjust the weighting."
          actions={
            <>
              <Button variant="secondary" onClick={clear}>
                <RotateCcw className="h-4 w-4" />
                Clear selection
              </Button>
              <Button onClick={handleSave} disabled={isPending}>
                <Save className="h-4 w-4" />
                Save comparison
              </Button>
            </>
          }
        />

        {(propertiesError || comparisonsError) && !(propertiesDemo || comparisonsDemo) ? (
          <StateNotice
            tone="warning"
            title="Comparison data could not be fully loaded"
            description={propertiesError || comparisonsError}
          />
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <Card>
            <CardHeader>
              <CardTitle>Criteria weights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(weights).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium capitalize text-slate-700">{key}</label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={value}
                    onChange={(event) =>
                      setWeights((current) => ({
                        ...current,
                        [key]: Math.max(1, Math.min(5, Number(event.target.value || 1)))
                      }))
                    }
                  />
                </div>
              ))}
              <p className="text-sm text-slate-500">
                Weights control how strongly each metric shapes the final ranking.
              </p>
              {feedback ? <p className="text-sm text-slate-600">{feedback}</p> : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weighted score summary</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              {comparisonProperties.length >= 2 && comparisonProperties.length <= 4 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scorecards}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="score" fill="#0f172a" radius={[14, 14, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState
                  title="Pick 2 to 4 properties"
                  description="Add listings to compare from the public property pages or reopen one of your saved comparison sets."
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Saved comparisons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {comparisons.length === 0 ? (
                <EmptyState
                  title="No saved comparisons yet"
                  description="Save a comparison once you have a valid 2-4 property selection."
                />
              ) : (
                comparisons.map((comparison) => (
                  <button
                    key={comparison.id}
                    onClick={() => restoreComparison(comparison.id)}
                    className={`w-full rounded-[24px] border p-5 text-left transition ${
                      activeComparisonId === comparison.id
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-200 bg-slate-50/80 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <p className="font-medium">
                      {comparison.title ?? `${comparison.propertyIds.length} property comparison`}
                    </p>
                    <p className="mt-1 text-sm opacity-80">
                      {comparison.propertyIds.length} properties · saved comparison
                    </p>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          {comparisonProperties.length >= 2 && comparisonProperties.length <= 4 ? (
            <Card>
              <CardHeader>
                <CardTitle>Criteria radar</CardTitle>
              </CardHeader>
              <CardContent className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={scorecards}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <Radar dataKey="price" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.15} />
                    <Radar dataKey="area" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} />
                    <Radar dataKey="location" stroke="#d946ef" fill="#d946ef" fillOpacity={0.12} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {comparisonProperties.length >= 2 && comparisonProperties.length <= 4 ? (
          <>
            <div className="grid gap-4 md:hidden">
              {comparisonProperties.map((property, index) => (
                <Card key={property.id}>
                  <CardContent className="space-y-3 p-5">
                    <p className="font-display text-2xl font-semibold text-slate-950">
                      {property.title}
                    </p>
                    <p className="text-sm text-slate-600">
                      Weighted score {scorecards[index]?.score ?? 0}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ComparisonTable properties={comparisonProperties} />
            <HeatmapGrid properties={comparisonProperties} />
          </>
        ) : null}
      </div>
    </DashboardShell>
  );
}
