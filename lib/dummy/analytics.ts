/**
 * 통계 더미 데이터 생성 유틸리티
 * 관리자 대시보드용 통계 데이터를 제공합니다.
 */

import { subMonths, subDays, format } from "date-fns";
import { dummyEvents, EventCategory } from "./events";
import { dummyUsers } from "./users";
import { dummyParticipants } from "./participants";

/**
 * 카테고리별 이벤트 분포 데이터 (파이 차트용)
 */
export interface CategoryDistribution {
  category: string;
  count: number;
  percentage: number;
}

/**
 * 월별 이벤트 생성 추이 데이터 (라인 차트용)
 */
export interface MonthlyTrend {
  month: string;
  count: number;
}

/**
 * 일별 활성 사용자 데이터 (바 차트용)
 */
export interface DailyActiveUsers {
  date: string;
  activeUsers: number;
}

/**
 * 관리자 대시보드 주요 지표
 */
export interface DashboardMetrics {
  totalEvents: number;
  totalUsers: number;
  thisMonthEvents: number;
  activeUsers: number;
  completedEvents: number;
  upcomingEvents: number;
  totalRevenue: number;
  averageParticipants: number;
}

/**
 * 카테고리별 이벤트 분포 계산
 */
export function getCategoryDistribution(): CategoryDistribution[] {
  const categories: EventCategory[] = [
    "swimming",
    "fitness",
    "social",
    "sports",
    "study",
    "dining",
  ];

  const categoryLabels: Record<EventCategory, string> = {
    swimming: "수영",
    fitness: "헬스",
    social: "친목 모임",
    sports: "스포츠",
    study: "스터디",
    dining: "식사 모임",
  };

  const distribution = categories.map((category) => {
    const count = dummyEvents.filter((event) => event.category === category).length;
    const percentage = Math.round((count / dummyEvents.length) * 100);
    return {
      category: categoryLabels[category],
      count,
      percentage,
    };
  });

  return distribution.filter((item) => item.count > 0);
}

/**
 * 월별 이벤트 생성 추이 (최근 12개월)
 */
export function getMonthlyTrend(): MonthlyTrend[] {
  const months: MonthlyTrend[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const monthLabel = format(monthDate, "MM월");

    // 실제로는 created_at 기준으로 필터링하지만, 더미 데이터로 랜덤 생성
    const count = Math.floor(Math.random() * 8) + 1; // 1-8개 이벤트

    months.push({
      month: monthLabel,
      count,
    });
  }

  return months;
}

/**
 * 일별 활성 사용자 (최근 30일)
 */
export function getDailyActiveUsers(): DailyActiveUsers[] {
  const days: DailyActiveUsers[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const dayDate = subDays(now, i);
    const dateKey = format(dayDate, "MM/dd");

    // 더미 데이터: 5-20명 사이 랜덤
    const activeUsers = Math.floor(Math.random() * 16) + 5;

    days.push({
      date: dateKey,
      activeUsers,
    });
  }

  return days;
}

/**
 * 관리자 대시보드 주요 지표 계산
 */
export function getDashboardMetrics(): DashboardMetrics {
  const totalEvents = dummyEvents.length;
  const totalUsers = dummyUsers.length;

  // 이번 달 생성된 이벤트 수 (더미 데이터로 랜덤)
  const thisMonthEvents = Math.floor(Math.random() * 10) + 3; // 3-12개

  // 활성 사용자 (최근 7일 이내 활동)
  const activeUsers = Math.floor(dummyUsers.length * 0.6); // 60% 활성

  // 완료된 이벤트 수
  const completedEvents = dummyEvents.filter((event) => event.status === "completed").length;

  // 예정된 이벤트 수
  const upcomingEvents = dummyEvents.filter(
    (event) => event.status === "upcoming" || event.status === "ongoing"
  ).length;

  // 총 수익 (완료된 이벤트의 총 비용 합계)
  const totalRevenue = dummyEvents
    .filter((event) => event.status === "completed")
    .reduce((sum, event) => sum + event.total_cost, 0);

  // 평균 참여자 수
  const averageParticipants =
    dummyEvents.reduce((sum, event) => sum + event.current_participants, 0) / dummyEvents.length;

  return {
    totalEvents,
    totalUsers,
    thisMonthEvents,
    activeUsers,
    completedEvents,
    upcomingEvents,
    totalRevenue,
    averageParticipants: Math.round(averageParticipants * 10) / 10, // 소수점 1자리
  };
}

/**
 * 카테고리별 평균 참가비 계산
 */
export function getAverageCostByCategory(): { category: string; averageCost: number }[] {
  const categories: EventCategory[] = [
    "swimming",
    "fitness",
    "social",
    "sports",
    "study",
    "dining",
  ];

  const categoryLabels: Record<EventCategory, string> = {
    swimming: "수영",
    fitness: "헬스",
    social: "친목 모임",
    sports: "스포츠",
    study: "스터디",
    dining: "식사 모임",
  };

  return categories
    .map((category) => {
      const categoryEvents = dummyEvents.filter((event) => event.category === category);
      if (categoryEvents.length === 0) return null;

      const totalCost = categoryEvents.reduce((sum, event) => sum + event.cost_per_person, 0);
      const averageCost = Math.round(totalCost / categoryEvents.length);

      return {
        category: categoryLabels[category],
        averageCost,
      };
    })
    .filter((item): item is { category: string; averageCost: number } => item !== null);
}

/**
 * 이벤트 상태별 분포
 */
export function getEventStatusDistribution(): { status: string; count: number }[] {
  const statusLabels: Record<string, string> = {
    upcoming: "예정",
    ongoing: "진행중",
    completed: "완료",
    cancelled: "취소",
  };

  const statuses = ["upcoming", "ongoing", "completed", "cancelled"];

  return statuses.map((status) => {
    const count = dummyEvents.filter((event) => event.status === status).length;
    return {
      status: statusLabels[status],
      count,
    };
  });
}

/**
 * 참여율 통계 (참여자 수 / 최대 인원)
 */
export function getParticipationRate(): {
  averageRate: number;
  highestRate: number;
  lowestRate: number;
} {
  const rates = dummyEvents.map(
    (event) => (event.current_participants / event.max_participants) * 100
  );

  const averageRate = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
  const highestRate = Math.max(...rates);
  const lowestRate = Math.min(...rates);

  return {
    averageRate: Math.round(averageRate),
    highestRate: Math.round(highestRate),
    lowestRate: Math.round(lowestRate),
  };
}

/**
 * 정산 완료율 통계
 */
export function getPaymentCompletionRate(): number {
  const totalParticipants = dummyParticipants.filter((p) => p.status === "confirmed").length;
  const paidParticipants = dummyParticipants.filter(
    (p) => p.status === "confirmed" && p.payment_confirmed
  ).length;

  if (totalParticipants === 0) return 0;

  return Math.round((paidParticipants / totalParticipants) * 100);
}

/**
 * 출석률 통계
 */
export function getAttendanceRate(): number {
  const completedEventParticipants = dummyParticipants.filter((p) => {
    const event = dummyEvents.find((e) => e.id === p.event_id);
    return event?.status === "completed" && p.status === "confirmed";
  });

  const attendedParticipants = completedEventParticipants.filter((p) => p.attended);

  if (completedEventParticipants.length === 0) return 0;

  return Math.round((attendedParticipants.length / completedEventParticipants.length) * 100);
}

/**
 * 인기 이벤트 Top 5 (참여자 수 기준)
 */
export function getTopEvents(): Array<{
  title: string;
  category: string;
  participants: number;
  participationRate: number;
}> {
  const categoryLabels: Record<EventCategory, string> = {
    swimming: "수영",
    fitness: "헬스",
    social: "친목 모임",
    sports: "스포츠",
    study: "스터디",
    dining: "식사 모임",
  };

  return dummyEvents
    .map((event) => ({
      title: event.title,
      category: categoryLabels[event.category],
      participants: event.current_participants,
      participationRate: Math.round((event.current_participants / event.max_participants) * 100),
    }))
    .sort((a, b) => b.participants - a.participants)
    .slice(0, 5);
}
