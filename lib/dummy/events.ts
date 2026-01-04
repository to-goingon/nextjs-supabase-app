/**
 * 이벤트 더미 데이터 생성 유틸리티
 * 20개의 샘플 이벤트 데이터를 제공합니다.
 */

import { addDays, addHours, subDays, format } from "date-fns";

export type EventCategory = "swimming" | "fitness" | "social" | "sports" | "study" | "dining";

export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface DummyEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  status: EventStatus;
  host_id: string;
  host_name: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants: number;
  current_participants: number;
  cost_per_person: number;
  total_cost: number;
  share_link_token: string;
  created_at: string;
  updated_at: string;
}

/**
 * 20개의 샘플 이벤트 데이터
 * - 다양한 카테고리 (수영, 헬스, 친구 모임, 스포츠, 스터디, 식사)
 * - 다양한 상태 (예정, 진행중, 완료, 취소)
 * - 날짜는 현재 시점 기준 과거/현재/미래로 분산
 */
export const dummyEvents: DummyEvent[] = [
  {
    id: "event-001",
    title: "주말 수영 모임",
    description:
      "매주 토요일 오전 수영 모임입니다. 초급자부터 상급자까지 환영합니다. 자유형, 평영, 배영 등 다양한 영법을 함께 연습해요.",
    category: "swimming",
    status: "upcoming",
    host_id: "user-003",
    host_name: "이소영",
    date: format(addDays(new Date(), 2), "yyyy-MM-dd"),
    start_time: "09:00",
    end_time: "11:00",
    location: "강남 수영장 (서울시 강남구 테헤란로 123)",
    max_participants: 10,
    current_participants: 7,
    cost_per_person: 15000,
    total_cost: 150000,
    share_link_token: "swim-001-abc123",
    created_at: subDays(new Date(), 10).toISOString(),
    updated_at: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "event-002",
    title: "헬스 PT 그룹 세션",
    description:
      "전문 트레이너와 함께하는 그룹 PT 세션입니다. 웨이트 트레이닝 중심으로 진행되며, 개인별 맞춤 지도가 포함됩니다.",
    category: "fitness",
    status: "ongoing",
    host_id: "user-004",
    host_name: "김민수",
    date: format(new Date(), "yyyy-MM-dd"),
    start_time: "18:00",
    end_time: "20:00",
    location: "서울 휘트니스 센터 (마포구 양화로 45)",
    max_participants: 8,
    current_participants: 8,
    cost_per_person: 35000,
    total_cost: 280000,
    share_link_token: "fitness-002-def456",
    created_at: subDays(new Date(), 15).toISOString(),
    updated_at: addHours(new Date(), -2).toISOString(),
  },
  {
    id: "event-003",
    title: "친구들과 보드게임 카페",
    description:
      "친목 도모를 위한 보드게임 카페 모임입니다. 다양한 보드게임을 즐기며 즐거운 시간을 보내요. 초보자도 환영!",
    category: "social",
    status: "completed",
    host_id: "user-005",
    host_name: "박지연",
    date: format(subDays(new Date(), 3), "yyyy-MM-dd"),
    start_time: "14:00",
    end_time: "18:00",
    location: "홍대 보드게임 카페 (서대문구 연세로 12)",
    max_participants: 6,
    current_participants: 6,
    cost_per_person: 20000,
    total_cost: 120000,
    share_link_token: "social-003-ghi789",
    created_at: subDays(new Date(), 20).toISOString(),
    updated_at: subDays(new Date(), 3).toISOString(),
  },
  {
    id: "event-004",
    title: "축구 풋살 게임",
    description:
      "주말 아침 풋살 게임입니다. 5:5 경기로 진행되며, 실력 무관 누구나 참여 가능합니다. 유니폼은 제공됩니다.",
    category: "sports",
    status: "upcoming",
    host_id: "user-006",
    host_name: "David Lee",
    date: format(addDays(new Date(), 5), "yyyy-MM-dd"),
    start_time: "08:00",
    end_time: "10:00",
    location: "잠실 풋살장 (송파구 올림픽로 240)",
    max_participants: 10,
    current_participants: 9,
    cost_per_person: 12000,
    total_cost: 120000,
    share_link_token: "sports-004-jkl012",
    created_at: subDays(new Date(), 8).toISOString(),
    updated_at: subDays(new Date(), 2).toISOString(),
  },
  {
    id: "event-005",
    title: "영어 회화 스터디",
    description:
      "매주 수요일 저녁 영어 회화 스터디입니다. 일상 주제로 자유롭게 대화하며 실력을 향상시켜요. 원어민 진행자 포함.",
    category: "study",
    status: "upcoming",
    host_id: "user-007",
    host_name: "Sara Park",
    date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    start_time: "19:00",
    end_time: "21:00",
    location: "강남 스터디 카페 (강남구 역삼로 78)",
    max_participants: 12,
    current_participants: 8,
    cost_per_person: 10000,
    total_cost: 120000,
    share_link_token: "study-005-mno345",
    created_at: subDays(new Date(), 12).toISOString(),
    updated_at: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "event-006",
    title: "수영 자유형 집중 연습",
    description:
      "자유형 영법 개선을 위한 집중 연습 세션입니다. 영상 촬영 및 피드백 제공. 중급 이상 추천.",
    category: "swimming",
    status: "upcoming",
    host_id: "user-003",
    host_name: "이소영",
    date: format(addDays(new Date(), 9), "yyyy-MM-dd"),
    start_time: "10:00",
    end_time: "12:00",
    location: "올림픽 수영장 (송파구 올림픽로 424)",
    max_participants: 8,
    current_participants: 5,
    cost_per_person: 25000,
    total_cost: 200000,
    share_link_token: "swim-006-pqr678",
    created_at: subDays(new Date(), 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "event-007",
    title: "저녁 요가 클래스",
    description:
      "하루의 피로를 풀어주는 저녁 요가 클래스입니다. 초급자 환영, 요가 매트는 제공됩니다.",
    category: "fitness",
    status: "upcoming",
    host_id: "user-008",
    host_name: "최준호",
    date: format(addDays(new Date(), 3), "yyyy-MM-dd"),
    start_time: "20:00",
    end_time: "21:30",
    location: "홍대 요가 스튜디오 (마포구 홍익로 92)",
    max_participants: 15,
    current_participants: 12,
    cost_per_person: 18000,
    total_cost: 270000,
    share_link_token: "fitness-007-stu901",
    created_at: subDays(new Date(), 7).toISOString(),
    updated_at: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "event-008",
    title: "한강 피크닉 모임",
    description:
      "날씨 좋은 날 한강에서 피크닉 모임입니다. 돗자리, 간식, 음료 준비해서 함께 즐거운 시간 보내요!",
    category: "social",
    status: "completed",
    host_id: "user-009",
    host_name: "Emily Kim",
    date: format(subDays(new Date(), 7), "yyyy-MM-dd"),
    start_time: "15:00",
    end_time: "19:00",
    location: "반포 한강공원 (서초구 신반포로 고수부지)",
    max_participants: 20,
    current_participants: 18,
    cost_per_person: 15000,
    total_cost: 300000,
    share_link_token: "social-008-vwx234",
    created_at: subDays(new Date(), 25).toISOString(),
    updated_at: subDays(new Date(), 7).toISOString(),
  },
  {
    id: "event-009",
    title: "테니스 레슨 (중급)",
    description:
      "중급자를 위한 테니스 레슨입니다. 포핸드, 백핸드, 서브 기술 향상에 집중합니다. 라켓은 개인 지참.",
    category: "sports",
    status: "upcoming",
    host_id: "user-010",
    host_name: "정현우",
    date: format(addDays(new Date(), 7), "yyyy-MM-dd"),
    start_time: "10:00",
    end_time: "12:00",
    location: "양재 테니스장 (서초구 매헌로 99)",
    max_participants: 6,
    current_participants: 4,
    cost_per_person: 40000,
    total_cost: 240000,
    share_link_token: "sports-009-yza567",
    created_at: subDays(new Date(), 6).toISOString(),
    updated_at: subDays(new Date(), 2).toISOString(),
  },
  {
    id: "event-010",
    title: "코딩 스터디 - 알고리즘",
    description:
      "알고리즘 문제 풀이 스터디입니다. 매주 5문제씩 풀고 리뷰합니다. 백준, 프로그래머스 중심.",
    category: "study",
    status: "ongoing",
    host_id: "user-004",
    host_name: "김민수",
    date: format(new Date(), "yyyy-MM-dd"),
    start_time: "14:00",
    end_time: "17:00",
    location: "신촌 스터디 카페 (서대문구 신촌로 56)",
    max_participants: 8,
    current_participants: 7,
    cost_per_person: 8000,
    total_cost: 64000,
    share_link_token: "study-010-bcd890",
    created_at: subDays(new Date(), 18).toISOString(),
    updated_at: addHours(new Date(), -1).toISOString(),
  },
  {
    id: "event-011",
    title: "브런치 모임",
    description:
      "주말 브런치 카페 모임입니다. 맛있는 음식과 함께 자유로운 대화를 나눠요. 신메뉴 체험!",
    category: "dining",
    status: "upcoming",
    host_id: "user-005",
    host_name: "박지연",
    date: format(addDays(new Date(), 4), "yyyy-MM-dd"),
    start_time: "11:00",
    end_time: "13:00",
    location: "이태원 브런치 카페 (용산구 이태원로 234)",
    max_participants: 8,
    current_participants: 6,
    cost_per_person: 25000,
    total_cost: 200000,
    share_link_token: "dining-011-efg123",
    created_at: subDays(new Date(), 4).toISOString(),
    updated_at: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "event-012",
    title: "아침 크로스핏",
    description:
      "아침 일찍 시작하는 크로스핏 세션입니다. 고강도 운동으로 하루를 시작해요. 초보자 변형 동작 제공.",
    category: "fitness",
    status: "completed",
    host_id: "user-008",
    host_name: "최준호",
    date: format(subDays(new Date(), 2), "yyyy-MM-dd"),
    start_time: "06:00",
    end_time: "07:00",
    location: "강남 크로스핏 박스 (강남구 논현로 188)",
    max_participants: 12,
    current_participants: 10,
    cost_per_person: 20000,
    total_cost: 240000,
    share_link_token: "fitness-012-hij456",
    created_at: subDays(new Date(), 14).toISOString(),
    updated_at: subDays(new Date(), 2).toISOString(),
  },
  {
    id: "event-013",
    title: "등산 모임 - 북한산",
    description:
      "북한산 백운대 코스 등산 모임입니다. 중급 난이도, 약 4시간 소요. 간식과 물은 개인 준비.",
    category: "sports",
    status: "upcoming",
    host_id: "user-006",
    host_name: "David Lee",
    date: format(addDays(new Date(), 6), "yyyy-MM-dd"),
    start_time: "08:00",
    end_time: "14:00",
    location: "북한산 우이동 입구 (강북구 우이동)",
    max_participants: 15,
    current_participants: 11,
    cost_per_person: 5000,
    total_cost: 75000,
    share_link_token: "sports-013-klm789",
    created_at: subDays(new Date(), 9).toISOString(),
    updated_at: subDays(new Date(), 3).toISOString(),
  },
  {
    id: "event-014",
    title: "재즈 바 모임",
    description:
      "재즈 라이브 공연을 감상하는 모임입니다. 좋은 음악과 분위기 속에서 즐거운 시간을 보내요.",
    category: "social",
    status: "upcoming",
    host_id: "user-007",
    host_name: "Sara Park",
    date: format(addDays(new Date(), 8), "yyyy-MM-dd"),
    start_time: "20:00",
    end_time: "23:00",
    location: "이태원 재즈 바 (용산구 이태원로27가길 35)",
    max_participants: 10,
    current_participants: 7,
    cost_per_person: 30000,
    total_cost: 300000,
    share_link_token: "social-014-nop012",
    created_at: subDays(new Date(), 11).toISOString(),
    updated_at: subDays(new Date(), 4).toISOString(),
  },
  {
    id: "event-015",
    title: "IELTS 스피킹 준비반",
    description:
      "IELTS 스피킹 시험 준비 스터디입니다. 파트별 전략 공유 및 실전 모의고사 진행. 목표 점수 7.0+",
    category: "study",
    status: "upcoming",
    host_id: "user-009",
    host_name: "Emily Kim",
    date: format(addDays(new Date(), 10), "yyyy-MM-dd"),
    start_time: "18:30",
    end_time: "20:30",
    location: "강남 어학원 (강남구 테헤란로 152)",
    max_participants: 10,
    current_participants: 8,
    cost_per_person: 15000,
    total_cost: 150000,
    share_link_token: "study-015-qrs345",
    created_at: subDays(new Date(), 13).toISOString(),
    updated_at: subDays(new Date(), 5).toISOString(),
  },
  {
    id: "event-016",
    title: "수영 접영 마스터 클래스",
    description: "접영(버터플라이) 전문 클래스입니다. 영법의 꽃 접영을 정복해봐요! 상급자 대상.",
    category: "swimming",
    status: "cancelled",
    host_id: "user-003",
    host_name: "이소영",
    date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    start_time: "07:00",
    end_time: "08:30",
    location: "올림픽 수영장 (송파구 올림픽로 424)",
    max_participants: 6,
    current_participants: 3,
    cost_per_person: 35000,
    total_cost: 210000,
    share_link_token: "swim-016-tuv678",
    created_at: subDays(new Date(), 16).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "event-017",
    title: "삼겹살 파티",
    description:
      "다 같이 모여 삼겹살 파티! 무한리필 고기와 함께 즐거운 저녁 시간을 보내요. 회식 분위기.",
    category: "dining",
    status: "completed",
    host_id: "user-010",
    host_name: "정현우",
    date: format(subDays(new Date(), 5), "yyyy-MM-dd"),
    start_time: "18:00",
    end_time: "21:00",
    location: "강남 고기집 (강남구 강남대로 364)",
    max_participants: 12,
    current_participants: 12,
    cost_per_person: 22000,
    total_cost: 264000,
    share_link_token: "dining-017-wxy901",
    created_at: subDays(new Date(), 22).toISOString(),
    updated_at: subDays(new Date(), 5).toISOString(),
  },
  {
    id: "event-018",
    title: "필라테스 입문 클래스",
    description:
      "처음 시작하는 분들을 위한 필라테스 기초 클래스입니다. 코어 강화와 자세 교정에 집중합니다.",
    category: "fitness",
    status: "upcoming",
    host_id: "user-005",
    host_name: "박지연",
    date: format(addDays(new Date(), 11), "yyyy-MM-dd"),
    start_time: "10:00",
    end_time: "11:30",
    location: "서초 필라테스 스튜디오 (서초구 서초대로 301)",
    max_participants: 10,
    current_participants: 6,
    cost_per_person: 25000,
    total_cost: 250000,
    share_link_token: "fitness-018-zab234",
    created_at: subDays(new Date(), 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "event-019",
    title: "영화 관람 모임",
    description:
      "최신 개봉작 단체 관람 모임입니다. 영화 후 카페에서 리뷰 및 토론 시간 포함. 장르: SF 액션.",
    category: "social",
    status: "upcoming",
    host_id: "user-004",
    host_name: "김민수",
    date: format(addDays(new Date(), 12), "yyyy-MM-dd"),
    start_time: "19:30",
    end_time: "23:00",
    location: "CGV 강변 (광진구 강변역로 62)",
    max_participants: 15,
    current_participants: 13,
    cost_per_person: 18000,
    total_cost: 270000,
    share_link_token: "social-019-cde567",
    created_at: subDays(new Date(), 8).toISOString(),
    updated_at: subDays(new Date(), 2).toISOString(),
  },
  {
    id: "event-020",
    title: "배드민턴 동호회",
    description:
      "매주 목요일 저녁 배드민턴 동호회입니다. 복식 게임 위주로 진행, 라켓과 셔틀콕은 제공됩니다.",
    category: "sports",
    status: "upcoming",
    host_id: "user-006",
    host_name: "David Lee",
    date: format(addDays(new Date(), 13), "yyyy-MM-dd"),
    start_time: "19:00",
    end_time: "21:00",
    location: "서초 체육관 (서초구 반포대로 58)",
    max_participants: 16,
    current_participants: 14,
    cost_per_person: 10000,
    total_cost: 160000,
    share_link_token: "sports-020-fgh890",
    created_at: subDays(new Date(), 17).toISOString(),
    updated_at: subDays(new Date(), 6).toISOString(),
  },
];

/**
 * 이벤트 ID로 이벤트 정보 조회
 */
export function getEventById(eventId: string): DummyEvent | undefined {
  return dummyEvents.find((event) => event.id === eventId);
}

/**
 * 카테고리별 이벤트 필터링
 */
export function getEventsByCategory(category: EventCategory): DummyEvent[] {
  return dummyEvents.filter((event) => event.category === category);
}

/**
 * 상태별 이벤트 필터링
 */
export function getEventsByStatus(status: EventStatus): DummyEvent[] {
  return dummyEvents.filter((event) => event.status === status);
}

/**
 * 주최자별 이벤트 필터링
 */
export function getEventsByHost(hostId: string): DummyEvent[] {
  return dummyEvents.filter((event) => event.host_id === hostId);
}

/**
 * 예정된 이벤트 목록 조회 (상태가 upcoming 또는 ongoing)
 */
export function getUpcomingEvents(): DummyEvent[] {
  return dummyEvents.filter((event) => event.status === "upcoming" || event.status === "ongoing");
}

/**
 * 완료된 이벤트 목록 조회
 */
export function getCompletedEvents(): DummyEvent[] {
  return dummyEvents.filter((event) => event.status === "completed");
}

/**
 * 공유 링크 토큰으로 이벤트 조회
 */
export function getEventByShareToken(token: string): DummyEvent | undefined {
  return dummyEvents.find((event) => event.share_link_token === token);
}
