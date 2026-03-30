import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/property";

export function HeatmapGrid({ properties }: { properties: Property[] }) {
  const maxPrice = Math.max(...properties.map((property) => property.price));
  const maxArea = Math.max(...properties.map((property) => property.areaSqFt));
  const maxAmenities = Math.max(...properties.map((property) => property.amenities.length));
  const maxLocation = Math.max(...properties.map((property) => property.locationRating ?? 0));

  const metrics = [
    {
      label: "Price efficiency",
      score: (property: Property) => Math.round((1 - property.price / maxPrice) * 100)
    },
    {
      label: "Area value",
      score: (property: Property) => Math.round((property.areaSqFt / maxArea) * 100)
    },
    {
      label: "Amenities",
      score: (property: Property) => Math.round((property.amenities.length / maxAmenities) * 100)
    },
    {
      label: "Location",
      score: (property: Property) => Math.round(((property.locationRating ?? 0) / maxLocation) * 100)
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Strength heatmap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="grid gap-3 md:grid-cols-[180px_repeat(4,1fr)]">
            <p className="text-sm font-medium text-slate-600">{metric.label}</p>
            {properties.map((property) => {
              const score = metric.score(property);
              return (
                <div
                  key={`${property.id}-${metric.label}`}
                  className="rounded-[22px] px-4 py-3 text-sm font-semibold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-transform duration-300 hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, rgba(212, 255, 236, ${Math.max(
                      score / 130,
                      0.18
                    )}), rgba(196, 231, 255, 0.38))`
                  }}
                >
                  {property.title.split(" ").slice(0, 2).join(" ")}: {score}%
                </div>
              );
            })}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
