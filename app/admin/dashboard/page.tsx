import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const role = data.claims.user_metadata?.role;
  if (role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Platform management dashboard. Desktop-only UI will be added in Phase 2.
      </p>
    </div>
  );
}
