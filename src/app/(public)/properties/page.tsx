"use client";

import { useMemo, useState } from "react";

import { SectionHeading } from "@/components/layout/section-heading";
import { FilterPanel } from "@/components/property/filter-panel";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyDialog } from "@/components/property/property-dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StateNotice } from "@/components/ui/state-notice";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperties";
import { createProperty, deleteProperty } from "@/lib/firestore/properties";
import { demoProperties } from "@/data/demo";
import { PropertyFormInput } from "@/types/property";

export default function PropertiesPage() {
  const { user } = useAuth();
  const {
    properties,
    filteredProperties,
    filters,
    setFilters,
    loading,
    error,
    isDemoData,
    notice,
    refetch
  } = useProperties({ status: "active" });

  const [isCleaning, setIsCleaning] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    if (!user) return;
    setIsSeeding(true);
    try {
      for (const property of demoProperties) {
        const { id, createdAt, updatedAt, ...rest } = property;
        const payload: PropertyFormInput = {
          ...rest,
          createdBy: user.uid,
          status: "active"
        };
        await createProperty(payload);
      }
      await refetch();
      alert("Successfully seeded 18 properties!");
    } catch (err) {
      alert("Seeding failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCleanupDuplicates = async () => {
    if (!user) return;
    setIsCleaning(true);
    try {
      const seen = new Set<string>();
      const toDelete = [];

      // Sort by createdAt ASC so we keep the OLDEST entry
      const sorted = [...properties].sort((a, b) => {
        const timeA = new Date(a.createdAt ?? 0).getTime();
        const timeB = new Date(b.createdAt ?? 0).getTime();
        return timeA - timeB;
      });

      for (const property of sorted) {
        const key = `${property.title}|${property.location.city}|${property.location.locality}`;
        if (seen.has(key)) {
          toDelete.push(property);
        } else {
          seen.add(key);
        }
      }

      if (toDelete.length === 0) {
        alert("No duplicate properties found in the current view.");
        return;
      }

      if (!confirm(`Found ${toDelete.length} duplicates. Proceed with deletion?`)) {
        return;
      }

      for (const property of toDelete) {
        await deleteProperty(property.id, []);
      }
      
      await refetch();
      alert(`Successfully removed ${toDelete.length} duplicate entries.`);
    } catch (err) {
      alert("Cleanup failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsCleaning(false);
    }
  };

  const cities = useMemo(
    () => Array.from(new Set(properties.map((property) => property.location.city))),
    [properties]
  );
  const types = useMemo(
    () => Array.from(new Set(properties.map((property) => property.type))),
    [properties]
  );
  const amenities = useMemo(
    () =>
      Array.from(
        new Set(properties.flatMap((property) => property.amenities))
      ).sort((first, second) => first.localeCompare(second)),
    [properties]
  );

  return (
    <main className="container-shell py-12 lg:py-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Listings"
          title="Browse high-signal opportunities"
          description="Use city, pricing, area, and amenity filters to move from broad search to sharp shortlist."
        />
        {user ? (
          <div className="flex shrink-0 items-center gap-3">
            <Button onClick={handleCleanupDuplicates} variant="outline" size="sm" disabled={isCleaning || isSeeding}>
              {isCleaning ? "Cleaning..." : "Clean Duplicates"}
            </Button>
            <Button onClick={handleSeed} variant="outline" size="sm" disabled={isCleaning || isSeeding}>
              {isSeeding ? "Seeding..." : "Seed Mock Data"}
            </Button>
            <PropertyDialog onSuccess={refetch} />
          </div>
        ) : null}
      </div>
      {notice ? (
        <div className="mt-6">
          <StateNotice
            tone="info"
            title="Market Notice"
            description={notice}
          />
        </div>
      ) : null}
      {error && !isDemoData ? (
        <div className="mt-8">
          <StateNotice
            tone="warning"
            title="Live listings could not be loaded"
            description={error}
          />
        </div>
      ) : null}
      <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          cities={cities}
          types={types}
          amenities={amenities}
        />

        <div className="space-y-6">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-[520px] w-full rounded-[28px]" />
              ))}
            </div>
          ) : error && filteredProperties.length === 0 ? (
            <EmptyState
              title="Unable to load properties"
              description={error}
              action={<Button variant="secondary" onClick={() => window.location.reload()}>Reload</Button>}
            />
          ) : filteredProperties.length === 0 ? (
            <EmptyState
              title="No properties found"
              description="Try widening your budget, switching cities, or clearing a few filters to reveal more opportunities."
              action={
                <Button
                  variant="secondary"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      query: "",
                      city: "",
                      type: "",
                      minPrice: "",
                      maxPrice: "",
                      minArea: "",
                      amenity: "",
                      sortBy: "featured"
                    })
                  }
                >
                  Reset filters
                </Button>
              }
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
