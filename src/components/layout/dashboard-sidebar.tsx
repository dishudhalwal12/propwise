"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calculator,
  Columns3,
  Home,
  LayoutDashboard,
  ListChecks,
  Settings2,
  Shield,
  Users,
  Warehouse
} from "lucide-react";

import { LogoMark } from "@/components/layout/logo-mark";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/user";

const navByRole: Record<UserRole, { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[]> = {
  buyer: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Properties", href: "/properties", icon: Home },
    { label: "Compare", href: "/compare", icon: Columns3 },
    { label: "Calculator", href: "/calculator", icon: Calculator },
    { label: "Profile", href: "/profile", icon: Settings2 }
  ],
  investor: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Properties", href: "/properties", icon: Home },
    { label: "Compare", href: "/compare", icon: Columns3 },
    { label: "Calculator", href: "/calculator", icon: Calculator },
    { label: "Profile", href: "/profile", icon: Settings2 }
  ],
  agent: [
    { label: "Dashboard", href: "/agent", icon: LayoutDashboard },
    { label: "Leads", href: "/agent/leads", icon: Users },
    { label: "Interactions", href: "/agent/interactions", icon: ListChecks },
    { label: "Viewings", href: "/agent/viewings", icon: Home },
    { label: "Compare", href: "/compare", icon: Columns3 },
    { label: "Calculator", href: "/calculator", icon: Calculator },
    { label: "Profile", href: "/profile", icon: Settings2 }
  ],
  property_manager: [
    { label: "Properties", href: "/manage-properties", icon: Warehouse },
    { label: "Viewings", href: "/agent/viewings", icon: Home },
    { label: "Profile", href: "/profile", icon: Settings2 }
  ],
  admin: [
    { label: "Admin", href: "/admin", icon: Shield },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Leads", href: "/agent/leads", icon: Users },
    { label: "Viewings", href: "/agent/viewings", icon: Home },
    { label: "Properties", href: "/manage-properties", icon: Warehouse },
    { label: "Profile", href: "/profile", icon: Settings2 }
  ]
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const { profile } = useAuth();

  const navItems = profile ? navByRole[profile.role] : [];

  return (
    <aside className="glass-panel sticky top-6 hidden h-[calc(100vh-3rem)] w-72 shrink-0 flex-col justify-between p-6 lg:flex">
      <div className="space-y-8">
        <LogoMark />
        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-slate-950 text-white shadow-soft"
                    : "text-slate-600 hover:bg-white/70 hover:text-slate-950"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="rounded-[24px] border border-white/60 bg-white/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Workspace</p>
        <p className="mt-2 font-display text-lg font-semibold text-slate-950">
          {profile?.role?.replace("_", " ") ?? "PropWise"}
        </p>
        <p className="mt-1 text-sm text-slate-500">Insights, CRM, and deal analysis in one flow.</p>
      </div>
    </aside>
  );
}
