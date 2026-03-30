"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { isDemoRecord } from "@/data/demo";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { StateNotice } from "@/components/ui/state-notice";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperties";
import {
  createProperty,
  deleteProperty,
  deletePropertyImages,
  editProperty,
  uploadPropertyImages
} from "@/lib/firestore/properties";
import { Property } from "@/types/property";

type PropertyFormState = {
  title: string;
  description: string;
  type: string;
  price: string;
  areaSqFt: string;
  bedrooms: string;
  bathrooms: string;
  city: string;
  locality: string;
  address: string;
  locationRating: string;
  roiPotential: string;
  monthlyRentEstimate: string;
  amenities: string;
  neighborhoodInfo: string;
  status: "active" | "draft" | "sold";
};

const emptyForm: PropertyFormState = {
  title: "",
  description: "",
  type: "",
  price: "",
  areaSqFt: "",
  bedrooms: "",
  bathrooms: "",
  city: "",
  locality: "",
  address: "",
  locationRating: "8",
  roiPotential: "12",
  monthlyRentEstimate: "",
  amenities: "",
  neighborhoodInfo: "",
  status: "active"
};

function mapPropertyToForm(property: Property): PropertyFormState {
  return {
    title: property.title,
    description: property.description,
    type: property.type,
    price: String(property.price),
    areaSqFt: String(property.areaSqFt),
    bedrooms: String(property.bedrooms),
    bathrooms: String(property.bathrooms),
    city: property.location.city,
    locality: property.location.locality,
    address: property.location.address ?? "",
    locationRating: String(property.locationRating ?? 8),
    roiPotential: String(property.roiPotential ?? 12),
    monthlyRentEstimate: String(property.monthlyRentEstimate ?? ""),
    amenities: property.amenities.join(", "),
    neighborhoodInfo: property.neighborhoodInfo,
    status: property.status
  };
}

export default function ManagePropertiesPage() {
  const { profile } = useAuth();
  const queryOptions =
    profile?.role === "property_manager"
      ? { createdBy: profile.uid, status: "all" as const }
      : { status: "all" as const };
  const { properties, refetch, error, setProperties, isDemoData } = useProperties(queryOptions);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [form, setForm] = useState<PropertyFormState>(emptyForm);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();

  const visibleProperties = useMemo(
    () =>
      properties.filter((property) =>
        `${property.title} ${property.location.city} ${property.location.locality}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [properties, search]
  );

  useEffect(() => {
    if (!editingProperty) {
      setForm(emptyForm);
      setExistingImages([]);
      setRemovedImages([]);
      setNewFiles([]);
      return;
    }

    setForm(mapPropertyToForm(editingProperty));
    setExistingImages(editingProperty.imageUrls);
    setRemovedImages([]);
    setNewFiles([]);
  }, [editingProperty]);

  function handleSave() {
    setMessage("");
    startTransition(async () => {
      try {
        const isDemoProperty = isDemoRecord(editingProperty?.id);
        const uploadedUrls = newFiles.length > 0 ? await uploadPropertyImages(newFiles) : [];
        const imageUrls = [...existingImages.filter((url) => !removedImages.includes(url)), ...uploadedUrls];

        const payload = {
          title: form.title,
          description: form.description,
          type: form.type,
          price: Number(form.price),
          areaSqFt: Number(form.areaSqFt),
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          location: {
            city: form.city,
            locality: form.locality,
            address: form.address
          },
          amenities: form.amenities.split(",").map((item) => item.trim()).filter(Boolean),
          neighborhoodInfo: form.neighborhoodInfo,
          imageUrls,
          createdBy: editingProperty?.createdBy ?? profile?.uid ?? "",
          status: form.status,
          locationRating: Number(form.locationRating),
          roiPotential: Number(form.roiPotential),
          monthlyRentEstimate: Number(form.monthlyRentEstimate || 0)
        };

        if (editingProperty && isDemoProperty) {
          setProperties((current) =>
            current.map((property) =>
              property.id === editingProperty.id
                ? {
                    ...property,
                    ...payload
                  }
                : property
            )
          );
          setMessage("Property updated locally.");
        } else if (editingProperty) {
          if (removedImages.length > 0) {
            await deletePropertyImages(removedImages);
          }
          await editProperty(editingProperty.id, payload);
          setMessage("Property updated.");
        } else {
          await createProperty(payload);
          setMessage("Property created.");
        }

        await refetch();
        setEditingProperty(null);
      } catch (submissionError) {
        setMessage(
          submissionError instanceof Error
            ? submissionError.message
            : "Unable to save property."
        );
      }
    });
  }

  function handleDelete(property: Property) {
    startTransition(async () => {
      try {
        if (isDemoRecord(property.id)) {
          setProperties((current) => current.filter((entry) => entry.id !== property.id));
          if (editingProperty?.id === property.id) {
            setEditingProperty(null);
          }
          setMessage("Property removed from the current view.");
          return;
        }

        await deleteProperty(property.id, property.imageUrls);
        if (editingProperty?.id === property.id) {
          setEditingProperty(null);
        }
        await refetch();
        setMessage("Property deleted.");
      } catch (deleteError) {
        setMessage(
          deleteError instanceof Error ? deleteError.message : "Unable to delete property."
        );
      }
    });
  }

  return (
    <DashboardShell allowedRoles={["property_manager", "admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Property management"
          title="Create, refine, and govern listing quality"
          description="Inventory edits, image updates, and lifecycle status changes all persist to Firestore and Storage from this workspace."
          actions={
            <Button asChild variant="secondary">
              <Link href="/properties">View public listings</Link>
            </Button>
          }
        />
        {error && !isDemoData ? (
          <StateNotice
            tone="warning"
            title="Live inventory could not be loaded"
            description={error}
          />
        ) : null}
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>{editingProperty ? "Edit property" : "Add property"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Listing title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
                <Input placeholder="Property type" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} />
              </div>
              <Textarea placeholder="Listing description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <Input type="number" placeholder="Price" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} />
                <Input type="number" placeholder="Area (sq.ft)" value={form.areaSqFt} onChange={(event) => setForm((current) => ({ ...current, areaSqFt: event.target.value }))} />
                <Input type="number" placeholder="Bedrooms" value={form.bedrooms} onChange={(event) => setForm((current) => ({ ...current, bedrooms: event.target.value }))} />
                <Input type="number" placeholder="Bathrooms" value={form.bathrooms} onChange={(event) => setForm((current) => ({ ...current, bathrooms: event.target.value }))} />
                <Input placeholder="City" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
                <Input placeholder="Locality" value={form.locality} onChange={(event) => setForm((current) => ({ ...current, locality: event.target.value }))} />
                <Input placeholder="Address" value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
                <Input placeholder="Status" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as PropertyFormState["status"] }))} />
                <Input type="number" placeholder="Location rating" value={form.locationRating} onChange={(event) => setForm((current) => ({ ...current, locationRating: event.target.value }))} />
                <Input type="number" placeholder="ROI potential %" value={form.roiPotential} onChange={(event) => setForm((current) => ({ ...current, roiPotential: event.target.value }))} />
                <Input type="number" placeholder="Monthly rent estimate" value={form.monthlyRentEstimate} onChange={(event) => setForm((current) => ({ ...current, monthlyRentEstimate: event.target.value }))} />
              </div>
              <Input placeholder="Amenities, comma separated" value={form.amenities} onChange={(event) => setForm((current) => ({ ...current, amenities: event.target.value }))} />
              <Textarea placeholder="Neighborhood intelligence" value={form.neighborhoodInfo} onChange={(event) => setForm((current) => ({ ...current, neighborhoodInfo: event.target.value }))} />

              {existingImages.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">Existing images</p>
                  <div className="grid grid-cols-3 gap-3">
                    {existingImages.map((image) => {
                      const removed = removedImages.includes(image);
                      return (
                        <button
                          key={image}
                          type="button"
                          onClick={() =>
                            setRemovedImages((current) =>
                              current.includes(image)
                                ? current.filter((entry) => entry !== image)
                                : [...current, image]
                            )
                          }
                          className={`relative overflow-hidden rounded-[22px] border ${
                            removed ? "border-rose-300 opacity-40" : "border-transparent"
                          }`}
                        >
                          <div className="relative h-24">
                            <Image src={image} alt="Property image" fill className="object-cover" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <Input
                type="file"
                multiple
                onChange={(event) =>
                  setNewFiles(Array.from(event.target.files ?? []))
                }
              />
              {message ? <p className="text-sm text-slate-600">{message}</p> : null}
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleSave} disabled={isPending}>
                  {isPending ? "Saving..." : editingProperty ? "Update property" : "Create property"}
                </Button>
                {editingProperty ? (
                  <Button variant="secondary" onClick={() => setEditingProperty(null)}>
                    Cancel edit
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Managed inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Search by project or locality"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                {error && visibleProperties.length === 0 ? (
                  <EmptyState title="Unable to load inventory" description={error} />
                ) : visibleProperties.length === 0 ? (
                  <EmptyState
                    title="No managed properties yet"
                    description="Once inventory is created for this role, it will appear here for editing and lifecycle management."
                  />
                ) : (
                  visibleProperties.map((property) => (
                    <div key={property.id} className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium text-slate-950">{property.title}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {property.location.locality}, {property.location.city} · {property.status}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button type="button" size="sm" variant="secondary" onClick={() => setEditingProperty(property)}>
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button type="button" size="sm" onClick={() => handleDelete(property)}>
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
