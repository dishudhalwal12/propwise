import { ArrowUpRight, Building2, IndianRupee, MapPin, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Property } from "@/types/property";

const rows = [
  { key: "price", label: "Price", icon: IndianRupee },
  { key: "areaSqFt", label: "Area", icon: Building2 },
  { key: "locationRating", label: "Location score", icon: MapPin },
  { key: "roiPotential", label: "ROI potential", icon: ArrowUpRight },
  { key: "amenities", label: "Amenity count", icon: Sparkles }
] as const;

export function ComparisonTable({ properties }: { properties: Property[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparison matrix</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead>
            <tr>
              <th className="pb-4 text-left font-medium text-muted-foreground">Metric</th>
              {properties.map((property) => (
                <th key={property.id} className="pb-4 px-4 text-left font-medium text-muted-foreground">
                  {property.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {rows.map((row) => {
              const Icon = row.icon;
              return (
                <tr key={row.key}>
                  <td className="py-4 pr-6 font-medium text-foreground dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {row.label}
                    </div>
                  </td>
                  {properties.map((property) => {
                    const value =
                      row.key === "price"
                        ? formatCurrency(property.price)
                        : row.key === "amenities"
                          ? property.amenities.length
                          : row.key === "areaSqFt"
                            ? `${property.areaSqFt} sq.ft`
                            : row.key === "roiPotential"
                              ? `${property.roiPotential ?? 0}%`
                              : property.locationRating ?? 0;
                    return (
                      <td key={`${property.id}-${row.key}`} className="px-4 py-4 text-muted-foreground">
                        {value}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
