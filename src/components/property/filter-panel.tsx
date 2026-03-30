"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyFilters } from "@/types/property";

export function FilterPanel({
  filters,
  onChange,
  cities,
  types,
  amenities
}: {
  filters: PropertyFilters;
  onChange: (value: PropertyFilters) => void;
  cities: string[];
  types: string[];
  amenities: string[];
}) {
  return (
    <Card className="sticky top-24">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-slate-950">Smart Filters</p>
            <p className="text-sm text-slate-500">Refine by city, budget, type, and amenities.</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-10"
            placeholder="Search location or project"
            value={filters.query}
            onChange={(event) => onChange({ ...filters, query: event.target.value })}
          />
        </div>

        <Select value={filters.city || "all"} onValueChange={(value) => onChange({ ...filters, city: value === "all" ? "" : value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.type || "all"} onValueChange={(value) => onChange({ ...filters, type: value === "all" ? "" : value })}>
          <SelectTrigger>
            <SelectValue placeholder="Property type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Min price"
            value={filters.minPrice}
            onChange={(event) => onChange({ ...filters, minPrice: event.target.value })}
          />
          <Input
            type="number"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={(event) => onChange({ ...filters, maxPrice: event.target.value })}
          />
          <Input
            type="number"
            placeholder="Min area"
            value={filters.minArea}
            onChange={(event) => onChange({ ...filters, minArea: event.target.value })}
          />
          <Select
            value={filters.sortBy}
            onValueChange={(value: PropertyFilters["sortBy"]) => onChange({ ...filters, sortBy: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price low to high</SelectItem>
              <SelectItem value="price-desc">Price high to low</SelectItem>
              <SelectItem value="area-desc">Largest area</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={filters.amenity || "all"} onValueChange={(value) => onChange({ ...filters, amenity: value === "all" ? "" : value })}>
          <SelectTrigger>
            <SelectValue placeholder="Amenity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any amenity</SelectItem>
            {amenities.map((amenity) => (
              <SelectItem key={amenity} value={amenity}>
                {amenity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="secondary" className="w-full" onClick={() => onChange({ ...filters, query: "", city: "", type: "", minPrice: "", maxPrice: "", minArea: "", amenity: "", sortBy: "featured" })}>
          Reset filters
        </Button>
      </CardContent>
    </Card>
  );
}
