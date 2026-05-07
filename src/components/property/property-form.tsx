"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createProperty,
  editProperty,
  uploadPropertyImages,
  deletePropertyImages
} from "@/lib/firestore/properties";
import { Property, PropertyFormInput } from "@/types/property";
import { useAuth } from "@/hooks/useAuth";
import { isDemoRecord } from "@/data/demo";

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

interface PropertyFormProps {
  property?: Property | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PropertyForm({ property, onSuccess, onCancel }: PropertyFormProps) {
  const { profile } = useAuth();
  const [form, setForm] = useState<PropertyFormState>(emptyForm);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!property) {
      setForm(emptyForm);
      setExistingImages([]);
      setRemovedImages([]);
      setNewFiles([]);
      return;
    }

    setForm(mapPropertyToForm(property));
    setExistingImages(property.imageUrls);
    setRemovedImages([]);
    setNewFiles([]);
  }, [property]);

  function handleSave() {
    setMessage("");
    startTransition(async () => {
      try {
        const isDemoProperty = isDemoRecord(property?.id);
        const uploadedUrls = newFiles.length > 0 ? await uploadPropertyImages(newFiles) : [];
        const imageUrls = [
          ...existingImages.filter((url) => !removedImages.includes(url)),
          ...uploadedUrls
        ];

        const payload: PropertyFormInput = {
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
          amenities: form.amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          neighborhoodInfo: form.neighborhoodInfo,
          imageUrls,
          createdBy: property?.createdBy ?? profile?.uid ?? "",
          status: form.status,
          locationRating: Number(form.locationRating),
          roiPotential: Number(form.roiPotential),
          monthlyRentEstimate: Number(form.monthlyRentEstimate || 0)
        };

        if (property && !isDemoProperty) {
          if (removedImages.length > 0) {
            await deletePropertyImages(removedImages);
          }
          await editProperty(property.id, payload);
        } else if (!property) {
          await createProperty(payload);
        }

        onSuccess?.();
      } catch (submissionError) {
        setMessage(
          submissionError instanceof Error ? submissionError.message : "Unable to save property."
        );
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input
          placeholder="Listing title"
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
        />
        <Input
          placeholder="Property type"
          value={form.type}
          onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
        />
      </div>
      <Textarea
        placeholder="Listing description"
        value={form.description}
        onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
        />
        <Input
          type="number"
          placeholder="Area (sq.ft)"
          value={form.areaSqFt}
          onChange={(event) => setForm((current) => ({ ...current, areaSqFt: event.target.value }))}
        />
        <Input
          type="number"
          placeholder="Bedrooms"
          value={form.bedrooms}
          onChange={(event) => setForm((current) => ({ ...current, bedrooms: event.target.value }))}
        />
        <Input
          type="number"
          placeholder="Bathrooms"
          value={form.bathrooms}
          onChange={(event) => setForm((current) => ({ ...current, bathrooms: event.target.value }))}
        />
        <Input
          placeholder="City"
          value={form.city}
          onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
        />
        <Input
          placeholder="Locality"
          value={form.locality}
          onChange={(event) => setForm((current) => ({ ...current, locality: event.target.value }))}
        />
        <Input
          placeholder="Address"
          value={form.address}
          onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
        />
        <Input
          placeholder="Status"
          value={form.status}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              status: event.target.value as PropertyFormState["status"]
            }))
          }
        />
        <Input
          type="number"
          placeholder="Location rating"
          value={form.locationRating}
          onChange={(event) =>
            setForm((current) => ({ ...current, locationRating: event.target.value }))
          }
        />
        <Input
          type="number"
          placeholder="ROI potential %"
          value={form.roiPotential}
          onChange={(event) =>
            setForm((current) => ({ ...current, roiPotential: event.target.value }))
          }
        />
        <Input
          type="number"
          placeholder="Monthly rent estimate"
          value={form.monthlyRentEstimate}
          onChange={(event) =>
            setForm((current) => ({ ...current, monthlyRentEstimate: event.target.value }))
          }
        />
      </div>
      <Input
        placeholder="Amenities, comma separated"
        value={form.amenities}
        onChange={(event) => setForm((current) => ({ ...current, amenities: event.target.value }))}
      />
      <Textarea
        placeholder="Neighborhood intelligence"
        value={form.neighborhoodInfo}
        onChange={(event) =>
          setForm((current) => ({ ...current, neighborhoodInfo: event.target.value }))
        }
      />

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
                  <div className="relative h-24 bg-slate-100">
                    {image ? (
                      <Image src={image} alt="Property image" fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Upload new images</p>
        <Input
          type="file"
          multiple
          onChange={(event) => setNewFiles(Array.from(event.target.files ?? []))}
        />
      </div>

      {message ? <p className="text-sm text-rose-600 font-medium">{message}</p> : null}

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} disabled={isPending} className="flex-1">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : property ? (
            "Update property"
          ) : (
            "Create property"
          )}
        </Button>
        {onCancel ? (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </div>
  );
}
