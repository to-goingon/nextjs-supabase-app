import { redirect, notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { EventForm } from "@/components/events/event-form";
import { getEventById } from "@/lib/dummy";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-2xl font-bold">이벤트 수정</h1>
        <p className="text-muted-foreground mt-1 text-sm">{event.title}</p>
      </header>
      <EventForm mode="edit" initialData={event} />
    </div>
  );
}
