/**
 * 참여자 더미 데이터 생성 유틸리티
 * 이벤트와 사용자 간의 참여 관계를 정의합니다.
 */

import { dummyEvents } from "./events";
import { dummyUsers } from "./users";

export type ParticipantStatus = "pending" | "confirmed" | "cancelled";

export interface DummyParticipant {
  id: string;
  event_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  status: ParticipantStatus;
  attended: boolean;
  payment_confirmed: boolean;
  joined_at: string;
}

/**
 * 참여자 더미 데이터 생성 함수
 * 각 이벤트의 current_participants 수에 맞춰 참여자를 자동 할당합니다.
 */
function generateParticipants(): DummyParticipant[] {
  const participants: DummyParticipant[] = [];
  let participantCounter = 1;

  dummyEvents.forEach((event) => {
    const availableUsers = dummyUsers.filter((user) => user.id !== event.host_id);
    const participantCount = Math.min(event.current_participants, availableUsers.length);

    for (let i = 0; i < participantCount; i++) {
      const user = availableUsers[i % availableUsers.length];

      // 이벤트 상태에 따라 참여자 상태 결정
      let status: ParticipantStatus = "confirmed";
      let attended = false;
      let paymentConfirmed = false;

      if (event.status === "completed") {
        status = "confirmed";
        attended = Math.random() > 0.2; // 80% 출석률
        paymentConfirmed = Math.random() > 0.15; // 85% 정산 완료율
      } else if (event.status === "ongoing") {
        status = "confirmed";
        attended = false;
        paymentConfirmed = Math.random() > 0.5; // 50% 사전 정산
      } else if (event.status === "upcoming") {
        status = Math.random() > 0.9 ? "pending" : "confirmed"; // 10% pending
        attended = false;
        paymentConfirmed = Math.random() > 0.7; // 30% 사전 정산
      } else if (event.status === "cancelled") {
        status = "cancelled";
        attended = false;
        paymentConfirmed = false;
      }

      participants.push({
        id: `participant-${String(participantCounter).padStart(3, "0")}`,
        event_id: event.id,
        user_id: user.id,
        user_name: user.name,
        user_avatar: user.avatar_url,
        status,
        attended,
        payment_confirmed: paymentConfirmed,
        joined_at: new Date(
          new Date(event.created_at).getTime() + i * 24 * 60 * 60 * 1000
        ).toISOString(),
      });

      participantCounter++;
    }
  });

  return participants;
}

/**
 * 생성된 참여자 더미 데이터
 */
export const dummyParticipants: DummyParticipant[] = generateParticipants();

/**
 * 이벤트 ID로 참여자 목록 조회
 */
export function getParticipantsByEvent(eventId: string): DummyParticipant[] {
  return dummyParticipants.filter((p) => p.event_id === eventId);
}

/**
 * 사용자 ID로 참여한 이벤트의 참여자 정보 조회
 */
export function getParticipantsByUser(userId: string): DummyParticipant[] {
  return dummyParticipants.filter((p) => p.user_id === userId);
}

/**
 * 특정 이벤트에서 특정 사용자의 참여 정보 조회
 */
export function getParticipant(eventId: string, userId: string): DummyParticipant | undefined {
  return dummyParticipants.find((p) => p.event_id === eventId && p.user_id === userId);
}

/**
 * 이벤트의 확정 참여자 수 조회
 */
export function getConfirmedParticipantsCount(eventId: string): number {
  return dummyParticipants.filter((p) => p.event_id === eventId && p.status === "confirmed").length;
}

/**
 * 이벤트의 출석 완료자 수 조회
 */
export function getAttendedParticipantsCount(eventId: string): number {
  return dummyParticipants.filter((p) => p.event_id === eventId && p.attended).length;
}

/**
 * 이벤트의 정산 완료자 수 조회
 */
export function getPaidParticipantsCount(eventId: string): number {
  return dummyParticipants.filter((p) => p.event_id === eventId && p.payment_confirmed).length;
}

/**
 * 이벤트의 미납자 목록 조회
 */
export function getUnpaidParticipants(eventId: string): DummyParticipant[] {
  return dummyParticipants.filter(
    (p) => p.event_id === eventId && p.status === "confirmed" && !p.payment_confirmed
  );
}

/**
 * 사용자 ID로 참여한 이벤트 ID 목록 조회 (confirmed 상태만)
 */
export function getParticipatedEventIds(userId: string): string[] {
  return dummyParticipants
    .filter((p) => p.user_id === userId && p.status === "confirmed")
    .map((p) => p.event_id);
}
