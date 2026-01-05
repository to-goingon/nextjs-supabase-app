"use client";

import { useState } from "react";
import { UserMinus, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getParticipant } from "@/lib/dummy";

/**
 * 이벤트 참여 신청/취소 액션 컴포넌트
 * - 참여자가 이벤트 참여 상태를 토글할 수 있는 버튼 제공
 * - 초기 상태는 더미 데이터에서 가져옴
 * - 실제 API 연동 시 서버 액션으로 교체 필요
 */
interface ParticipantActionsProps {
  eventId: string;
  userId: string;
}

export function ParticipantActions({ eventId, userId }: ParticipantActionsProps) {
  // 더미 데이터에서 초기 참여 상태 확인
  const initialParticipant = getParticipant(eventId, userId);
  const [isParticipating, setIsParticipating] = useState(
    !!initialParticipant && initialParticipant.status === "confirmed"
  );

  /**
   * 참여 상태 토글 핸들러
   * TODO: 실제 Supabase API 연동 시 서버 액션으로 교체
   */
  const handleToggle = () => {
    const action = isParticipating ? "참여 취소" : "참여 신청";
    console.log(`${action}:`, { eventId, userId });

    // 상태 변경
    setIsParticipating(!isParticipating);

    // 사용자 피드백
    toast.success(
      isParticipating ? "이벤트 참여가 취소되었습니다" : "이벤트 참여 신청이 완료되었습니다"
    );
  };

  return (
    <Button
      onClick={handleToggle}
      className="w-full"
      variant={isParticipating ? "outline" : "default"}
    >
      {isParticipating ? (
        <>
          <UserMinus className="mr-2 size-4" />
          참여 취소하기
        </>
      ) : (
        <>
          <UserPlus className="mr-2 size-4" />
          참여 신청하기
        </>
      )}
    </Button>
  );
}
