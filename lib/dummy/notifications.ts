/**
 * 알림 더미 데이터 생성 유틸리티
 * 다양한 알림 타입과 읽음/안읽음 상태를 포함합니다.
 */

import { subDays, subHours, subMinutes } from "date-fns";

export type NotificationType = "invitation" | "event_update" | "payment_request" | "cancellation";

export interface DummyNotification {
  id: string;
  user_id: string;
  event_id: string;
  event_title: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

/**
 * 알림 더미 데이터
 * - 다양한 알림 타입 (초대, 이벤트 변경, 정산 요청, 취소)
 * - 읽음/안읽음 상태 혼합
 * - 최신순으로 정렬 (created_at 기준)
 */
export const dummyNotifications: DummyNotification[] = [
  {
    id: "notif-001",
    user_id: "user-003",
    event_id: "event-002",
    event_title: "헬스 PT 그룹 세션",
    type: "invitation",
    title: "새로운 이벤트 초대",
    message: "김민수님이 '헬스 PT 그룹 세션' 이벤트에 초대했습니다.",
    read: false,
    created_at: subMinutes(new Date(), 30).toISOString(),
  },
  {
    id: "notif-002",
    user_id: "user-004",
    event_id: "event-001",
    event_title: "주말 수영 모임",
    type: "event_update",
    title: "이벤트 정보 변경",
    message: "'주말 수영 모임'의 시간이 09:00에서 10:00으로 변경되었습니다.",
    read: false,
    created_at: subHours(new Date(), 2).toISOString(),
  },
  {
    id: "notif-003",
    user_id: "user-005",
    event_id: "event-004",
    event_title: "축구 풋살 게임",
    type: "payment_request",
    title: "정산 요청",
    message: "'축구 풋살 게임'의 참가비 12,000원을 정산해 주세요.",
    read: false,
    created_at: subHours(new Date(), 5).toISOString(),
  },
  {
    id: "notif-004",
    user_id: "user-006",
    event_id: "event-016",
    event_title: "수영 접영 마스터 클래스",
    type: "cancellation",
    title: "이벤트 취소",
    message: "'수영 접영 마스터 클래스'가 취소되었습니다. 참가비는 자동 환불됩니다.",
    read: true,
    created_at: subHours(new Date(), 8).toISOString(),
  },
  {
    id: "notif-005",
    user_id: "user-007",
    event_id: "event-005",
    event_title: "영어 회화 스터디",
    type: "invitation",
    title: "새로운 이벤트 초대",
    message: "Sara Park님이 '영어 회화 스터디' 이벤트에 초대했습니다.",
    read: true,
    created_at: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "notif-006",
    user_id: "user-008",
    event_id: "event-007",
    event_title: "저녁 요가 클래스",
    type: "event_update",
    title: "이벤트 정보 변경",
    message: "'저녁 요가 클래스'의 장소가 변경되었습니다. 새 장소를 확인해주세요.",
    read: false,
    created_at: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "notif-007",
    user_id: "user-009",
    event_id: "event-003",
    event_title: "친구들과 보드게임 카페",
    type: "payment_request",
    title: "정산 요청",
    message: "'친구들과 보드게임 카페'의 참가비 20,000원을 정산해 주세요.",
    read: true,
    created_at: subDays(new Date(), 2).toISOString(),
  },
  {
    id: "notif-008",
    user_id: "user-010",
    event_id: "event-010",
    event_title: "코딩 스터디 - 알고리즘",
    type: "event_update",
    title: "이벤트 정보 변경",
    message: "'코딩 스터디 - 알고리즘'의 시간이 14:00에서 15:00으로 변경되었습니다.",
    read: true,
    created_at: subDays(new Date(), 3).toISOString(),
  },
  {
    id: "notif-009",
    user_id: "user-003",
    event_id: "event-009",
    event_title: "테니스 레슨 (중급)",
    type: "invitation",
    title: "새로운 이벤트 초대",
    message: "정현우님이 '테니스 레슨 (중급)' 이벤트에 초대했습니다.",
    read: true,
    created_at: subDays(new Date(), 4).toISOString(),
  },
  {
    id: "notif-010",
    user_id: "user-004",
    event_id: "event-011",
    event_title: "브런치 모임",
    type: "payment_request",
    title: "정산 요청",
    message: "'브런치 모임'의 참가비 25,000원을 정산해 주세요.",
    read: false,
    created_at: subDays(new Date(), 5).toISOString(),
  },
  {
    id: "notif-011",
    user_id: "user-005",
    event_id: "event-013",
    event_title: "등산 모임 - 북한산",
    type: "invitation",
    title: "새로운 이벤트 초대",
    message: "David Lee님이 '등산 모임 - 북한산' 이벤트에 초대했습니다.",
    read: true,
    created_at: subDays(new Date(), 6).toISOString(),
  },
  {
    id: "notif-012",
    user_id: "user-006",
    event_id: "event-014",
    event_title: "재즈 바 모임",
    type: "event_update",
    title: "이벤트 정보 변경",
    message: "'재즈 바 모임'의 최대 인원이 10명에서 12명으로 변경되었습니다.",
    read: true,
    created_at: subDays(new Date(), 7).toISOString(),
  },
  {
    id: "notif-013",
    user_id: "user-007",
    event_id: "event-008",
    event_title: "한강 피크닉 모임",
    type: "payment_request",
    title: "정산 요청",
    message: "'한강 피크닉 모임'의 참가비 15,000원을 정산해 주세요.",
    read: true,
    created_at: subDays(new Date(), 8).toISOString(),
  },
  {
    id: "notif-014",
    user_id: "user-008",
    event_id: "event-012",
    event_title: "아침 크로스핏",
    type: "event_update",
    title: "이벤트 정보 변경",
    message: "'아침 크로스핏'의 설명이 업데이트되었습니다.",
    read: true,
    created_at: subDays(new Date(), 9).toISOString(),
  },
  {
    id: "notif-015",
    user_id: "user-009",
    event_id: "event-015",
    event_title: "IELTS 스피킹 준비반",
    type: "invitation",
    title: "새로운 이벤트 초대",
    message: "Emily Kim님이 'IELTS 스피킹 준비반' 이벤트에 초대했습니다.",
    read: true,
    created_at: subDays(new Date(), 10).toISOString(),
  },
  {
    id: "notif-016",
    user_id: "user-010",
    event_id: "event-017",
    event_title: "삼겹살 파티",
    type: "payment_request",
    title: "정산 요청",
    message: "'삼겹살 파티'의 참가비 22,000원을 정산해 주세요.",
    read: true,
    created_at: subDays(new Date(), 11).toISOString(),
  },
  {
    id: "notif-017",
    user_id: "user-003",
    event_id: "event-018",
    event_title: "필라테스 입문 클래스",
    type: "invitation",
    title: "새로운 이벤트 초대",
    message: "박지연님이 '필라테스 입문 클래스' 이벤트에 초대했습니다.",
    read: true,
    created_at: subDays(new Date(), 12).toISOString(),
  },
  {
    id: "notif-018",
    user_id: "user-004",
    event_id: "event-019",
    event_title: "영화 관람 모임",
    type: "event_update",
    title: "이벤트 정보 변경",
    message: "'영화 관람 모임'의 영화 제목이 변경되었습니다.",
    read: true,
    created_at: subDays(new Date(), 13).toISOString(),
  },
  {
    id: "notif-019",
    user_id: "user-005",
    event_id: "event-020",
    event_title: "배드민턴 동호회",
    type: "invitation",
    title: "새로운 이벤트 초대",
    message: "David Lee님이 '배드민턴 동호회' 이벤트에 초대했습니다.",
    read: true,
    created_at: subDays(new Date(), 14).toISOString(),
  },
  {
    id: "notif-020",
    user_id: "user-006",
    event_id: "event-006",
    event_title: "수영 자유형 집중 연습",
    type: "payment_request",
    title: "정산 요청",
    message: "'수영 자유형 집중 연습'의 참가비 25,000원을 정산해 주세요.",
    read: true,
    created_at: subDays(new Date(), 15).toISOString(),
  },
];

/**
 * 사용자 ID로 알림 목록 조회 (최신순)
 */
export function getNotificationsByUser(userId: string): DummyNotification[] {
  return dummyNotifications
    .filter((notif) => notif.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * 사용자의 안읽은 알림 목록 조회
 */
export function getUnreadNotifications(userId: string): DummyNotification[] {
  return dummyNotifications.filter((notif) => notif.user_id === userId && !notif.read);
}

/**
 * 사용자의 안읽은 알림 개수 조회
 */
export function getUnreadNotificationCount(userId: string): number {
  return getUnreadNotifications(userId).length;
}

/**
 * 알림 타입별 필터링
 */
export function getNotificationsByType(
  userId: string,
  type: NotificationType
): DummyNotification[] {
  return dummyNotifications.filter((notif) => notif.user_id === userId && notif.type === type);
}

/**
 * 이벤트 ID로 관련 알림 조회
 */
export function getNotificationsByEvent(eventId: string): DummyNotification[] {
  return dummyNotifications.filter((notif) => notif.event_id === eventId);
}

/**
 * 알림 ID로 알림 조회
 */
export function getNotificationById(notificationId: string): DummyNotification | undefined {
  return dummyNotifications.find((notif) => notif.id === notificationId);
}
