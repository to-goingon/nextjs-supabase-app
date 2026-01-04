"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { MobileMenu } from "@/components/layout/mobile-menu";

export function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MobileMenu />
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Two Gather</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/dashboard"
              className="text-foreground/60 hover:text-foreground/80 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/events/create"
              className="text-foreground/60 hover:text-foreground/80 transition-colors"
            >
              Create Event
            </Link>
            <Link
              href="/notifications"
              className="text-foreground/60 hover:text-foreground/80 transition-colors"
            >
              Notifications
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <ThemeSwitcher />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
