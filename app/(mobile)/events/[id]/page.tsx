import { redirect, notFound } from "next/navigation";
import { Calendar, MapPin, User } from "lucide-react";
import { format } from "date-fns";

import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { getEventById, getParticipantsByEvent } from "@/lib/dummy";
import { HostActions } from "@/components/events/host-actions";
import { ShareLinkCopy } from "@/components/events/share-link-copy";
import { ParticipantActions } from "@/components/events/participant-actions";
import { ParticipantItem } from "@/components/events/participant-item";

/**
 * 이벤트 상세 페이지
 * - 이벤트 기본 정보 (제목, 설명, 날짜, 장소, 주최자)
 * - 참가자 목록 (✅ Task 010-3)
 * - 참여 신청/취소 버튼 (✅ Task 010-3)
 * - 비용 정보 (✅ Task 010-2)
 * - 액션 버튼 (✅ Task 010-2)
 */
export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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

  const participants = getParticipantsByEvent(id);
  const currentUserId = "user-003"; // Hardcoded (실제로는 Supabase에서 가져옴)
  const isHost = event.host_id === currentUserId;

  // 카테고리 한글 매핑
  const categoryLabels: Record<string, string> = {
    swimming: "수영",
    fitness: "헬스",
    social: "친목",
    sports: "스포츠",
    study: "스터디",
    dining: "식사",
  };

  // 상태 한글 매핑
  const statusLabels: Record<string, string> = {
    upcoming: "예정",
    ongoing: "진행중",
    completed: "완료",
    cancelled: "취소됨",
  };

  // 상태별 Badge variant 매핑
  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case "upcoming":
        return "default";
      case "ongoing":
        return "secondary";
      case "completed":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* 이벤트 정보 섹션 */}
      <section className="space-y-4">
        {/* 제목 */}
        <h1 className="text-2xl leading-tight font-bold">{event.title}</h1>

        {/* 상태 + 카테고리 배지 */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={getStatusVariant(event.status)}>
            {statusLabels[event.status] || event.status}
          </Badge>
          <Badge variant="outline">{categoryLabels[event.category] || event.category}</Badge>
        </div>

        {/* 설명 */}
        <p className="text-muted-foreground leading-relaxed">{event.description}</p>

        <Separator />

        {/* 날짜/시간 */}
        <div className="flex items-start gap-3">
          <Calendar className="text-muted-foreground mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-medium">날짜 및 시간</p>
            <p className="text-muted-foreground text-sm">
              {format(new Date(event.date), "yyyy년 MM월 dd일")}
            </p>
            <p className="text-muted-foreground text-sm">
              {event.start_time} - {event.end_time}
            </p>
          </div>
        </div>

        {/* 장소 */}
        <div className="flex items-start gap-3">
          <MapPin className="text-muted-foreground mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-medium">장소</p>
            <p className="text-muted-foreground text-sm">{event.location}</p>
          </div>
        </div>

        {/* 주최자 */}
        <div className="flex items-start gap-3">
          <User className="text-muted-foreground mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-medium">주최자</p>
            <p className="text-muted-foreground text-sm">{event.host_name}</p>
          </div>
        </div>
      </section>

      {/* 참여 신청/취소 버튼 (주최자가 아닐 때만 표시) */}
      {!isHost && (
        <section>
          <ParticipantActions eventId={id} userId={currentUserId} />
        </section>
      )}

      {/* 참여자 목록 */}
      <section className="space-y-3">
        <h2 className="font-semibold">
          참여자 ({participants.length}/{event.max_participants})
        </h2>
        {participants.length > 0 ? (
          <div className="space-y-2">
            {participants.map((participant) => (
              <ParticipantItem
                key={participant.id}
                name={participant.user_name}
                avatarUrl={participant.user_avatar ?? undefined}
                isAttended={participant.attended}
                isPaid={participant.payment_confirmed}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground text-sm">아직 참여자가 없습니다</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* 공유 링크 섹션 (주최자만) */}
      {isHost && (
        <section className="space-y-3">
          <h2 className="font-semibold">이벤트 공유</h2>
          <p className="text-muted-foreground text-sm">아래 링크를 공유하여 참여자를 초대하세요</p>
          <ShareLinkCopy token={event.share_link_token} />
        </section>
      )}

      {/* 정산 현황 카드 (주최자만) */}
      {isHost && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">정산 현황</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">1인당 금액</span>
                  <span className="font-semibold">{event.cost_per_person.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">총 금액</span>
                  <span className="font-semibold">{event.total_cost.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">미납자</span>
                  <span className="text-destructive font-semibold">
                    {participants.filter((p) => !p.payment_confirmed).length}명
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">참여자별 납부 현황</p>
                <div className="space-y-2">
                  {participants.map((p) => (
                    <div key={p.id} className="flex items-center justify-between">
                      <span className="text-sm">{p.user_name}</span>
                      <Checkbox checked={p.payment_confirmed} disabled />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* 주최자 전용 액션 버튼 */}
      {isHost && (
        <section>
          <HostActions eventId={id} currentStatus={event.status} />
        </section>
      )}
    </div>
  );
}
