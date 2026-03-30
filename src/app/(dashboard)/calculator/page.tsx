"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { StateNotice } from "@/components/ui/state-notice";
import { useProperties } from "@/hooks/useProperties";
import { calculateEmi } from "@/lib/calculations/emi";
import { calculateRoi } from "@/lib/calculations/roi";
import { calculateRentalYield } from "@/lib/calculations/rental-yield";
import { formatCurrency } from "@/lib/utils";

function validatePositiveNumbers(values: number[]) {
  return values.every((value) => Number.isFinite(value) && value > 0);
}

export default function CalculatorPage() {
  const searchParams = useSearchParams();
  const { properties, error, isDemoData } = useProperties({ status: "active" });
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [emiInput, setEmiInput] = useState({
    propertyPrice: 12500000,
    downPayment: 2500000,
    annualRate: 8.5,
    tenureYears: 20
  });
  const [roiInput, setRoiInput] = useState({
    purchasePrice: 12500000,
    appreciationRate: 6,
    holdingYears: 8,
    annualIncome: 480000
  });
  const [yieldInput, setYieldInput] = useState({
    propertyPrice: 12500000,
    monthlyRent: 42000
  });

  useEffect(() => {
    const id = searchParams.get("propertyId");
    if (id) {
      setSelectedPropertyId(id);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!selectedPropertyId && properties.length > 0) {
      setSelectedPropertyId(properties[0].id);
    }
  }, [properties, selectedPropertyId]);

  useEffect(() => {
    if (!selectedPropertyId) return;
    const property = properties.find((entry) => entry.id === selectedPropertyId);
    if (!property) return;

    setEmiInput((current) => ({
      ...current,
      propertyPrice: property.price,
      downPayment: Math.round(property.price * 0.2)
    }));
    setRoiInput((current) => ({
      ...current,
      purchasePrice: property.price,
      annualIncome: (property.monthlyRentEstimate ?? 0) * 12
    }));
    setYieldInput({
      propertyPrice: property.price,
      monthlyRent: property.monthlyRentEstimate ?? 0
    });
  }, [properties, selectedPropertyId]);

  const emi = useMemo(() => calculateEmi(emiInput), [emiInput]);
  const roi = useMemo(() => calculateRoi(roiInput), [roiInput]);
  const rentalYield = useMemo(() => calculateRentalYield(yieldInput), [yieldInput]);

  const emiValid = validatePositiveNumbers([
    emiInput.propertyPrice,
    emiInput.annualRate,
    emiInput.tenureYears
  ]);
  const roiValid = validatePositiveNumbers([
    roiInput.purchasePrice,
    roiInput.holdingYears
  ]);
  const yieldValid = validatePositiveNumbers([
    yieldInput.propertyPrice,
    yieldInput.monthlyRent
  ]);

  return (
    <DashboardShell allowedRoles={["buyer", "investor", "agent", "admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Calculator"
          title="Financial clarity for every property decision"
          description="Seed the calculators from a live property, then explore affordability, ROI, and rental performance with guardrailed inputs."
        />

        {error && !isDemoData ? (
          <StateNotice
            tone="warning"
            title="Property-backed presets are temporarily unavailable"
            description={error}
          />
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Seed from a property</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-[320px_1fr] lg:items-center">
            <Select value={selectedPropertyId || "none"} onValueChange={(value) => setSelectedPropertyId(value === "none" ? "" : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Manual values</SelectItem>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm leading-7 text-slate-600">
              Selecting a listing will prefill the property price and rent estimate using the live Firestore record so the calculators stay grounded in the current inventory.
            </p>
          </CardContent>
        </Card>
        <div className="grid gap-6 xl:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>EMI calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(emiInput).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium capitalize text-slate-700">{key}</label>
                  <Input
                    type="number"
                    value={value}
                    min={0}
                    onChange={(event) =>
                      setEmiInput((current) => ({ ...current, [key]: Number(event.target.value) }))
                    }
                  />
                </div>
              ))}
              {!emiValid ? (
                <p className="text-sm text-rose-600">
                  Property price, interest rate, and tenure must all be positive to calculate EMI.
                </p>
              ) : null}
              <div className="rounded-[24px] bg-slate-50/80 p-5">
                <p className="text-sm text-slate-500">Monthly EMI</p>
                <p className="mt-2 font-display text-4xl font-semibold text-slate-950">
                  {formatCurrency(emi.emi)}
                </p>
                <p className="mt-3 text-sm text-slate-600">
                  Total payment: {formatCurrency(emi.totalPayment)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ROI projection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(roiInput).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium capitalize text-slate-700">{key}</label>
                  <Input
                    type="number"
                    value={value}
                    min={0}
                    onChange={(event) =>
                      setRoiInput((current) => ({ ...current, [key]: Number(event.target.value) }))
                    }
                  />
                </div>
              ))}
              {!roiValid ? (
                <p className="text-sm text-rose-600">
                  Purchase price and holding period must be positive to project ROI.
                </p>
              ) : null}
              <div className="rounded-[24px] bg-sky-100/70 p-5">
                <p className="text-sm text-slate-500">Projected ROI</p>
                <p className="mt-2 font-display text-4xl font-semibold text-slate-950">
                  {roi.roiPercent.toFixed(1)}%
                </p>
                <p className="mt-3 text-sm text-slate-600">
                  Profit outlook: {formatCurrency(roi.profit)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rental yield</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(yieldInput).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium capitalize text-slate-700">{key}</label>
                  <Input
                    type="number"
                    value={value}
                    min={0}
                    onChange={(event) =>
                      setYieldInput((current) => ({ ...current, [key]: Number(event.target.value) }))
                    }
                  />
                </div>
              ))}
              {!yieldValid ? (
                <p className="text-sm text-rose-600">
                  Property price and monthly rent must be positive to estimate rental yield.
                </p>
              ) : null}
              <div className="rounded-[24px] bg-lime-100/70 p-5">
                <p className="text-sm text-slate-500">Yield</p>
                <p className="mt-2 font-display text-4xl font-semibold text-slate-950">
                  {rentalYield.yieldPercent.toFixed(2)}%
                </p>
                <p className="mt-3 text-sm text-slate-600">
                  Annual rent: {formatCurrency(rentalYield.annualRent)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
