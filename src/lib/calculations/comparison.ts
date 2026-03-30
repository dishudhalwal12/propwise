import { ComparisonWeights, Property } from "@/types/property";

export const defaultComparisonWeights: ComparisonWeights = {
  price: 4,
  area: 3,
  amenities: 2,
  location: 5
};

function normalizeHigherBetter(value: number, max: number) {
  if (max <= 0) return 0;
  return Math.round((value / max) * 100);
}

function normalizeLowerBetter(value: number, min: number, max: number) {
  if (max === min) return 100;
  return Math.round(((max - value) / (max - min)) * 100);
}

export function buildComparisonScorecards(
  properties: Property[],
  weights: ComparisonWeights
) {
  if (properties.length === 0) return [];

  const prices = properties.map((property) => property.price);
  const areas = properties.map((property) => property.areaSqFt);
  const amenityCounts = properties.map((property) => property.amenities.length);
  const locationRatings = properties.map((property) => property.locationRating ?? 0);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const maxArea = Math.max(...areas);
  const maxAmenities = Math.max(...amenityCounts);
  const maxLocation = Math.max(...locationRatings);

  return properties.map((property) => {
    const price = normalizeLowerBetter(property.price, minPrice, maxPrice) * weights.price;
    const area = normalizeHigherBetter(property.areaSqFt, maxArea) * weights.area;
    const amenities =
      normalizeHigherBetter(property.amenities.length, maxAmenities) * weights.amenities;
    const location =
      normalizeHigherBetter(property.locationRating ?? 0, maxLocation) * weights.location;

    return {
      id: property.id,
      name: property.title.split(" ").slice(0, 2).join(" "),
      price,
      area,
      amenities,
      location,
      score: price + area + amenities + location
    };
  });
}
