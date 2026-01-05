import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { EventForm } from "@/components/events/event-form";

export default async function CreateEventPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-2xl font-bold">새 이벤트 만들기</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          이벤트 정보를 입력하여 새로운 이벤트를 생성하세요
        </p>
      </header>
      <EventForm mode="create" />
    </div>
  );
}
