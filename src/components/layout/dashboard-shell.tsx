"use client";

import Link from "next/link";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { RouteGuard } from "@/components/layout/route-guard";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/user";

export function DashboardShell({
  children,
  allowedRoles
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  const { profile } = useAuth();
  const mobileNav = profile
    ? {
        buyer: [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/properties", label: "Properties" },
          { href: "/compare", label: "Compare" },
          { href: "/calculator", label: "Calculator" }
        ],
        investor: [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/properties", label: "Properties" },
          { href: "/compare", label: "Compare" },
          { href: "/calculator", label: "Calculator" }
        ],
        agent: [
          { href: "/agent", label: "Dashboard" },
          { href: "/agent/leads", label: "Leads" },
          { href: "/agent/viewings", label: "Viewings" },
          { href: "/profile", label: "Profile" }
        ],
        property_manager: [
          { href: "/manage-properties", label: "Properties" },
          { href: "/agent/viewings", label: "Viewings" },
          { href: "/profile", label: "Profile" }
        ],
        admin: [
          { href: "/admin", label: "Admin" },
          { href: "/analytics", label: "Analytics" },
          { href: "/manage-properties", label: "Properties" },
          { href: "/profile", label: "Profile" }
        ]
      }[profile.role]
    : [];

  return (
    <RouteGuard allowedRoles={allowedRoles}>
      <div className="container-shell flex gap-6 py-6 lg:py-8">
        <DashboardSidebar />
        <div className="min-w-0 flex-1 space-y-4">
          <div className="glass-panel flex gap-3 overflow-x-auto p-3 lg:hidden">
            {mobileNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
          {children}
        </div>
      </div>
    </RouteGuard>
  );
}
