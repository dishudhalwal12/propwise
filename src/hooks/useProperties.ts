"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getDemoProperties } from "@/data/demo";
import { getProperties } from "@/lib/firestore/properties";
import { Property, PropertyFilters, PropertyQueryOptions } from "@/types/property";

const defaultFilters: PropertyFilters = {
  query: "",
  city: "",
  type: "",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  amenity: "",
  sortBy: "featured"
};

export function useProperties(options?: PropertyQueryOptions) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDemoData, setIsDemoData] = useState(false);
  const [notice, setNotice] = useState("");

  const serializedOptions = JSON.stringify(options ?? {});
  const requestOptions = useMemo(
    () => JSON.parse(serializedOptions) as PropertyQueryOptions,
    [serializedOptions]
  );

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const nextProperties = await getProperties(requestOptions);
      if (nextProperties.length > 0) {
        setProperties(nextProperties);
        setIsDemoData(false);
        setNotice("");
      } else {
        setProperties(getDemoProperties(requestOptions));
        setIsDemoData(true);
        setNotice("Showing staged inventory because no live listings are available yet.");
      }
    } catch (fetchError) {
      setProperties(getDemoProperties(requestOptions));
      setIsDemoData(true);
      setNotice("Showing staged inventory while live property data is temporarily unavailable.");
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load properties.");
    } finally {
      setLoading(false);
    }
  }, [requestOptions]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const filteredProperties = useMemo(() => {
    const next = properties.filter((property) => {
      const matchesQuery =
        !filters.query ||
        `${property.title} ${property.location.city} ${property.location.locality}`
          .toLowerCase()
          .includes(filters.query.toLowerCase());
      const matchesCity = !filters.city || property.location.city === filters.city;
      const matchesType = !filters.type || property.type === filters.type;
      const matchesMinPrice = !filters.minPrice || property.price >= Number(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || property.price <= Number(filters.maxPrice);
      const matchesMinArea = !filters.minArea || property.areaSqFt >= Number(filters.minArea);
      const matchesAmenity =
        !filters.amenity || property.amenities.includes(filters.amenity);

      return (
        matchesQuery &&
        matchesCity &&
        matchesType &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesMinArea &&
        matchesAmenity
      );
    });

    return next.sort((first, second) => {
      switch (filters.sortBy) {
        case "price-asc":
          return first.price - second.price;
        case "price-desc":
          return second.price - first.price;
        case "area-desc":
          return second.areaSqFt - first.areaSqFt;
        default:
          return (second.locationRating ?? 0) - (first.locationRating ?? 0);
      }
    });
  }, [filters, properties]);

  return {
    properties,
    filteredProperties,
    filters,
    setFilters,
    loading,
    error,
    isDemoData,
    notice,
    refetch,
    setProperties
  };
}
