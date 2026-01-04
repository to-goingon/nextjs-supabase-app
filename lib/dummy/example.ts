/**
 * 더미 데이터 사용 예시
 * 이 파일은 Phase 2 UI 구현 시 참고용으로 사용하세요.
 */

import {
  dummyEvents,
  getUserById,
  getEventsByStatus,
  getEventsByHost,
  getParticipantsByEvent,
  getUnpaidParticipants,
  getNotificationsByUser,
  getUnreadNotificationCount,
  getDashboardMetrics,
  getCategoryDistribution,
  initializeDummyData,
} from "./index";

// 더미 데이터 초기화 확인
console.log("=== Dummy Data Initialization ===");
const dataStatus = initializeDummyData();
console.log(`Users: ${dataStatus.users}`);
console.log(`Events: ${dataStatus.events}`);
console.log(`Participants: ${dataStatus.participants}`);
console.log(`Notifications: ${dataStatus.notifications}`);
console.log("");

// 1. 사용자 데이터 예시
console.log("=== User Data Example ===");
const currentUser = getUserById("user-003");
console.log(`Current User: ${currentUser?.name} (${currentUser?.email})`);
console.log(`Role: ${currentUser?.role}`);
console.log("");

// 2. 이벤트 데이터 예시
console.log("=== Event Data Example ===");
const upcomingEvents = getEventsByStatus("upcoming");
console.log(`Upcoming Events: ${upcomingEvents.length}`);
upcomingEvents.slice(0, 3).forEach((event) => {
  console.log(`- ${event.title} (${event.date} ${event.start_time})`);
});
console.log("");

// 3. 주최자별 이벤트 조회
console.log("=== Events by Host ===");
const userEvents = getEventsByHost("user-003");
console.log(`Events hosted by ${currentUser?.name}: ${userEvents.length}`);
userEvents.forEach((event) => {
  console.log(`- ${event.title} (Status: ${event.status})`);
});
console.log("");

// 4. 참여자 및 정산 정보
console.log("=== Participant & Payment Info ===");
const eventToCheck = dummyEvents[0];
const participants = getParticipantsByEvent(eventToCheck.id);
const unpaidUsers = getUnpaidParticipants(eventToCheck.id);
console.log(`Event: ${eventToCheck.title}`);
console.log(`Total Participants: ${participants.length}`);
console.log(`Unpaid Participants: ${unpaidUsers.length}`);
unpaidUsers.forEach((p) => {
  console.log(`- ${p.user_name} (Unpaid)`);
});
console.log("");

// 5. 알림 데이터
console.log("=== Notification Data ===");
const notifications = getNotificationsByUser("user-003");
const unreadCount = getUnreadNotificationCount("user-003");
console.log(`Total Notifications: ${notifications.length}`);
console.log(`Unread Notifications: ${unreadCount}`);
notifications.slice(0, 3).forEach((notif) => {
  console.log(`- ${notif.title} (${notif.read ? "Read" : "Unread"})`);
});
console.log("");

// 6. 관리자 대시보드 통계
console.log("=== Dashboard Metrics ===");
const metrics = getDashboardMetrics();
console.log(`Total Events: ${metrics.totalEvents}`);
console.log(`Total Users: ${metrics.totalUsers}`);
console.log(`This Month Events: ${metrics.thisMonthEvents}`);
console.log(`Active Users: ${metrics.activeUsers}`);
console.log(`Completed Events: ${metrics.completedEvents}`);
console.log(`Upcoming Events: ${metrics.upcomingEvents}`);
console.log(`Total Revenue: ₩${metrics.totalRevenue.toLocaleString()}`);
console.log(`Average Participants: ${metrics.averageParticipants}`);
console.log("");

// 7. 카테고리별 분포
console.log("=== Category Distribution ===");
const categoryDist = getCategoryDistribution();
categoryDist.forEach((cat) => {
  console.log(`${cat.category}: ${cat.count}개 (${cat.percentage}%)`);
});
console.log("");

console.log("✅ All dummy data examples executed successfully!");

/**
 * 실행 방법:
 * 터미널에서 다음 명령어를 실행하세요:
 *
 * npx tsx lib/dummy/example.ts
 *
 * 또는 Node.js 환경에서:
 * node --loader ts-node/esm lib/dummy/example.ts
 */
