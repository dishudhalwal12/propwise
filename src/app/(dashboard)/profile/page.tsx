"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { logoutUser, updateUserProfile } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    if (!profile) return;
    setMessage("");
    startTransition(async () => {
      try {
        await updateUserProfile(profile.uid, {
          fullName: String(formData.get("fullName") ?? ""),
          phone: String(formData.get("phone") ?? "")
        });
        await refreshProfile();
        setMessage("Profile updated.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to update profile.");
      }
    });
  }

  async function handleLogout() {
    await logoutUser();
    router.push("/");
  }

  return (
    <DashboardShell allowedRoles={["buyer", "investor", "agent", "property_manager", "admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Profile"
          title="Account and access"
          description="Update your primary contact details and manage session access."
          actions={<Button variant="secondary" onClick={handleLogout}>Logout</Button>}
        />
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Profile details</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              <Input name="fullName" defaultValue={profile?.fullName} placeholder="Full name" />
              <Input name="phone" defaultValue={profile?.phone} placeholder="Phone" />
              <Input value={profile?.email ?? ""} disabled />
              <Input value={profile?.role ?? ""} disabled />
              {message ? <p className="text-sm text-slate-600">{message}</p> : null}
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
