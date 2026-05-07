"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PropertyForm } from "@/components/property/property-form";
import { Property } from "@/types/property";

interface PropertyDialogProps {
  property?: Property | null;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function PropertyDialog({ property, trigger, onSuccess }: PropertyDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{property ? "Edit Property" : "Add New Property"}</DialogTitle>
          <DialogDescription>
            {property
              ? "Update the details of your property listing."
              : "Fill in the details below to list a new property on PropWise."}
          </DialogDescription>
        </DialogHeader>
        <PropertyForm
          property={property}
          onSuccess={() => {
            setOpen(false);
            onSuccess?.();
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
