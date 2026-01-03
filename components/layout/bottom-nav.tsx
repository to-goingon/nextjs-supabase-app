"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Plus, Bell, User, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  highlight?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/dashboard", icon: Calendar, label: "대시보드" },
  { href: "/events/create", icon: Plus, label: "생성", highlight: true },
  { href: "/notifications", icon: Bell, label: "알림" },
  { href: "/profile", icon: User, label: "프로필" },
];

export function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
      <div className="mx-auto max-w-[480px]">
        <ul className="grid grid-cols-5 gap-1 px-2 py-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-lg py-2 transition-colors",
                    isActive && "font-semibold text-primary",
                    !isActive && "text-muted-foreground hover:text-foreground",
                    item.highlight && "text-primary"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", item.highlight && "h-6 w-6")} />
                  <span className="text-[10px]">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
