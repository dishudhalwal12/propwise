"use client";

import { useMemo } from "react";

import { SectionHeading } from "@/components/layout/section-heading";
import { FilterPanel } from "@/components/property/filter-panel";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StateNotice } from "@/components/ui/state-notice";
import { useProperties } from "@/hooks/useProperties";

export default function PropertiesPage() {
  const {
    properties,
    filteredProperties,
    filters,
    setFilters,
    loading,
    error,
    isDemoData
  } = useProperties({ status: "active" });

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
      <SectionHeading
        eyebrow="Listings"
        title="Browse high-signal opportunities"
        description="Use city, pricing, area, and amenity filters to move from broad search to sharp shortlist."
      />
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
