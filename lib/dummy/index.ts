/**
 * 더미 데이터 통합 관리 모듈
 * 모든 더미 데이터 생성 유틸리티를 중앙에서 export 합니다.
 *
 * 사용 예시:
 * ```typescript
 * import { dummyEvents, dummyUsers, getEventsByStatus } from '@/lib/dummy';
 *
 * const upcomingEvents = getEventsByStatus('upcoming');
 * const currentUser = getUserById('user-003');
 * ```
 */

// Users
export {
  dummyUsers,
  getUserById,
  getUsersByRole,
  getAdminUsers,
  getRegularUsers,
  type DummyUser,
  type UserRole,
} from "./users";

// Events
export {
  dummyEvents,
  getEventById,
  getEventsByCategory,
  getEventsByStatus,
  getEventsByHost,
  getUpcomingEvents,
  getCompletedEvents,
  getEventByShareToken,
  type DummyEvent,
  type EventCategory,
  type EventStatus,
} from "./events";

// Participants
export {
  dummyParticipants,
  getParticipantsByEvent,
  getParticipantsByUser,
  getParticipant,
  getConfirmedParticipantsCount,
  getAttendedParticipantsCount,
  getPaidParticipantsCount,
  getUnpaidParticipants,
  getParticipatedEventIds,
  type DummyParticipant,
  type ParticipantStatus,
} from "./participants";

// Notifications
export {
  dummyNotifications,
  getNotificationsByUser,
  getUnreadNotifications,
  getUnreadNotificationCount,
  getNotificationsByType,
  getNotificationsByEvent,
  getNotificationById,
  type DummyNotification,
  type NotificationType,
} from "./notifications";

// Import for use in helper functions
import { dummyUsers } from "./users";
import { dummyEvents } from "./events";
import { dummyParticipants } from "./participants";
import { dummyNotifications } from "./notifications";

// Analytics
export {
  getCategoryDistribution,
  getMonthlyTrend,
  getDailyActiveUsers,
  getDashboardMetrics,
  getAverageCostByCategory,
  getEventStatusDistribution,
  getParticipationRate,
  getPaymentCompletionRate,
  getAttendanceRate,
  getTopEvents,
  type CategoryDistribution,
  type MonthlyTrend,
  type DailyActiveUsers,
  type DashboardMetrics,
} from "./analytics";

/**
 * 더미 데이터 초기화 함수
 * Phase 2 UI 구현 시 더미 데이터를 사용하기 전에 호출하여 데이터 상태를 확인합니다.
 */
export function initializeDummyData(): {
  users: number;
  events: number;
  participants: number;
  notifications: number;
} {
  return {
    users: dummyUsers.length,
    events: dummyEvents.length,
    participants: dummyParticipants.length,
    notifications: dummyNotifications.length,
  };
}

/**
 * 현재 더미 데이터 상태 출력 (디버깅용)
 */
export function logDummyDataStatus(): void {
  const status = initializeDummyData();
  console.log("=== Dummy Data Status ===");
  console.log(`Users: ${status.users}`);
  console.log(`Events: ${status.events}`);
  console.log(`Participants: ${status.participants}`);
  console.log(`Notifications: ${status.notifications}`);
  console.log("========================");
}
