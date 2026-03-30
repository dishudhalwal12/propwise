export type PropertyStatus = "active" | "draft" | "sold";

export type Property = {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  location: {
    city: string;
    locality: string;
    address?: string;
  };
  amenities: string[];
  neighborhoodInfo: string;
  imageUrls: string[];
  createdBy: string;
  status: PropertyStatus;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  locationRating?: number;
  roiPotential?: number;
  monthlyRentEstimate?: number;
};

export type PropertyFilters = {
  query: string;
  city: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  amenity: string;
  sortBy: "featured" | "price-asc" | "price-desc" | "area-desc";
};

export type PropertyFormInput = Omit<Property, "id" | "createdAt" | "updatedAt" | "imageUrls"> & {
  imageUrls?: string[];
};

export type PropertyQueryOptions = {
  createdBy?: string;
  status?: PropertyStatus | "all";
  ids?: string[];
};

export type ComparisonWeights = {
  price: number;
  area: number;
  amenities: number;
  location: number;
};

export type ComparisonRecord = {
  id: string;
  userId: string;
  propertyIds: string[];
  criteriaWeights: ComparisonWeights;
  title?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};
