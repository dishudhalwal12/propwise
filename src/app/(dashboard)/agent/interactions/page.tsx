"use client";

import { useState, useTransition } from "react";

import { InteractionTimeline } from "@/components/crm/interaction-timeline";
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
import { createInteraction } from "@/lib/firestore/crm";

const interactionTypes = ["call", "email", "meeting", "viewing"] as const;

export default function InteractionsPage() {
  const { profile } = useAuth();
  const crmOptions =
    profile?.role === "agent"
      ? {
          leads: { assignedAgentId: profile.uid },
          interactions: { agentId: profile.uid }
        }
      : undefined;
  const {
    interactions,
    leads,
    setInteractions,
    error,
    isDemoData: crmDemo
  } = useLeads(crmOptions);
  const { properties, isDemoData: propertiesDemo } = useProperties({ status: "active" });
  const [message, setMessage] = useState("");
  const [type, setType] = useState<(typeof interactionTypes)[number]>("call");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setMessage("");
    startTransition(async () => {
      const payload = {
        leadId: String(formData.get("leadId") ?? ""),
        propertyId:
          String(formData.get("propertyId") ?? "") === "none"
            ? undefined
            : String(formData.get("propertyId") ?? "") || undefined,
        agentId: profile?.uid ?? "",
        type,
        notes: String(formData.get("notes") ?? ""),
        interactionAt: new Date().toISOString(),
        outcome: String(formData.get("outcome") ?? "")
      };

      try {
        const id = await createInteraction(payload);
        setInteractions((current) => [{ ...payload, id }, ...current]);
        setMessage("Interaction logged.");
      } catch (submissionError) {
        setMessage(
          submissionError instanceof Error
            ? submissionError.message
            : "Unable to log interaction."
        );
      }
    });
  }

  return (
    <DashboardShell allowedRoles={["agent", "admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Interactions"
          title="Keep every conversation attached to the deal"
          description="Log calls, emails, meetings, and viewings against real leads and properties so the CRM timeline stays useful."
        />
        {error && !(crmDemo || propertiesDemo) ? (
          <StateNotice
            tone="warning"
            title="Interaction data could not be loaded"
            description={error}
          />
        ) : null}
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <Card>
            <CardHeader>
              <CardTitle>Log interaction</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={handleSubmit} className="space-y-4">
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
                <Select name="propertyId">
                  <SelectTrigger>
                    <SelectValue placeholder="Linked property (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No property selected</SelectItem>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={type} onValueChange={(value: (typeof interactionTypes)[number]) => setType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Interaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    {interactionTypes.map((entry) => (
                      <SelectItem key={entry} value={entry}>
                        {entry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input name="outcome" placeholder="Outcome" required />
                <Textarea name="notes" placeholder="Interaction summary" required />
                {message ? <p className="text-sm text-slate-600">{message}</p> : null}
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save interaction"}
                </Button>
              </form>
            </CardContent>
          </Card>
          {error && interactions.length === 0 ? (
            <EmptyState title="Unable to load interactions" description={error} />
          ) : (
            <InteractionTimeline interactions={interactions} />
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
