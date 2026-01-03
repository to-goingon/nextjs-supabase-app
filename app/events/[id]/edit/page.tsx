import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { id } = await params;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Edit Event</h1>
      <p className="mt-2 text-muted-foreground">
        Event ID: {id}. Ownership check and edit form will be implemented in Phase 2.
      </p>
    </div>
  );
}
