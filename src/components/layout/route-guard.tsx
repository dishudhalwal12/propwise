"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRole } from "@/types/user";

export function RouteGuard({
  children,
  allowedRoles
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  const { loading, profile, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!profile) {
      router.replace("/login");
      return;
    }
    if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
      router.replace("/");
    }
  }, [allowedRoles, loading, pathname, profile, router, user]);

  if (
    loading ||
    !user ||
    !profile ||
    (allowedRoles && profile && !allowedRoles.includes(profile.role))
  ) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
