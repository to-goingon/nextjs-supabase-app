"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Users, BarChart3 } from "lucide-react";

import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  const routes = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Events", icon: Calendar, href: "/admin/events" },
    { label: "Users", icon: Users, href: "/admin/users" },
    { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  ];

  return (
    <aside className="w-64 border-r bg-muted/10">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="mb-4 px-3 py-2">
          <h2 className="text-lg font-semibold tracking-tight">Admin Panel</h2>
          <p className="text-xs text-muted-foreground">Platform Management</p>
        </div>
        <nav className="flex flex-col gap-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === route.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
