# 공통 컴포넌트 라이브러리

이 디렉토리에는 프로젝트 전반에서 재사용 가능한 공통 컴포넌트들이 포함되어 있습니다.

## 📁 디렉토리 구조

```
components/
├── events/              # 이벤트 관련 컴포넌트
│   ├── event-card.tsx
│   ├── participant-item.tsx
│   └── event-card-skeleton.tsx
├── notifications/       # 알림 관련 컴포넌트
│   └── notification-item.tsx
├── admin/              # 관리자 페이지 컴포넌트
│   ├── admin-sidebar.tsx
│   └── stat-card.tsx
├── common/             # 공통 유틸리티 컴포넌트
│   ├── empty-state.tsx
│   └── table-skeleton.tsx
├── ui/                 # shadcn/ui 기본 컴포넌트
└── layout/             # 레이아웃 컴포넌트
```

## 🎨 컴포넌트 사용 가이드

### 1. EventCard (이벤트 카드)

이벤트 목록에서 사용하는 카드 컴포넌트입니다.

```tsx
import { EventCard } from "@/components/events/event-card";

<EventCard
  id="event-123"
  title="팀 빌딩 워크샵"
  date="2024년 1월 15일 오후 2:00"
  location="서울시 강남구 테헤란로 123"
  participantCount={15}
  status="upcoming" // "upcoming" | "ongoing" | "completed"
  category="워크샵"
/>;
```

**특징:**

- 상태 배지 (예정/진행중/완료)
- 카테고리 표시 (선택적)
- 날짜, 장소, 참여자 정보
- 클릭 시 이벤트 상세 페이지로 이동
- 호버 시 그림자 효과 및 스케일 애니메이션

### 2. ParticipantItem (참여자 목록 아이템)

이벤트 참여자를 표시하는 리스트 아이템 컴포넌트입니다.

```tsx
import { ParticipantItem } from "@/components/events/participant-item";

<ParticipantItem
  name="김철수"
  avatarUrl="https://example.com/avatar.jpg" // 선택적
  isAttended={true}
  isPaid={false}
/>;
```

**특징:**

- 아바타 이미지 또는 이니셜 표시
- 출석 상태 배지 (출석/미출석)
- 정산 상태 배지 (정산완료/미정산)
- 호버 시 배경색 변경
- 반응형 배지 (모바일에서는 아이콘만 표시)

### 3. NotificationItem (알림 아이템)

알림 목록에서 사용하는 아이템 컴포넌트입니다.

```tsx
import { NotificationItem } from "@/components/notifications/notification-item";

<NotificationItem
  type="invite" // "invite" | "update" | "settlement" | "cancel"
  message="새로운 이벤트에 초대되었습니다."
  isRead={false}
  eventId="event-123"
  createdAt="5분 전"
/>;
```

**특징:**

- 타입별 아이콘 및 색상
  - `invite`: 메일 아이콘 (파란색)
  - `update`: 수정 아이콘 (노란색)
  - `settlement`: 달러 아이콘 (초록색)
  - `cancel`: X 아이콘 (빨간색)
- 읽지 않은 알림 강조 표시
- 클릭 시 해당 이벤트로 이동

### 4. StatCard (통계 카드)

관리자 대시보드의 통계 정보를 표시하는 카드 컴포넌트입니다.

```tsx
import { StatCard } from "@/components/admin/stat-card";
import { Users } from "lucide-react";

<StatCard
  icon={Users}
  value={1234}
  label="총 사용자 수"
  description="전월 대비" // 선택적
  trend={{ value: 12, isPositive: true }} // 선택적
/>;
```

**특징:**

- Lucide React 아이콘 지원
- 큰 숫자 표시 (tabular-nums)
- 트렌드 정보 표시 (선택적)
- 설명 텍스트 (선택적)
- 호버 시 그림자 효과

### 5. EmptyState (빈 상태)

데이터가 없을 때 표시하는 빈 상태 컴포넌트입니다.

```tsx
import { EmptyState } from "@/components/common/empty-state";
import { Calendar } from "lucide-react";

<EmptyState
  icon={Calendar}
  title="아직 이벤트가 없습니다"
  description="새로운 이벤트를 만들어보세요" // 선택적
  action={{
    // 선택적
    label: "이벤트 만들기",
    onClick: () => {
      // TODO: 이벤트 생성 로직
    },
  }}
/>;
```

**특징:**

- Lucide React 아이콘
- 제목 및 설명
- CTA 버튼 (선택적)
- 점선 테두리 디자인

### 6. EventCardSkeleton (이벤트 카드 스켈레톤)

이벤트 카드 로딩 중 표시되는 스켈레톤 컴포넌트입니다.

```tsx
import { EventCardSkeleton } from "@/components/events/event-card-skeleton";

// 로딩 상태
{
  isLoading ? (
    <div className="space-y-4">
      <EventCardSkeleton />
      <EventCardSkeleton />
      <EventCardSkeleton />
    </div>
  ) : (
    <EventList events={events} />
  );
}
```

### 7. TableSkeleton (테이블 스켈레톤)

테이블 로딩 중 표시되는 스켈레톤 컴포넌트입니다.

```tsx
import { TableSkeleton } from "@/components/common/table-skeleton";

<TableSkeleton
  rows={5} // 행 개수 (기본값: 5)
  columns={4} // 열 개수 (기본값: 4)
  showHeader={true} // 헤더 표시 여부 (기본값: true)
/>;
```

## 🎨 디자인 시스템

### 색상 변수

모든 컴포넌트는 TailwindCSS v4의 CSS 변수를 사용합니다:

- `primary`: 주요 색상
- `secondary`: 보조 색상
- `muted`: 음소거된 배경/텍스트
- `destructive`: 위험/삭제 액션
- `foreground`: 전경 텍스트 색상

### 다크 모드

모든 컴포넌트는 다크 모드를 지원합니다. `dark:` variant를 통해 자동으로 색상이 조정됩니다.

### 반응형 디자인

- 모바일 우선 (Mobile-first) 접근
- `sm:`, `md:`, `lg:` 브레이크포인트 사용
- 최대 너비 제한 (`max-w-[480px]` 고려)

## 🔧 기술 스택

- **Next.js 16+** (App Router)
- **TypeScript** (Strict mode)
- **TailwindCSS v4** (CSS 기반 설정)
- **shadcn/ui** (new-york 스타일)
- **Lucide React** (아이콘)
- **class-variance-authority** (variant 관리)

## 📝 개발 가이드

### 새 컴포넌트 추가 시 체크리스트

- [ ] TypeScript 인터페이스로 Props 타입 정의
- [ ] 한국어 주석 작성
- [ ] 다크 모드 지원 (`dark:` variants)
- [ ] 반응형 디자인 고려
- [ ] 접근성 속성 추가 (ARIA)
- [ ] 호버/활성 상태 스타일링
- [ ] 플레이스홀더 이벤트 핸들러 (`onClick={() => {}}`)

### 코드 품질 검사

```bash
# 타입 체크
npm run type-check

# 린트 검사
npm run lint

# 자동 포맷팅
npm run format
```

## 📚 참고 문서

- [Next.js 16 가이드](/docs/guides/nextjs-16.md)
- [Styling 가이드](/docs/guides/styling-guide.md)
- [Component Patterns](/docs/guides/component-patterns.md)
- [shadcn/ui 공식 문서](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
