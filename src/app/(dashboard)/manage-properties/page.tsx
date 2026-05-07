"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { isDemoRecord } from "@/data/demo";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { StateNotice } from "@/components/ui/state-notice";
import { PropertyForm } from "@/components/property/property-form";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperties";
import {
  createProperty,
  deleteProperty
} from "@/lib/firestore/properties";
import { demoProperties } from "@/data/demo";
import { Property, PropertyFormInput } from "@/types/property";

export default function ManagePropertiesPage() {
  const { profile } = useAuth();
  const queryOptions =
    profile?.role === "property_manager"
      ? { createdBy: profile.uid, status: "all" as const }
      : { status: "all" as const };
  const { properties, refetch, error, setProperties, isDemoData } = useProperties(queryOptions);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isPending, startTransition] = useTransition();

  const visibleProperties = useMemo(
    () =>
      properties.filter((property) =>
        `${property.title} ${property.location.city} ${property.location.locality}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [properties, search]
  );

  function handleDelete(property: Property) {
    startTransition(async () => {
      try {
        if (isDemoRecord(property.id)) {
          setProperties((current) => current.filter((entry) => entry !== property));
          if (editingProperty?.id === property.id) {
            setEditingProperty(null);
          }
          setMessage("Property removed from the current view.");
          return;
        }

        await deleteProperty(property.id, property.imageUrls);
        if (editingProperty?.id === property.id) {
          setEditingProperty(null);
        }
        await refetch();
        setMessage("Property deleted.");
      } catch (deleteError) {
        setMessage(
          deleteError instanceof Error ? deleteError.message : "Unable to delete property."
        );
      }
    });
  }

  async function handleSeed() {
    if (!profile) return;
    
    startTransition(async () => {
      try {
        setMessage("Seeding 18 premium properties...");
        for (const property of demoProperties) {
          const { id, createdAt, updatedAt, ...rest } = property;
          const payload: PropertyFormInput = {
            ...rest,
            createdBy: profile.uid,
            status: "active"
          };
          await createProperty(payload);
        }
        await refetch();
        setMessage("Successfully seeded 18 properties to your live database.");
      } catch (error) {
        setMessage("Seeding failed: " + (error instanceof Error ? error.message : "Unknown error"));
      }
    });
  }

  async function handleCleanupDuplicates() {
    if (!profile) return;

    startTransition(async () => {
      try {
        setMessage("Analyzing inventory for duplicates...");
        const seen = new Set<string>();
        const toDelete: Property[] = [];

        // We use a reverse chronological sort from useProperties, 
        // so we process the NEWEST ones first if we just iterate.
        // Let's sort them by createdAt ASC to keep the original ones.
        const sorted = [...properties].sort((a, b) => {
          const timeA = new Date(a.createdAt ?? 0).getTime();
          const timeB = new Date(b.createdAt ?? 0).getTime();
          return timeA - timeB;
        });

        for (const property of sorted) {
          const key = `${property.title}-${property.location.city}-${property.location.locality}`;
          if (seen.has(key)) {
            toDelete.push(property);
          } else {
            seen.add(key);
          }
        }

        if (toDelete.length === 0) {
          setMessage("No duplicate properties found.");
          return;
        }

        setMessage(`Deleting ${toDelete.length} duplicates...`);
        for (const property of toDelete) {
          // Note: We don't delete images for duplicates since they share the same URLs
          // and we want to keep the images for the remaining property.
          // However, deleteProperty in firestore/properties.ts deletes images.
          // I should call deleteDoc directly here or modify deleteProperty.
          // Actually, since they use demo URLs (Unsplash), they aren't in Firebase Storage.
          // But for safety, I'll use a direct delete if they are demo records.
          await deleteProperty(property.id, []); 
        }

        await refetch();
        setMessage(`Cleaned up ${toDelete.length} duplicate entries.`);
      } catch (error) {
        setMessage("Cleanup failed: " + (error instanceof Error ? error.message : "Unknown error"));
      }
    });
  }

  return (
    <DashboardShell allowedRoles={["property_manager", "admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Property management"
          title="Create, refine, and govern listing quality"
          description="Inventory edits, image updates, and lifecycle status changes all persist to Firestore and Storage from this workspace."
          actions={
            <div className="flex gap-3">
              <Button onClick={handleCleanupDuplicates} variant="outline" disabled={isPending}>
                {isPending ? "Cleaning..." : "Clean Duplicates"}
              </Button>
              <Button onClick={handleSeed} variant="outline" disabled={isPending}>
                {isPending ? "Seeding..." : "Seed Mock Data"}
              </Button>
              <Button asChild variant="secondary">
                <Link href="/properties">View public listings</Link>
              </Button>
            </div>
          }
        />
        {error && !isDemoData ? (
          <StateNotice
            tone="warning"
            title="Live inventory could not be loaded"
            description={error}
          />
        ) : null}
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>{editingProperty ? "Edit property" : "Add property"}</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyForm
                property={editingProperty}
                onSuccess={() => {
                  setMessage(editingProperty ? "Property updated." : "Property created.");
                  setEditingProperty(null);
                  void refetch();
                }}
                onCancel={editingProperty ? () => setEditingProperty(null) : undefined}
              />
              {message ? <p className="mt-4 text-sm text-slate-600 font-medium">{message}</p> : null}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Managed inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Search by project or locality"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                {error && visibleProperties.length === 0 ? (
                  <EmptyState title="Unable to load inventory" description={error} />
                ) : visibleProperties.length === 0 ? (
                  <EmptyState
                    title="No managed properties yet"
                    description="Once inventory is created for this role, it will appear here for editing and lifecycle management."
                  />
                ) : (
                  visibleProperties.map((property) => (
                    <div key={property.id} className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium text-slate-950">{property.title}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {property.location.locality}, {property.location.city} · {property.status}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button type="button" size="sm" variant="secondary" onClick={() => setEditingProperty(property)}>
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button type="button" size="sm" onClick={() => handleDelete(property)}>
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
