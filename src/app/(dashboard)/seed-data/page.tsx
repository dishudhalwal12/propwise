"use client";

import { useState } from "react";
import { CheckCircle2, Database, Loader2, Sparkles } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { demoProperties } from "@/data/demo";
import { createProperty } from "@/lib/firestore/properties";
import { PropertyFormInput } from "@/types/property";

export default function SeedDataPage() {
  const { profile } = useAuth();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  async function handleSeed() {
    if (!profile) {
      setMessage("You must be logged in to seed data.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setProgress(0);
    setMessage("");

    try {
      let count = 0;
      for (const property of demoProperties) {
        // Prepare payload for Firestore
        const { id, createdAt, updatedAt, ...rest } = property;
        const payload: PropertyFormInput = {
          ...rest,
          createdBy: profile.uid, // Assign to current user
          status: "active" // Ensure they are visible
        };

        await createProperty(payload);
        count++;
        setProgress(Math.round((count / demoProperties.length) * 100));
      }

      setStatus("success");
      setMessage(`Successfully seeded ${count} premium properties to your live database.`);
    } catch (error) {
      console.error("Seeding failed:", error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "An unexpected error occurred while seeding.");
    }
  }

  return (
    <DashboardShell allowedRoles={["admin", "property_manager", "agent"]}>
      <div className="mx-auto max-w-2xl space-y-8 py-12">
        <PageHeader
          eyebrow="Setup & Diagnostics"
          title="Initialize Premium Inventory"
          description="Populate your Firestore instance with curated, high-quality property mockups to validate listing rendering and search logic."
        />

        <Card className="overflow-hidden border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          <div className="h-2 w-full bg-slate-100">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <CardHeader className="pb-4">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              {status === "loading" ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : status === "success" ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <Database className="h-6 w-6" />
              )}
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
              Live Database Seeding
            </CardTitle>
            <CardDescription className="text-slate-500">
              This process will add {demoProperties.length} realistic property listings to your account. 
              These will appear in your management dashboard and public search results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-2xl bg-slate-50 p-6">
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Premium high-resolution Unsplash imagery
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Realistic pricing and ROI projections
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Detailed location metadata and amenities
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Associated with your account: <span className="font-mono text-indigo-600">{profile?.email || "..."}</span>
                </li>
              </ul>
            </div>

            {message && (
              <div className={`rounded-xl p-4 text-sm font-medium ${
                status === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : 
                status === "error" ? "bg-rose-50 text-rose-700 border border-rose-100" : 
                "bg-indigo-50 text-indigo-700 border border-indigo-100"
              }`}>
                {message}
              </div>
            )}

            <Button 
              onClick={handleSeed} 
              disabled={status === "loading" || status === "success"}
              className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800 transition-colors rounded-xl font-semibold"
            >
              {status === "loading" ? `Seeding Properties (${progress}%)...` : 
               status === "success" ? "Database Initialized" : 
               "Populate Live Inventory"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
