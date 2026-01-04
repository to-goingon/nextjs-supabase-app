import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function CreateEventPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Create Event</h1>
      <p className="text-muted-foreground mt-2">
        Event creation form. UI will be implemented in Phase 2.
      </p>
    </div>
  );
}
