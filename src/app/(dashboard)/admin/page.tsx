"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import { KpiCard } from "@/components/analytics/kpi-card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StateNotice } from "@/components/ui/state-notice";
import { getDemoComparisonCount, isDemoRecord } from "@/data/demo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useLeads } from "@/hooks/useLeads";
import { useProperties } from "@/hooks/useProperties";
import { useUsers } from "@/hooks/useUsers";
import { getComparisonCount } from "@/lib/firestore/comparisons";
import { updateUserRole } from "@/lib/firestore/users";
import { UserRole } from "@/types/user";

const allRoles: UserRole[] = [
  "buyer",
  "investor",
  "agent",
  "property_manager",
  "admin"
];

export default function AdminPage() {
  const {
    users,
    refetch,
    setUsers,
    isDemoData: usersDemo,
    notice: usersNotice,
    error: usersError
  } = useUsers();
  const { leads, interactions, viewings, isDemoData: crmDemo, notice: crmNotice, error: crmError } = useLeads();
  const {
    properties,
    isDemoData: propertiesDemo,
    notice: propertiesNotice,
    error: propertiesError
  } = useProperties({ status: "all" });
  const [message, setMessage] = useState("");
  const [roleDrafts, setRoleDrafts] = useState<Record<string, UserRole>>({});
  const [comparisonCount, setComparisonCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setRoleDrafts(
      Object.fromEntries(users.map((user) => [user.uid, user.role])) as Record<string, UserRole>
    );
  }, [users]);

  useEffect(() => {
    getComparisonCount()
      .then((count) => setComparisonCount(count > 0 ? count : getDemoComparisonCount()))
      .catch(() => setComparisonCount(getDemoComparisonCount()));
  }, []);

  const roleCounts = useMemo(
    () =>
      allRoles.map((role) => ({
        role,
        total: users.filter((user) => user.role === role).length
      })),
    [users]
  );

  function handleRoleSave(uid: string) {
    const role = roleDrafts[uid];
    if (!role) return;

    startTransition(async () => {
      if (isDemoRecord(uid)) {
        setUsers((current) => current.map((user) => (user.uid === uid ? { ...user, role } : user)));
        setMessage("User role updated locally.");
        return;
      }

      try {
        await updateUserRole(uid, role);
        await refetch();
        setMessage("User role updated.");
      } catch (updateError) {
        setMessage(
          updateError instanceof Error ? updateError.message : "Unable to update role."
        );
      }
    });
  }

  const notice = usersDemo
    ? usersNotice
    : crmDemo
      ? crmNotice
      : propertiesDemo
        ? propertiesNotice
        : usersError || crmError || propertiesError;

  return (
    <DashboardShell allowedRoles={["admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Admin"
          title="Platform oversight and access control"
          description="User roles, listing volume, CRM activity, and viewing throughput are all managed here against live Firestore data."
        />
        {notice && !(usersDemo || crmDemo || propertiesDemo) ? (
          <StateNotice
            tone="warning"
            title="Some admin data could not be loaded"
            description={notice}
          />
        ) : null}
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard label="Users" value={String(users.length)} description="Current user profiles in Firestore." />
          <KpiCard label="Listings" value={String(properties.length)} description="Properties under active management." tint="bg-sky-100/80" />
          <KpiCard label="Interactions" value={String(interactions.length)} description="CRM touchpoints recorded across teams." tint="bg-lime-100/80" />
          <KpiCard label="Viewings" value={String(viewings.length)} description="Appointments in the current pipeline." tint="bg-fuchsia-100/70" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Role distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {roleCounts.map((entry) => (
                <div key={entry.role} className="rounded-[24px] bg-slate-50/80 p-5">
                  <p className="font-medium capitalize text-slate-950">
                    {entry.role.replace("_", " ")}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{entry.total} users</p>
                </div>
              ))}
              <div className="rounded-[24px] bg-slate-50/80 p-5">
                <p className="font-medium text-slate-950">Saved comparisons</p>
                <p className="mt-1 text-sm text-slate-500">{comparisonCount} comparison records currently available.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User role management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {users.map((user) => (
                <div key={user.uid} className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="font-medium text-slate-950">{user.fullName}</p>
                      <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Select
                        value={roleDrafts[user.uid] ?? user.role}
                        onValueChange={(value: UserRole) =>
                          setRoleDrafts((current) => ({ ...current, [user.uid]: value }))
                        }
                      >
                        <SelectTrigger className="w-[220px]">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          {allRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={() => handleRoleSave(user.uid)} disabled={isPending}>
                        Save role
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {message ? <p className="text-sm text-slate-600">{message}</p> : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
