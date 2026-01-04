# 더미 데이터 사용 가이드

Phase 2 UI 구현을 위한 더미 데이터 생성 유틸리티입니다.

## 개요

이 디렉토리는 실제 API 연동 없이 UI/UX를 완성하기 위한 더미 데이터를 제공합니다. Phase 2에서 모든 페이지 UI를 구현할 때 사용하며, Phase 3에서 실제 Supabase 데이터로 교체됩니다.

## 데이터 구조

### 1. Users (`users.ts`)

**10명의 샘플 사용자**

- 관리자 2명, 일반 사용자 8명
- UI Avatars API를 사용한 프로필 이미지
- 역할(role): `user` | `admin`

```typescript
import { dummyUsers, getUserById, getAdminUsers } from "@/lib/dummy";

// 모든 사용자 조회
const allUsers = dummyUsers;

// 사용자 ID로 조회
const user = getUserById("user-003");

// 관리자만 조회
const admins = getAdminUsers();
```

### 2. Events (`events.ts`)

**20개의 샘플 이벤트**

- 카테고리: 수영, 헬스, 친목 모임, 스포츠, 스터디, 식사 모임
- 상태: 예정(upcoming), 진행중(ongoing), 완료(completed), 취소(cancelled)
- 날짜는 현재 시점 기준으로 과거/현재/미래로 분산

```typescript
import { dummyEvents, getEventsByStatus, getEventsByHost, getUpcomingEvents } from "@/lib/dummy";

// 모든 이벤트 조회
const allEvents = dummyEvents;

// 예정된 이벤트만 조회
const upcomingEvents = getUpcomingEvents();

// 특정 상태의 이벤트 조회
const completedEvents = getEventsByStatus("completed");

// 주최자별 이벤트 조회
const myEvents = getEventsByHost("user-003");
```

### 3. Participants (`participants.ts`)

**참여자 데이터 (이벤트별 자동 생성)**

- 각 이벤트의 current_participants 수에 맞춰 자동 할당
- 상태: 대기중(pending), 확정(confirmed), 취소(cancelled)
- 출석 여부 및 정산 여부 포함

```typescript
import {
  getParticipantsByEvent,
  getUnpaidParticipants,
  getPaidParticipantsCount,
} from "@/lib/dummy";

// 이벤트의 참여자 목록
const participants = getParticipantsByEvent("event-001");

// 미납자 목록
const unpaidUsers = getUnpaidParticipants("event-001");

// 정산 완료자 수
const paidCount = getPaidParticipantsCount("event-001");
```

### 4. Notifications (`notifications.ts`)

**20개의 알림 데이터**

- 타입: 초대(invitation), 이벤트 변경(event_update), 정산 요청(payment_request), 취소(cancellation)
- 읽음/안읽음 상태 포함
- 최신순으로 정렬

```typescript
import {
  getNotificationsByUser,
  getUnreadNotifications,
  getUnreadNotificationCount,
} from "@/lib/dummy";

// 사용자의 모든 알림 (최신순)
const notifications = getNotificationsByUser("user-003");

// 안읽은 알림만 조회
const unreadNotifs = getUnreadNotifications("user-003");

// 안읽은 알림 개수
const unreadCount = getUnreadNotificationCount("user-003");
```

### 5. Analytics (`analytics.ts`)

**관리자 대시보드용 통계 데이터**

- 카테고리별 이벤트 분포 (파이 차트)
- 월별 이벤트 생성 추이 (라인 차트)
- 일별 활성 사용자 (바 차트)
- 주요 지표 (총 이벤트, 총 사용자, 이번 달 이벤트, 활성 사용자)

```typescript
import {
  getCategoryDistribution,
  getMonthlyTrend,
  getDashboardMetrics,
  getTopEvents,
} from "@/lib/dummy";

// 카테고리별 분포 (Recharts PieChart 용)
const categoryData = getCategoryDistribution();

// 월별 추이 (Recharts LineChart 용)
const monthlyData = getMonthlyTrend();

// 대시보드 주요 지표
const metrics = getDashboardMetrics();

// 인기 이벤트 Top 5
const topEvents = getTopEvents();
```

## 사용 예시

### 일반 사용자 대시보드 (Task 008)

```typescript
"use client";

import { getEventsByHost, getParticipatedEventIds, dummyEvents } from "@/lib/dummy";

export default function DashboardPage() {
  const currentUserId = "user-003"; // 실제로는 auth에서 가져옴

  // 주최한 이벤트
  const hostedEvents = getEventsByHost(currentUserId);

  // 참여한 이벤트
  const participatedEventIds = getParticipatedEventIds(currentUserId);
  const participatedEvents = dummyEvents.filter((event) =>
    participatedEventIds.includes(event.id),
  );

  return (
    <div>
      <h2>주최한 이벤트</h2>
      {hostedEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}

      <h2>참여한 이벤트</h2>
      {participatedEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
```

### 이벤트 상세 페이지 (Task 010)

```typescript
"use client";

import { getEventById, getParticipantsByEvent, getUnpaidParticipants } from "@/lib/dummy";

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = getEventById(params.id);
  const participants = getParticipantsByEvent(params.id);
  const unpaidUsers = getUnpaidParticipants(params.id);

  if (!event) return <div>이벤트를 찾을 수 없습니다.</div>;

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>

      <div>참여자: {participants.length}명</div>
      <div>미납자: {unpaidUsers.length}명</div>

      <ul>
        {participants.map((p) => (
          <li key={p.id}>
            {p.user_name} - 정산: {p.payment_confirmed ? "완료" : "미완료"}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 알림 페이지 (Task 011)

```typescript
"use client";

import { getNotificationsByUser, getUnreadNotificationCount } from "@/lib/dummy";

export default function NotificationsPage() {
  const currentUserId = "user-003";
  const notifications = getNotificationsByUser(currentUserId);
  const unreadCount = getUnreadNotificationCount(currentUserId);

  return (
    <div>
      <h1>
        알림 ({unreadCount}개 안읽음)
      </h1>
      {notifications.map((notif) => (
        <div key={notif.id} className={notif.read ? "" : "bg-blue-50"}>
          <h3>{notif.title}</h3>
          <p>{notif.message}</p>
        </div>
      ))}
    </div>
  );
}
```

### 관리자 통계 페이지 (Task 016)

```typescript
"use client";

import {
  getCategoryDistribution,
  getMonthlyTrend,
  getDailyActiveUsers,
  getDashboardMetrics,
} from "@/lib/dummy";
import { PieChart, LineChart, BarChart } from "recharts"; // 실제 Recharts 컴포넌트 사용

export default function AdminAnalyticsPage() {
  const categoryData = getCategoryDistribution();
  const monthlyData = getMonthlyTrend();
  const dailyData = getDailyActiveUsers();
  const metrics = getDashboardMetrics();

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <div>총 이벤트: {metrics.totalEvents}</div>
        <div>총 사용자: {metrics.totalUsers}</div>
        <div>이번 달 이벤트: {metrics.thisMonthEvents}</div>
        <div>활성 사용자: {metrics.activeUsers}</div>
      </div>

      <PieChart data={categoryData} />
      <LineChart data={monthlyData} />
      <BarChart data={dailyData} />
    </div>
  );
}
```

## 데이터 초기화 확인

```typescript
import { initializeDummyData, logDummyDataStatus } from "@/lib/dummy";

// 데이터 개수 확인
const status = initializeDummyData();
console.log(status);
// { users: 10, events: 20, participants: 147, notifications: 20 }

// 콘솔에 상태 출력
logDummyDataStatus();
```

## 주의사항

1. **Phase 2 전용**: 이 더미 데이터는 Phase 2 UI 구현에만 사용됩니다. Phase 3에서 실제 Supabase 쿼리로 교체됩니다.

2. **타입 안전성**: 모든 데이터는 TypeScript 타입이 정의되어 있어 컴파일 타임에 타입 체크가 가능합니다.

3. **날짜 데이터**: `date-fns` 라이브러리를 사용하여 현재 시점 기준으로 과거/미래 날짜를 동적으로 생성합니다.

4. **DB 스키마 참고**: 이 더미 데이터 구조는 Task 018 (DB 스키마 설계) 시 참고 자료로 사용됩니다.

5. **이미지**: UI Avatars API(`https://ui-avatars.com/api/`)를 사용하여 프로필 이미지를 동적으로 생성합니다.

## 다음 단계

Phase 2에서 이 더미 데이터를 사용하여 모든 페이지 UI를 완성한 후:

1. **Task 018**: UI 구현 결과를 바탕으로 최종 DB 스키마 설계
2. **Task 019**: Supabase에 실제 데이터베이스 구축
3. **Task 021-027**: 더미 데이터를 실제 Supabase 쿼리로 교체

## 파일 구조

```
lib/dummy/
├── index.ts           # 통합 export 파일 (모든 모듈 통합)
├── users.ts           # 사용자 더미 데이터 (10명)
├── events.ts          # 이벤트 더미 데이터 (20개)
├── participants.ts    # 참여자 더미 데이터 (자동 생성)
├── notifications.ts   # 알림 더미 데이터 (20개)
├── analytics.ts       # 통계 데이터 생성 함수
└── README.md          # 이 문서
```
