import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/event-card";
import { EventTabs } from "@/components/events/event-tabs";
import { EmptyState } from "@/components/common/empty-state";
import {
  getEventsByHost,
  getParticipatedEventIds,
  dummyEvents,
  type EventStatus,
} from "@/lib/dummy";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // 현재 사용자 ID (하드코딩)
  const currentUserId = "user-003";

  // 더미 데이터 가져오기
  const hostedEvents = getEventsByHost(currentUserId);
  const participatedIds = getParticipatedEventIds(currentUserId);
  const participatedEvents = dummyEvents.filter((e) => participatedIds.includes(e.id));

  return (
    <div className="space-y-6 p-4">
      {/* 페이지 헤더 */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">내 이벤트</h1>
        <Button asChild>
          <Link href="/events/create">새 이벤트 만들기</Link>
        </Button>
      </header>

      {/* 주최한 이벤트 섹션 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">주최한 이벤트</h2>
        {hostedEvents.length > 0 ? (
          <EventTabs events={hostedEvents} />
        ) : (
          <EmptyState
            icon={Calendar}
            title="주최한 이벤트가 없습니다"
            description="첫 이벤트를 만들어보세요"
          />
        )}
      </section>

      {/* 참여한 이벤트 섹션 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">참여한 이벤트</h2>
        {participatedEvents.length > 0 ? (
          <div className="space-y-3">
            {participatedEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={format(new Date(event.date), "yyyy년 MM월 dd일")}
                location={event.location}
                participantCount={event.current_participants}
                status={event.status as EventStatus}
                category={event.category}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="참여한 이벤트가 없습니다"
            description="새로운 이벤트에 참여해보세요"
          />
        )}
      </section>
    </div>
  );
}
