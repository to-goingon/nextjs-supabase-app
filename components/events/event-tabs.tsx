"use client";

import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "@/components/events/event-card";
import { EmptyState } from "@/components/common/empty-state";
import { type DummyEvent, type EventStatus } from "@/lib/dummy";

// EventTabs Props 인터페이스
interface EventTabsProps {
  events: DummyEvent[];
}

export function EventTabs({ events }: EventTabsProps) {
  // 탭 상태 관리 ('all' 또는 EventStatus)
  const [selectedTab, setSelectedTab] = useState<"all" | EventStatus>("all");

  // 필터링 로직 (useMemo로 최적화)
  const filteredEvents = useMemo(() => {
    if (selectedTab === "all") return events;
    return events.filter((e) => e.status === selectedTab);
  }, [events, selectedTab]);

  return (
    <Tabs defaultValue="all" onValueChange={(v) => setSelectedTab(v as "all" | EventStatus)}>
      {/* 탭 목록 (4개 열로 균등 분할) */}
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all">전체</TabsTrigger>
        <TabsTrigger value="upcoming">예정</TabsTrigger>
        <TabsTrigger value="ongoing">진행중</TabsTrigger>
        <TabsTrigger value="completed">완료</TabsTrigger>
      </TabsList>

      {/* 탭 컨텐츠 */}
      <TabsContent value={selectedTab} className="mt-4 space-y-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
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
          ))
        ) : (
          <EmptyState
            icon={Calendar}
            title="이벤트가 없습니다"
            description="선택한 상태의 이벤트가 없습니다"
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
