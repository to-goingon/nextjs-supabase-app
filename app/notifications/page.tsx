import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Notifications</h1>
      <p className="mt-2 text-muted-foreground">
        Notification list. UI will be implemented in Phase 2.
      </p>
    </div>
  );
}
