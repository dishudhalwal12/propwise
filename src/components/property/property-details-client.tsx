"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Building2, Home, MapPin, MessageSquarePlus, Wallet } from "lucide-react";

import { getDemoPropertyById } from "@/data/demo";
import { createLead } from "@/lib/firestore/crm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { getPropertyById } from "@/lib/firestore/properties";
import { toggleCompareSelection } from "@/lib/compare";
import { formatCurrency } from "@/lib/utils";
import { Property } from "@/types/property";

export function PropertyDetailsClient({ id }: { id: string }) {
  const { profile } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getPropertyById(id)
      .then((entry) => {
        const nextProperty = entry ?? getDemoPropertyById(id);
        setProperty(nextProperty);
      })
      .catch(() => {
        const fallback = getDemoPropertyById(id);
        if (fallback) {
          setProperty(fallback);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[380px] w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!property) {
    return (
      <EmptyState
        title="Property unavailable"
        description="This listing may have been removed or is no longer active."
        action={
          <Button asChild>
            <Link href="/properties">Back to listings</Link>
          </Button>
        }
      />
    );
  }

  const currentProperty = property;

  async function handleLeadRequest() {
    if (!profile) return;

    try {
      await createLead({
        name: profile.fullName,
        email: profile.email,
        phone: profile.phone ?? "",
        source: "Property detail inquiry",
        priority: "medium",
        budgetMin: Math.max(currentProperty.price - 1000000, 0),
        budgetMax: currentProperty.price + 1000000,
        preferences: {
          city: currentProperty.location.city,
          type: currentProperty.type,
          bedrooms: currentProperty.bedrooms,
          notes: `Requested callback for ${currentProperty.title}`
        },
        assignedAgentId: "",
        requestedByUserId: profile.uid,
        status: "new",
        notes: `Buyer requested a callback from the property detail page for ${currentProperty.title}.`,
        linkedPropertyIds: [currentProperty.id]
      });
      setMessage("Your request has been logged. An agent can now follow up from the CRM.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create your request.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative min-h-[420px] overflow-hidden rounded-[32px] sm:col-span-2">
            <Image src={property.imageUrls[0]} alt={property.title} fill className="object-cover" />
          </div>
          {property.imageUrls.slice(1, 3).map((image) => (
            <div key={image} className="relative min-h-[220px] overflow-hidden rounded-[28px]">
              <Image src={image} alt={property.title} fill className="object-cover" />
            </div>
          ))}
        </div>

        <Card>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-3">
              <Badge variant="outline">{property.type}</Badge>
              <h1 className="font-display text-4xl font-semibold text-slate-950">{property.title}</h1>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                {property.location.address}, {property.location.locality}, {property.location.city}
              </div>
            </div>
            <p className="text-3xl font-semibold text-slate-950">{formatCurrency(property.price)}</p>
            <p className="text-sm leading-7 text-slate-600">{property.description}</p>
            <div className="grid gap-3 rounded-[24px] bg-slate-50/80 p-5 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4" />
                {property.areaSqFt} sq.ft built-up area
              </div>
              <div className="flex items-center gap-3">
                <Home className="h-4 w-4" />
                {property.bedrooms} bedrooms · {property.bathrooms} bathrooms
              </div>
              <div className="flex items-center gap-3">
                <Wallet className="h-4 w-4" />
                Rental estimate {formatCurrency(property.monthlyRentEstimate ?? 0)}/month
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={() => toggleCompareSelection(property.id)}>
                Add to compare
                <ArrowRight className="h-4 w-4" />
              </Button>
              {profile ? (
                <Button variant="secondary" onClick={handleLeadRequest}>
                  <MessageSquarePlus className="h-4 w-4" />
                  Request agent callback
                </Button>
              ) : (
                <Button variant="secondary" asChild>
                  <Link href={`/login?redirect=/properties/${property.id}`}>
                    Login to request callback
                  </Link>
                </Button>
              )}
              <Button variant="secondary" asChild>
                <Link href={`/calculator?propertyId=${property.id}`}>Analyze returns</Link>
              </Button>
              {message ? <p className="text-sm leading-6 text-slate-600">{message}</p> : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardContent className="space-y-6 p-8">
            <div>
              <h2 className="font-display text-2xl font-semibold text-slate-950">Amenities</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {property.amenities.map((amenity) => (
                  <Badge key={amenity} variant="outline" className="px-4 py-2 text-sm">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-slate-950">Neighborhood intelligence</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{property.neighborhoodInfo}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5 p-8">
            <h2 className="font-display text-2xl font-semibold text-slate-950">Decision summary</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-sky-100/80 p-5">
                <p className="text-sm text-slate-500">Location score</p>
                <p className="mt-2 font-display text-4xl font-semibold text-slate-950">
                  {property.locationRating ?? 0}
                </p>
              </div>
              <div className="rounded-[24px] bg-lime-100/80 p-5">
                <p className="text-sm text-slate-500">ROI potential</p>
                <p className="mt-2 font-display text-4xl font-semibold text-slate-950">
                  {property.roiPotential ?? 0}%
                </p>
              </div>
            </div>
            <p className="text-sm leading-7 text-slate-600">
              Use this listing inside the comparison workspace to benchmark price efficiency, area value, amenity spread, and long-term upside against other shortlisted assets.
            </p>
            <Button variant="secondary" asChild>
              <Link href="/compare">Open comparison workspace</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
