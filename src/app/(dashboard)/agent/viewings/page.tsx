"use client";

import { useState, useTransition } from "react";

import { isDemoRecord } from "@/data/demo";
import { ViewingList } from "@/components/crm/viewing-list";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { StateNotice } from "@/components/ui/state-notice";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useLeads } from "@/hooks/useLeads";
import { useProperties } from "@/hooks/useProperties";
import { createViewing, updateViewing } from "@/lib/firestore/crm";
import { Viewing } from "@/types/crm";

const viewingStatuses: Viewing["status"][] = ["scheduled", "completed", "cancelled"];

export default function ViewingsPage() {
  const { profile } = useAuth();
  const crmOptions =
    profile?.role === "agent"
      ? {
          leads: { assignedAgentId: profile.uid },
          viewings: { agentId: profile.uid }
        }
      : undefined;
  const {
    viewings,
    leads,
    setViewings,
    error,
    isDemoData: crmDemo
  } = useLeads(crmOptions);
  const { properties, isDemoData: propertiesDemo } = useProperties({ status: "active" });
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setMessage("");
    startTransition(async () => {
      const propertyId = String(formData.get("propertyId") ?? "");
      const payload = {
        propertyId,
        leadId: String(formData.get("leadId") ?? ""),
        agentId: profile?.uid ?? "",
        scheduledAt: String(formData.get("scheduledAt") ?? ""),
        status: "scheduled" as const,
        notes: String(formData.get("notes") ?? "")
      };
      try {
        const id = await createViewing(payload);
        setViewings((current) =>
          [...current, { ...payload, id }].sort(
            (first, second) =>
              new Date(first.scheduledAt).getTime() - new Date(second.scheduledAt).getTime()
          )
        );
        setMessage("Viewing scheduled.");
      } catch (submissionError) {
        setMessage(
          submissionError instanceof Error
            ? submissionError.message
            : "Unable to schedule viewing."
        );
      }
    });
  }

  function handleStatusUpdate(viewingId: string, status: Viewing["status"]) {
    startTransition(async () => {
      if (isDemoRecord(viewingId)) {
        setViewings((current) =>
          current.map((viewing) => (viewing.id === viewingId ? { ...viewing, status } : viewing))
        );
        setMessage("Viewing updated locally.");
        return;
      }

      try {
        await updateViewing(viewingId, { status });
        setViewings((current) =>
          current.map((viewing) =>
            viewing.id === viewingId ? { ...viewing, status } : viewing
          )
        );
      } catch (updateError) {
        setMessage(
          updateError instanceof Error ? updateError.message : "Unable to update viewing."
        );
      }
    });
  }

  return (
    <DashboardShell allowedRoles={["agent", "property_manager", "admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Viewings"
          title="Schedule and close the loop on site visits"
          description="Every viewing is tied to a lead and property, with status updates reflected in the live timeline."
        />
        {error && !(crmDemo || propertiesDemo) ? (
          <StateNotice
            tone="warning"
            title="Viewing data could not be loaded"
            description={error}
          />
        ) : null}
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <Card>
            <CardHeader>
              <CardTitle>Schedule viewing</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={handleSubmit} className="space-y-4">
                <Select name="propertyId">
                  <SelectTrigger>
                    <SelectValue placeholder="Choose property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select name="leadId">
                  <SelectTrigger>
                    <SelectValue placeholder="Choose lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input name="scheduledAt" type="datetime-local" required />
                <Textarea name="notes" placeholder="Viewing notes" />
                {message ? <p className="text-sm text-slate-600">{message}</p> : null}
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Schedule viewing"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {error && viewings.length === 0 ? (
              <EmptyState title="Unable to load viewings" description={error} />
            ) : (
              <ViewingList viewings={viewings} properties={properties} />
            )}
            {viewings.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Update viewing status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {viewings.map((viewing) => (
                    <div key={viewing.id} className="rounded-[24px] bg-slate-50/80 p-5">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium text-slate-950">
                            {properties.find((property) => property.id === viewing.propertyId)?.title ??
                              "Property viewing"}
                          </p>
                          <p className="text-sm text-slate-500">{viewing.notes}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {viewingStatuses.map((status) => (
                            <Button
                              key={status}
                              type="button"
                              size="sm"
                              variant={viewing.status === status ? "default" : "secondary"}
                              onClick={() => handleStatusUpdate(viewing.id, status)}
                            >
                              {status}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
