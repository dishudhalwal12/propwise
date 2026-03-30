"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import { isDemoRecord } from "@/data/demo";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StateNotice } from "@/components/ui/state-notice";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useLeads } from "@/hooks/useLeads";
import { useProperties } from "@/hooks/useProperties";
import { useUsers } from "@/hooks/useUsers";
import { createLead, updateLead } from "@/lib/firestore/crm";
import { Lead, LeadPriority, LeadStatus } from "@/types/crm";

const leadStatuses: LeadStatus[] = ["new", "contacted", "qualified", "closed"];
const priorities: LeadPriority[] = ["low", "medium", "high"];

function buildDefaultLead(agentId?: string) {
  return {
    name: "",
    email: "",
    phone: "",
    source: "",
    priority: "medium" as LeadPriority,
    budgetMin: 0,
    budgetMax: 0,
    city: "",
    type: "",
    preferenceNotes: "",
    notes: "",
    assignedAgentId: agentId ?? ""
  };
}

export default function LeadsPage() {
  const { profile } = useAuth();
  const crmOptions =
    profile?.role === "agent" ? { leads: { assignedAgentId: profile.uid } } : undefined;
  const { leads, setLeads, refetch, error, isDemoData: leadsDemo } = useLeads(crmOptions);
  const { properties, isDemoData: propertiesDemo } = useProperties({ status: "active" });
  const { users, isDemoData: usersDemo } = useUsers();
  const [message, setMessage] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [form, setForm] = useState(buildDefaultLead(profile?.uid));
  const [editDraft, setEditDraft] = useState<Lead | null>(null);
  const [isPending, startTransition] = useTransition();

  const agentOptions = useMemo(
    () => users.filter((user) => user.role === "agent" || user.role === "admin"),
    [users]
  );

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedLeadId) ?? null,
    [leads, selectedLeadId]
  );

  useEffect(() => {
    setEditDraft(selectedLead);
  }, [selectedLead]);

  useEffect(() => {
    if (!selectedLeadId && leads.length > 0) {
      setSelectedLeadId(leads[0].id);
    }
  }, [leads, selectedLeadId]);

  function handleCreate(formData: FormData) {
    setMessage("");
    startTransition(async () => {
      const payload = {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        source: String(formData.get("source") ?? ""),
        priority: String(formData.get("priority") ?? "medium") as LeadPriority,
        budgetMin: Number(formData.get("budgetMin") ?? 0),
        budgetMax: Number(formData.get("budgetMax") ?? 0),
        preferences: {
          city: String(formData.get("city") ?? ""),
          type: String(formData.get("type") ?? ""),
          notes: String(formData.get("preferenceNotes") ?? "")
        },
        assignedAgentId:
          String(formData.get("assignedAgentId") ?? "") || profile?.uid || "",
        requestedByUserId: "",
        status: "new" as LeadStatus,
        notes: String(formData.get("notes") ?? ""),
        linkedPropertyIds: []
      };

      try {
        const id = await createLead(payload);
        setLeads((current) => [{ ...payload, id }, ...current]);
        setForm(buildDefaultLead(profile?.uid));
        setMessage("Lead added successfully.");
      } catch (submissionError) {
        setMessage(
          submissionError instanceof Error ? submissionError.message : "Unable to add lead."
        );
      }
    });
  }

  async function handleUpdateLead() {
    if (!editDraft) return;

    startTransition(async () => {
      if (isDemoRecord(editDraft.id)) {
        setLeads((current) => current.map((lead) => (lead.id === editDraft.id ? editDraft : lead)));
        setMessage("Lead updated locally.");
        return;
      }

      try {
        await updateLead(editDraft.id, {
          status: editDraft.status,
          priority: editDraft.priority,
          assignedAgentId: editDraft.assignedAgentId,
          notes: editDraft.notes,
          linkedPropertyIds: editDraft.linkedPropertyIds,
          nextFollowUpAt: editDraft.nextFollowUpAt
        });
        await refetch();
        setMessage("Lead updated.");
      } catch (updateError) {
        setMessage(updateError instanceof Error ? updateError.message : "Unable to update lead.");
      }
    });
  }

  function toggleLinkedProperty(propertyId: string) {
    if (!editDraft) return;
    const linkedPropertyIds = editDraft.linkedPropertyIds.includes(propertyId)
      ? editDraft.linkedPropertyIds.filter((entry) => entry !== propertyId)
      : [...editDraft.linkedPropertyIds, propertyId];

    setEditDraft({
      ...editDraft,
      linkedPropertyIds
    });
  }

  return (
    <DashboardShell allowedRoles={["agent", "admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Leads"
          title="Capture, assign, and move qualified demand"
          description="Lead creation and editing now write directly to Firestore, including status, priority, assignment, notes, and linked properties."
        />
        {error && !(leadsDemo || propertiesDemo || usersDemo) ? (
          <StateNotice
            tone="warning"
            title="Lead data could not be loaded"
            description={error}
          />
        ) : null}
        <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
          <Card>
            <CardHeader>
              <CardTitle>Add lead</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={handleCreate} className="space-y-4">
                <Input name="name" placeholder="Lead name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
                <Input name="email" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
                <Input name="phone" placeholder="Phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} required />
                <Input name="source" placeholder="Source" value={form.source} onChange={(event) => setForm((current) => ({ ...current, source: event.target.value }))} required />
                <div className="grid grid-cols-2 gap-3">
                  <Input name="budgetMin" type="number" placeholder="Budget min" value={form.budgetMin || ""} onChange={(event) => setForm((current) => ({ ...current, budgetMin: Number(event.target.value) }))} required />
                  <Input name="budgetMax" type="number" placeholder="Budget max" value={form.budgetMax || ""} onChange={(event) => setForm((current) => ({ ...current, budgetMax: Number(event.target.value) }))} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input name="city" placeholder="Preferred city" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
                  <Input name="type" placeholder="Property type" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} />
                </div>
                <Select value={form.priority} onValueChange={(value: LeadPriority) => setForm((current) => ({ ...current, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={form.assignedAgentId || "unassigned"} onValueChange={(value) => setForm((current) => ({ ...current, assignedAgentId: value === "unassigned" ? "" : value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {agentOptions.map((agent) => (
                      <SelectItem key={agent.uid} value={agent.uid}>
                        {agent.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea name="preferenceNotes" placeholder="Preference notes" value={form.preferenceNotes} onChange={(event) => setForm((current) => ({ ...current, preferenceNotes: event.target.value }))} />
                <Textarea name="notes" placeholder="Internal notes" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
                {message ? <p className="text-sm text-slate-600">{message}</p> : null}
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Add lead"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Live lead queue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && leads.length === 0 ? (
                  <EmptyState title="Unable to load leads" description={error} />
                ) : leads.length === 0 ? (
                  <EmptyState
                    title="No leads yet"
                    description="Create a lead or receive buyer callbacks from property pages to populate the CRM."
                  />
                ) : (
                  leads.map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className={`w-full rounded-[24px] border p-5 text-left transition ${
                        selectedLeadId === lead.id
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-200 bg-slate-50/80 text-slate-700"
                      }`}
                    >
                      <p className="font-medium">{lead.name}</p>
                      <p className="mt-1 text-sm opacity-80">
                        {lead.status} · {lead.priority} priority
                      </p>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>

            {editDraft ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit lead</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Select
                      value={editDraft.status}
                      onValueChange={(value: LeadStatus) =>
                        setEditDraft((current) => (current ? { ...current, status: value } : current))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {leadStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={editDraft.priority}
                      onValueChange={(value: LeadPriority) =>
                        setEditDraft((current) => (current ? { ...current, priority: value } : current))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Select
                    value={editDraft.assignedAgentId || "unassigned"}
                    onValueChange={(value) =>
                      setEditDraft((current) =>
                        current
                          ? { ...current, assignedAgentId: value === "unassigned" ? "" : value }
                          : current
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Assigned agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {agentOptions.map((agent) => (
                        <SelectItem key={agent.uid} value={agent.uid}>
                          {agent.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="datetime-local"
                    value={
                      editDraft.nextFollowUpAt
                        ? new Date(editDraft.nextFollowUpAt).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(event) =>
                      setEditDraft((current) =>
                        current
                          ? { ...current, nextFollowUpAt: event.target.value || undefined }
                          : current
                      )
                    }
                  />

                  <Textarea
                    value={editDraft.notes}
                    onChange={(event) =>
                      setEditDraft((current) =>
                        current ? { ...current, notes: event.target.value } : current
                      )
                    }
                  />

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-700">Linked properties</p>
                    <div className="flex flex-wrap gap-2">
                      {properties.map((property) => {
                        const linked = editDraft.linkedPropertyIds.includes(property.id);
                        return (
                          <Button
                            key={property.id}
                            type="button"
                            size="sm"
                            variant={linked ? "default" : "secondary"}
                            onClick={() => toggleLinkedProperty(property.id)}
                          >
                            {property.title.split(" ").slice(0, 2).join(" ")}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <Button onClick={handleUpdateLead} disabled={isPending}>
                    {isPending ? "Saving..." : "Update lead"}
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
