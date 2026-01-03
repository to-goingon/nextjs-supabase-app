"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <div className="flex flex-col gap-4 p-4">
          <SheetTitle className="text-lg font-bold">Two Gather</SheetTitle>
          <nav className="flex flex-col gap-2">
            <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm hover:bg-muted">
              Dashboard
            </Link>
            <Link href="/events/create" className="rounded-lg px-3 py-2 text-sm hover:bg-muted">
              Create Event
            </Link>
            <Link href="/notifications" className="rounded-lg px-3 py-2 text-sm hover:bg-muted">
              Notifications
            </Link>
            <Link href="/profile" className="rounded-lg px-3 py-2 text-sm hover:bg-muted">
              Profile
            </Link>
          </nav>
          <p className="mt-4 text-xs text-muted-foreground">
            Mobile menu functionality will be enhanced in Phase 2
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
