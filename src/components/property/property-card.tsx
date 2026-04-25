"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, BedDouble, Bath, Building2, MapPin } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCompareSelection } from "@/hooks/useCompareSelection";
import { formatCurrency } from "@/lib/utils";
import { Property } from "@/types/property";

export function PropertyCard({ property }: { property: Property }) {
  const { selectedIds, toggle } = useCompareSelection();
  const selected = selectedIds.includes(property.id);

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
      <Card className="overflow-hidden">
        <div className="relative h-64">
          <Image src={property.imageUrls[0]} alt={property.title} fill className="object-cover" />
          <div className="absolute inset-x-4 top-4 flex items-start justify-between">
            <Badge variant="outline" className="bg-white/80 backdrop-blur-xl dark:bg-white/5">
              {property.type}
            </Badge>
            <Badge variant="mint" className="bg-white/85">
              ROI {property.roiPotential ?? 0}%
            </Badge>
          </div>
        </div>
        <CardContent className="space-y-5 p-6">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">{property.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {property.location.locality}, {property.location.city}
                </div>
              </div>
              <p className="text-right text-lg font-semibold text-slate-950 dark:text-white">
                {formatCurrency(property.price)}
              </p>
            </div>
            <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{property.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-[24px] bg-slate-50/80 p-4 text-sm text-muted-foreground dark:bg-white/5">
            <div className="flex items-center gap-2">
              <BedDouble className="h-4 w-4" />
              {property.bedrooms} Beds
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-4 w-4" />
              {property.bathrooms} Baths
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {property.areaSqFt} sq.ft
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {property.amenities.slice(0, 4).map((amenity) => (
              <Badge key={amenity} variant="outline">
                {amenity}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1" asChild>
              <Link href={`/properties/${property.id}`}>
                View details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant={selected ? "default" : "secondary"}
              className="flex-1"
              onClick={() => toggle(property.id)}
            >
              <BarChart3 className="h-4 w-4" />
              {selected ? "Added to compare" : "Add to compare"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
