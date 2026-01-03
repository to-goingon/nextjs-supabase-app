# Next.js + Supabase 개발 워크플로우 가이드

> Next.js 16+ App Router와 Supabase를 활용한 실전 개발 워크플로우 및 디버깅 전략

**문서 버전:** 1.0
**대상 독자:** 개발자 (팀원 및 향후 기여자)
**최종 업데이트:** 2026-01-02

---

## 목차

1. [소개](#1-소개)
2. [개발 환경 설정](#2-개발-환경-설정)
3. [Supabase 통합 패턴](#3-supabase-통합-패턴)
4. [기능 개발 워크플로우](#4-기능-개발-워크플로우)
5. [MCP 서버 활용](#5-mcp-서버-활용)
6. [디버깅 가이드](#6-디버깅-가이드)
7. [코드 품질 워크플로우](#7-코드-품질-워크플로우)
8. [일반적인 개발 시나리오](#8-일반적인-개발-시나리오)
9. [모범 사례 참고 자료](#9-모범-사례-참고-자료)
10. [부록](#부록)

---

## 1. 소개

### 1.1 가이드 목적 및 범위

이 가이드는 Next.js 16+ App Router와 Supabase를 활용한 풀스택 애플리케이션 개발 시 실무에서 필요한 워크플로우, 디버깅 전략, MCP 서버 활용법을 다룹니다.

**이 가이드에서 다루는 내용:**

- 실용적인 개발 워크플로우 (계획 → 구현 → 검증)
- MCP 서버를 활용한 효율적인 개발
- 일반적인 문제 및 디버깅 전략
- 시나리오 기반 실전 예제

**이 가이드에서 다루지 않는 내용:**

- Next.js 16 기술 상세 (→ [nextjs-16.md](./nextjs-16.md) 참조)
- 프로젝트 기본 설정 (→ [CLAUDE.md](../../CLAUDE.md) 참조)

### 1.2 다른 문서와의 관계

| 문서                                             | 용도                 | 독자        | 길이    |
| ------------------------------------------------ | -------------------- | ----------- | ------- |
| **CLAUDE.md**                                    | AI 도구용 빠른 참조  | Claude Code | ~200줄  |
| **nextjs-supabase-fullstack-guide.md** (이 문서) | 실용적 워크플로우    | 개발자      | ~600줄  |
| **nextjs-16.md**                                 | Next.js 16 기술 심화 | 개발자      | ~2000줄 |

**문서 선택 가이드:**

- 프로젝트 설정 및 Supabase 클라이언트 패턴 확인 → **CLAUDE.md**
- 개발 워크플로우 및 디버깅 전략 → **이 문서**
- Next.js 16 고급 기능 및 기술 상세 → **nextjs-16.md**

### 1.3 전제 조건

이 가이드를 활용하려면 다음에 대한 기본적인 이해가 필요합니다:

- Next.js App Router 기본 개념
- React Server/Client Components
- TypeScript 기초
- Supabase 기본 개념 (인증, 데이터베이스)
- Git 기본 사용법

---

## 2. 개발 환경 설정

### 2.1 환경 변수 구성

> ⚠️ **상세 참조**: [CLAUDE.md - Environment Setup](../../CLAUDE.md#environment-setup)

프로젝트 루트에 `.env.local` 파일을 생성하고 Supabase 프로젝트 정보를 설정합니다:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

**환경 변수 확인 방법:**

```bash
# .env.local 파일이 존재하는지 확인
ls -la | grep .env.local

# 환경 변수가 제대로 로드되는지 확인
npm run dev
# 브라우저 개발자 도구에서 process.env 확인 가능
```

### 2.2 MCP 서버 설정 개요

프로젝트에는 3개의 MCP 서버가 구성되어 있습니다 (`.mcp.json` 참조):

1. **Supabase MCP** - 데이터베이스 스키마 관리 및 타입 생성
2. **shadcn MCP** - UI 컴포넌트 관리
3. **shrimp-task-manager** - 작업 계획 및 추적

> 📖 **상세 활용법**: [5. MCP 서버 활용](#5-mcp-서버-활용) 섹션 참조

### 2.3 코드 품질 도구 통합

> ⚠️ **상세 참조**: [CLAUDE.md - Code Quality Tools](../../CLAUDE.md#code-quality-tools)

프로젝트는 다음 도구들이 사전 구성되어 있습니다:

- **ESLint** - 코드 품질 검사 (`npm run lint`)
- **Prettier** - 코드 포맷팅 (`npm run format`)
- **TypeScript** - 타입 체크 (`npm run type-check`)
- **Husky + lint-staged** - Git 커밋 시 자동 검사

**개발 시작 전 확인:**

```bash
# 의존성 설치
npm install

# 타입 체크
npm run type-check

# 린트 체크
npm run lint

# 개발 서버 실행
npm run dev
```

---

## 3. Supabase 통합 패턴

> ⚠️ **빠른 참조**: Supabase 클라이언트 패턴 상세 내용은 [CLAUDE.md - Supabase Integration Architecture](../../CLAUDE.md#supabase-integration-architecture)를 참조하세요.

### 3.1 세 가지 클라이언트 패턴 요약

Next.js는 실행 컨텍스트에 따라 세 가지 다른 Supabase 클라이언트가 필요합니다:

| 컨텍스트                           | 파일                     | 사용법                 | 비고        |
| ---------------------------------- | ------------------------ | ---------------------- | ----------- |
| Server Components & Route Handlers | `lib/supabase/server.ts` | `await createClient()` | 비동기 함수 |
| Client Components                  | `lib/supabase/client.ts` | `createClient()`       | 동기 함수   |
| Middleware                         | `lib/supabase/proxy.ts`  | `updateSession()`      | 세션 관리   |

**왜 세 가지 클라이언트가 필요한가?**

Next.js 16은 서버, 클라이언트, 미들웨어라는 세 가지 실행 환경을 가지고 있으며, 각 환경은 쿠키에 접근하는 방식이 다릅니다. Supabase SSR 인증은 쿠키 기반이므로, 각 환경에 맞는 클라이언트를 사용해야 세션을 올바르게 관리할 수 있습니다.

**코드 예제:**

```typescript
// ✅ Server Component
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    redirect('/auth/login');
  }

  return <div>Protected content</div>;
}

// ✅ Client Component
'use client';
import { createClient } from "@/lib/supabase/client";

export default function UserProfile() {
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### 3.2 인증 및 세션 관리 핵심 개념

#### 3.2.1 쿠키 기반 세션

이 프로젝트는 `@supabase/ssr`을 사용하여 쿠키 기반 인증을 구현합니다:

- **장점**: Server Components에서 세션 접근 가능, 보안성 향상
- **주의**: 올바른 쿠키 동기화 필수 (미들웨어 역할)

#### 3.2.2 Middleware의 핵심 역할

Middleware (`lib/supabase/proxy.ts`의 `updateSession()`)는 두 가지 중요한 역할을 합니다:

1. **세션 갱신**: 만료 예정 토큰 자동 갱신
2. **쿠키 동기화**: 브라우저와 서버 간 세션 쿠키 일치 보장

**반드시 지켜야 할 규칙:**

```typescript
// middleware.ts에서 반드시 이렇게 사용
import { updateSession } from "@/lib/supabase/proxy";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
```

**왜 중요한가?**

- `getClaims()` 미호출 시 → 랜덤 로그아웃 발생
- `supabaseResponse` 미반환 시 → 쿠키 동기화 실패, 세션 불일치

### 3.3 자주 발생하는 실수와 해결책

#### ❌ 실수 1: Supabase 클라이언트를 전역 변수에 저장

```typescript
// ❌ 잘못된 예
const supabase = createClient(); // 전역 선언

export default async function Page() {
  const { data } = await supabase.from('posts').select();
  return <div>{data}</div>;
}
```

**문제점**: Vercel Fluid Compute에서 여러 요청이 동일 클라이언트를 공유하여 세션 충돌 발생

**해결책:**

```typescript
// ✅ 올바른 예
export default async function Page() {
  const supabase = await createClient(); // 함수 내부에서 생성
  const { data } = await supabase.from('posts').select();
  return <div>{data}</div>;
}
```

#### ❌ 실수 2: 잘못된 컨텍스트에서 클라이언트 사용

```typescript
// ❌ 잘못된 예: Server Component에서 client.ts 사용
import { createClient } from "@/lib/supabase/client"; // 잘못됨!

export default async function Page() {
  const supabase = createClient();
  // ...
}
```

**해결책**: 컨텍스트에 맞는 클라이언트 사용

```typescript
// ✅ Server Component
import { createClient } from "@/lib/supabase/server";

// ✅ Client Component
import { createClient } from "@/lib/supabase/client";
```

#### ❌ 실수 3: Middleware에서 getClaims() 미호출

```typescript
// ❌ 잘못된 예
export async function updateSession(request: NextRequest) {
  const supabase = createServerClient(...);
  // getClaims() 호출 없음!
  return NextResponse.next();
}
```

**문제점**: 랜덤 로그아웃 발생

**해결책:**

```typescript
// ✅ 올바른 예
export async function updateSession(request: NextRequest) {
  const supabase = createServerClient(...);
  await supabase.auth.getClaims(); // 반드시 호출!
  return supabaseResponse;
}
```

---

## 4. 기능 개발 워크플로우

### 4.1 작업 계획 및 분해 전략

복잡한 기능을 개발할 때는 다음 순서로 작업을 분해합니다:

1. **데이터베이스 스키마 설계** - 어떤 테이블과 컬럼이 필요한가?
2. **API/로직 설계** - 어떤 엔드포인트나 Server Actions이 필요한가?
3. **UI 설계** - 어떤 페이지와 컴포넌트가 필요한가?
4. **통합 및 테스트** - 전체가 함께 작동하는가?

**예시: 사용자 프로필 페이지 기능**

```
1. DB 스키마
   - profiles 테이블 생성 (user_id, display_name, avatar_url 등)
   - RLS 정책 설정

2. API
   - 프로필 조회 Server Component
   - 프로필 업데이트 Server Action

3. UI
   - 프로필 표시 컴포넌트
   - 프로필 편집 폼 (Client Component)

4. 통합
   - 인증 확인
   - 에러 핸들링
   - 로딩 상태
```

### 4.2 Schema-first 접근법

**왜 Schema-first인가?**

데이터베이스 스키마를 먼저 정의하면:

- TypeScript 타입 자동 생성 가능
- API 인터페이스가 명확해짐
- 프론트엔드 개발 전 백엔드 완성 가능

**권장 워크플로우:**

```
1. Supabase MCP로 마이그레이션 생성
   ↓
2. TypeScript 타입 재생성
   ↓
3. Server Component/Action 구현
   ↓
4. Client Component UI 구현
```

### 4.3 타입 생성 워크플로우

**스키마 변경 시 반드시 수행:**

```bash
# 1. Supabase MCP를 통해 스키마 변경 적용

# 2. TypeScript 타입 재생성
# (Supabase MCP의 generate_typescript_types 도구 사용)

# 3. 타입 체크로 검증
npm run type-check
```

**타입 사용 예제:**

```typescript
import { Database } from "@/lib/supabase/database.types";

// 테이블 타입
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Insert 타입
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

// Update 타입
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

// 실제 사용
const supabase = await createClient();
const { data } = await supabase.from("profiles").select().returns<Profile[]>(); // 타입 안전성
```

### 4.4 구현 순서 가이드

**추천 구현 순서:**

1. **데이터베이스 마이그레이션** (Supabase MCP)
2. **TypeScript 타입 생성**
3. **Server Component로 데이터 조회 구현**
4. **기본 UI 렌더링 확인**
5. **Client Component로 상호작용 추가**
6. **Server Action으로 데이터 변경 구현**
7. **에러 핸들링 및 로딩 상태 추가**
8. **테스트 및 검증**

**왜 이 순서인가?**

- 데이터 레이어부터 구축하면 타입 안전성 확보
- Server Component로 먼저 렌더링 확인하면 기본 동작 검증
- 점진적으로 복잡도 증가

### 4.5 테스트 전략

**개발 단계별 테스트:**

```
1. DB 스키마
   - Supabase Dashboard에서 데이터 직접 삽입/조회
   - RLS 정책 테스트

2. Server Component
   - 페이지 접속 시 데이터 렌더링 확인
   - 개발자 도구 Network 탭에서 요청 확인

3. Client Component
   - 브라우저 개발자 도구 Console 확인
   - 상호작용 동작 테스트

4. 통합
   - 전체 플로우 수동 테스트
   - 다양한 시나리오 (로그인/로그아웃, 권한 등)
```

---

## 5. MCP 서버 활용

MCP (Model Context Protocol) 서버는 AI 기반 개발 워크플로우를 제공합니다.

### 5.1 각 MCP 서버 사용 시기

| 작업               | MCP 서버            | 왜 사용하는가?                    |
| ------------------ | ------------------- | --------------------------------- |
| 테이블 생성/수정   | Supabase MCP        | 마이그레이션 추적, 타입 자동 생성 |
| UI 컴포넌트 추가   | shadcn MCP          | 스타일 일관성, 의존성 관리        |
| 복잡한 기능 계획   | shrimp-task-manager | 작업 분해, 진행 상황 추적         |
| 데이터 조회/디버깅 | Supabase MCP        | SQL 직접 실행, 로그 확인          |

### 5.2 Supabase MCP 워크플로우

#### 시나리오 1: 새 테이블 생성

**단계:**

1. **마이그레이션 생성 및 적용**
   - Supabase MCP `apply_migration` 도구 사용
   - 마이그레이션 이름: snake_case (예: `create_posts_table`)

2. **TypeScript 타입 재생성**
   - Supabase MCP `generate_typescript_types` 도구 사용
   - 결과: `lib/supabase/database.types.ts` 업데이트

3. **애플리케이션 코드 업데이트**
   - 생성된 타입 import하여 사용

**예제:**

```sql
-- 마이그레이션 SQL (Supabase MCP를 통해 실행)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own posts"
  ON posts FOR SELECT
  USING (auth.uid() = user_id);
```

```typescript
// 생성된 타입 사용
import { Database } from "@/lib/supabase/database.types";

type Post = Database["public"]["Tables"]["posts"]["Row"];

const supabase = await createClient();
const { data: posts } = await supabase.from("posts").select().returns<Post[]>();
```

#### 시나리오 2: 데이터베이스 디버깅

**Supabase MCP `execute_sql` 도구 활용:**

```sql
-- 데이터 조회
SELECT * FROM posts WHERE user_id = 'user-uuid';

-- RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'posts';

-- 인덱스 확인
SELECT * FROM pg_indexes WHERE tablename = 'posts';
```

### 5.3 shadcn MCP 워크플로우

#### 시나리오: UI 컴포넌트 추가

**수동 방식 (권장하지 않음):**

```bash
npx shadcn@latest add button
```

**MCP 방식 (권장):**

- shadcn MCP 도구 사용
- 프로젝트 설정 자동 인식 (new-york 스타일)
- 의존성 자동 설치

**컴포넌트 사용 예제:**

```typescript
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>대시보드</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">클릭하세요</Button>
      </CardContent>
    </Card>
  );
}
```

### 5.4 shrimp-task-manager 워크플로우

#### 시나리오: 복잡한 기능 구현 계획

**예: 게시글 관리 기능 추가**

**1. 작업 분해:**

```
Task 1: posts 테이블 생성 및 RLS 설정
  - Supabase MCP로 마이그레이션
  - TypeScript 타입 생성

Task 2: 게시글 목록 페이지 (Server Component)
  - /posts 라우트 생성
  - posts 데이터 조회 및 렌더링

Task 3: 게시글 작성 폼 (Client Component)
  - 폼 UI 구현
  - Server Action으로 데이터 저장

Task 4: 게시글 상세 페이지
  - /posts/[id] 라우트 생성
  - 동적 라우팅 구현
```

**2. 진행 상황 추적:**

- 각 작업 완료 시 체크
- 의존성 관계 명확화 (Task 1 → Task 2 → Task 3)

---

## 6. 디버깅 가이드

### 6.1 인증 문제 체크리스트

사용자가 랜덤하게 로그아웃되거나 인증이 불안정할 때:

#### ✅ 체크리스트

- [ ] **Middleware에서 `getClaims()` 호출 확인**
  - 파일: `middleware.ts` 또는 `lib/supabase/proxy.ts`
  - 위치: Supabase 클라이언트 생성 직후

- [ ] **Middleware가 정확한 `supabaseResponse` 반환하는지 확인**
  - `NextResponse.next()`가 아닌 `supabaseResponse` 반환 필수

- [ ] **올바른 컨텍스트에서 올바른 클라이언트 사용하는지 확인**
  - Server Component → `@/lib/supabase/server`
  - Client Component → `@/lib/supabase/client`
  - Middleware → `@/lib/supabase/proxy`

- [ ] **Supabase 클라이언트를 전역 변수에 저장하지 않았는지 확인**
  - 매 요청/함수마다 새 클라이언트 생성

- [ ] **환경 변수가 올바르게 설정되었는지 확인**
  - `.env.local` 파일 존재
  - `NEXT_PUBLIC_SUPABASE_URL` 및 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 설정

**디버깅 코드 예제:**

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  console.log("🔐 Middleware: Processing request", request.url);

  const response = await updateSession(request);

  console.log("🔐 Middleware: Response headers", response.headers.get("set-cookie"));

  return response;
}
```

### 6.2 일반적인 오류와 해결 방법

#### 오류 1: "getClaims is not a function"

**원인**: 잘못된 Supabase 클라이언트 사용

**해결책:**

```typescript
// ❌ 잘못된 예
import { createClient } from "@supabase/supabase-js";

// ✅ 올바른 예
import { createClient } from "@/lib/supabase/server";
```

#### 오류 2: "Cannot read properties of null (reading 'user')"

**원인**: 인증되지 않은 사용자가 보호된 페이지 접근

**해결책:**

```typescript
export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    redirect('/auth/login');
  }

  // 보호된 콘텐츠
  return <div>Protected</div>;
}
```

#### 오류 3: "Invalid Refresh Token: Already Used"

**원인**: 여러 탭에서 동시 세션 갱신 시도

**해결책:**

- Middleware가 올바르게 구현되어 있는지 확인
- `getClaims()` 호출 확인
- 브라우저 캐시 및 쿠키 삭제 후 재시도

### 6.3 성능 문제 해결

#### 문제: 페이지 로딩이 느림

**원인 파악:**

1. **Network 탭에서 느린 요청 확인**
   - Supabase 쿼리가 오래 걸리는가?
   - 너무 많은 데이터를 가져오는가?

2. **불필요한 Client Component 사용**
   - Server Component로 변경 가능한가?

**해결책:**

```typescript
// ✅ 선택적 컬럼 조회 (불필요한 데이터 제외)
const { data } = await supabase
  .from('posts')
  .select('id, title, created_at') // content 제외
  .limit(10); // 페이지네이션

// ✅ 인덱스 추가 (자주 검색하는 컬럼)
-- Supabase MCP로 실행
CREATE INDEX posts_user_id_idx ON posts(user_id);
```

### 6.4 데이터베이스 쿼리 디버깅

**Supabase MCP로 직접 SQL 실행:**

```sql
-- 쿼리 성능 분석
EXPLAIN ANALYZE SELECT * FROM posts WHERE user_id = 'uuid';

-- 느린 쿼리 확인
SELECT * FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

**Supabase Dashboard 활용:**

- SQL Editor에서 쿼리 직접 실행
- Table Editor에서 데이터 확인
- API Logs에서 요청 추적

---

## 7. 코드 품질 워크플로우

### 7.1 커밋 전 체크리스트

Git 커밋 전 반드시 확인:

```bash
# 1. TypeScript 타입 체크
npm run type-check

# 2. ESLint 체크 및 자동 수정
npm run lint:fix

# 3. Prettier 포맷팅
npm run format

# 4. 빌드 확인 (선택사항, 중요 변경 시)
npm run build
```

**자동화 (Husky):**

프로젝트는 Husky + lint-staged로 커밋 시 자동 체크가 설정되어 있습니다:

- Git commit 시도 → 자동으로 린트 및 포맷팅 실행
- 검사 실패 시 커밋 차단
- 수동 확인 불필요

### 7.2 TypeScript 타입 안전성 보장

**모든 Supabase 클라이언트는 `<Database>` 제네릭 사용:**

```typescript
import { Database } from "@/lib/supabase/database.types";

// ✅ 타입 안전한 클라이언트
const supabase = await createClient<Database>();

// ✅ 타입 추론
const { data } = await supabase.from("posts").select(); // data는 자동으로 Post[] 타입
```

**`any` 사용 최소화:**

```typescript
// ❌ 지양
const data: any = await fetchData();

// ✅ 권장
const data: Post[] = await fetchData();

// ✅ 타입 좁히기
if (typeof data === "string") {
  // data는 여기서 string 타입
}
```

### 7.3 린팅 및 포맷팅

**ESLint 규칙 (eslint.config.mjs):**

- `@typescript-eslint/no-unused-vars`: warn (의도적 미사용 변수는 `_` 접두사)
- `@typescript-eslint/no-explicit-any`: warn (허용하되 경고)
- `react/no-unescaped-entities`: warn

**Prettier 설정 (.prettierrc):**

- 2 space 들여쓰기
- 100자 줄 길이
- 세미콜론 사용
- 더블 쿼트
- Tailwind 클래스 자동 정렬 (`prettier-plugin-tailwindcss`)

### 7.4 테스트 접근법

**현재 프로젝트는 자동화된 테스트가 설정되어 있지 않습니다.**

**수동 테스트 전략:**

1. **단위 테스트** (함수/컴포넌트 레벨)
   - 브라우저 개발자 도구 Console 활용
   - 예상 입력/출력 확인

2. **통합 테스트** (페이지 레벨)
   - 실제 브라우저에서 플로우 테스트
   - 다양한 시나리오 (로그인/로그아웃, 권한 등)

3. **E2E 테스트** (전체 애플리케이션)
   - 주요 사용자 여정 수동 테스트
   - 프로덕션 배포 전 필수

**향후 도입 고려 (선택사항):**

- **Jest** - 단위 테스트
- **React Testing Library** - 컴포넌트 테스트
- **Playwright** - E2E 테스트

---

## 8. 일반적인 개발 시나리오

### 8.1 보호된 페이지 추가하기

**시나리오:** 로그인한 사용자만 접근 가능한 대시보드 페이지 생성

**단계:**

1. **페이지 파일 생성**

```typescript
// app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    redirect('/auth/login');
  }

  return (
    <div>
      <h1>대시보드</h1>
      <p>환영합니다, {data.email}!</p>
    </div>
  );
}
```

2. **로딩 상태 추가 (선택사항)**

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>로딩 중...</div>;
}
```

3. **에러 처리 (선택사항)**

```typescript
// app/dashboard/error.tsx
'use client';

export default function Error({ error, reset }: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>오류 발생</h2>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```

### 8.2 데이터베이스 테이블 및 UI 생성하기

**시나리오:** 사용자 프로필 기능 추가

**단계:**

1. **Supabase MCP로 테이블 생성**

```sql
-- 마이그레이션: create_profiles_table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

2. **TypeScript 타입 생성**

Supabase MCP `generate_typescript_types` 실행

3. **Server Component로 프로필 표시**

```typescript
// app/profile/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .single();

  return (
    <div>
      <h1>{profile?.display_name || '이름 없음'}</h1>
      <p>{profile?.bio}</p>
    </div>
  );
}
```

4. **Client Component로 프로필 수정**

```typescript
// components/profile-form.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ProfileForm({ userId, initialData }: {
  userId: string;
  initialData: { display_name?: string; bio?: string };
}) {
  const [displayName, setDisplayName] = useState(initialData.display_name || '');
  const [bio, setBio] = useState(initialData.bio || '');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName, bio })
      .eq('id', userId);

    if (error) {
      alert('업데이트 실패: ' + error.message);
    } else {
      alert('프로필이 업데이트되었습니다!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="이름"
      />
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="자기소개"
      />
      <Button type="submit">저장</Button>
    </form>
  );
}
```

### 8.3 OAuth 제공자 구현하기

> ⚠️ **상세 가이드**: [docs/GOOGLE_OAUTH_SETUP.md](../GOOGLE_OAUTH_SETUP.md) 참조

**요약 단계:**

1. **Google Cloud Console에서 OAuth 앱 생성**
2. **Supabase Dashboard에서 Google Provider 활성화**
3. **로그인 버튼 구현**

```typescript
// components/google-login-button.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export function GoogleLoginButton() {
  const supabase = createClient();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert('로그인 실패: ' + error.message);
    }
  };

  return (
    <Button onClick={handleLogin}>
      Google로 로그인
    </Button>
  );
}
```

### 8.4 API 엔드포인트 구축하기

**시나리오:** 게시글 목록 API 엔드포인트 생성

```typescript
// app/api/posts/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  // 인증 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 데이터 조회
  const { data: posts, error } = await supabase
    .from("posts")
    .select()
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, content } = body;

  const { data: post, error } = await supabase
    .from("posts")
    .insert({ user_id: user.id, title, content })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post }, { status: 201 });
}
```

### 8.5 shadcn/ui 컴포넌트 추가하기

**시나리오:** 다이얼로그 컴포넌트 추가 및 사용

**단계:**

1. **shadcn MCP로 컴포넌트 추가**

shadcn MCP 도구 사용하여 `dialog` 컴포넌트 설치

2. **컴포넌트 사용**

```typescript
// components/delete-confirmation-dialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteConfirmationDialog({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">삭제</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
          <DialogDescription>
            이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 justify-end">
          <Button variant="outline">취소</Button>
          <Button variant="destructive" onClick={onConfirm}>
            삭제
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 9. 모범 사례 참고 자료

### 9.1 Do's and Don'ts

| ✅ Do (권장)                             | ❌ Don't (지양)                    |
| ---------------------------------------- | ---------------------------------- |
| 매 요청마다 새 Supabase 클라이언트 생성  | Supabase 클라이언트 전역 변수 저장 |
| Server Component 우선 사용               | 모든 것을 Client Component로       |
| 선택적 컬럼 조회 (`select('id, title')`) | 모든 컬럼 조회 (`select('*')`)     |
| RLS 정책으로 데이터 보호                 | 애플리케이션 레벨에서만 권한 체크  |
| TypeScript 타입 자동 생성 활용           | 수동으로 타입 작성                 |
| Middleware에서 `getClaims()` 호출        | 세션 갱신 로직 누락                |
| 커밋 전 린트 및 포맷팅                   | 코드 스타일 무시                   |

### 9.2 성능 최적화 팁

**1. Server Component 우선 사용**

```typescript
// ✅ 권장: Server Component로 데이터 조회
export default async function PostsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase.from('posts').select();

  return <PostsList posts={posts} />;
}

// ❌ 지양: Client Component에서 useEffect로 조회
'use client';
export default function PostsPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('posts').select().then(({ data }) => setPosts(data));
  }, []);

  return <PostsList posts={posts} />;
}
```

**2. 페이지네이션 구현**

```typescript
const { data } = await supabase
  .from("posts")
  .select()
  .range(0, 9) // 처음 10개
  .order("created_at", { ascending: false });
```

**3. 인덱스 추가**

```sql
-- 자주 검색하는 컬럼에 인덱스
CREATE INDEX posts_user_id_idx ON posts(user_id);
CREATE INDEX posts_created_at_idx ON posts(created_at DESC);
```

**4. 병렬 요청**

```typescript
// ✅ 병렬 실행
const [postsResult, profileResult] = await Promise.all([
  supabase.from("posts").select(),
  supabase.from("profiles").select().single(),
]);

// ❌ 순차 실행 (느림)
const postsResult = await supabase.from("posts").select();
const profileResult = await supabase.from("profiles").select().single();
```

### 9.3 보안 고려사항

**1. 항상 RLS (Row Level Security) 사용**

```sql
-- 모든 테이블에 RLS 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 정책 생성
CREATE POLICY "policy_name"
  ON posts
  FOR SELECT
  USING (auth.uid() = user_id);
```

**2. 민감 정보 환경 변수 관리**

```bash
# .env.local (절대 Git에 커밋하지 않음)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...

# .gitignore에 추가
.env.local
```

**3. SQL Injection 방지**

```typescript
// ✅ 권장: Supabase 클라이언트 메서드 사용
const { data } = await supabase.from("posts").select().eq("user_id", userId); // 자동 이스케이프

// ❌ 지양: 직접 SQL 문자열 조합
const query = `SELECT * FROM posts WHERE user_id = '${userId}'`; // SQL Injection 위험
```

### 9.4 에러 핸들링 패턴

**1. Supabase 에러 항상 체크**

```typescript
const { data, error } = await supabase.from('posts').select();

if (error) {
  console.error('Database error:', error);
  // 사용자 친화적 메시지 표시
  return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
}

return <PostsList posts={data} />;
```

**2. 전역 에러 핸들러 (error.tsx)**

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>오류가 발생했습니다</h2>
      <p>{error.message}</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```

**3. 타임아웃 처리**

```typescript
const fetchWithTimeout = async (promise: Promise<any>, timeoutMs: number) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), timeoutMs)
  );

  return Promise.race([promise, timeout]);
};

// 사용
try {
  const { data } = await fetchWithTimeout(
    supabase.from("posts").select(),
    5000 // 5초 타임아웃
  );
} catch (error) {
  if (error.message === "Timeout") {
    // 타임아웃 처리
  }
}
```

---

## 부록

### A. 빠른 명령어 참조

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start

# 코드 품질 검사
npm run type-check        # TypeScript 타입 체크
npm run lint              # ESLint 체크
npm run lint:fix          # ESLint 자동 수정
npm run format            # Prettier 포맷팅
npm run format:check      # 포맷팅 확인 (수정 없음)

# Git
git status                # 변경사항 확인
git add .                 # 모든 변경사항 스테이징
git commit -m "message"   # 커밋 (자동으로 린트 및 포맷 실행)
git push                  # 원격 저장소에 푸시
```

### B. 문제 해결 매트릭스

| 증상                    | 가능한 원인                               | 해결책                            |
| ----------------------- | ----------------------------------------- | --------------------------------- |
| 랜덤 로그아웃           | Middleware에서 `getClaims()` 미호출       | `lib/supabase/proxy.ts` 확인      |
| "Invalid Refresh Token" | 여러 탭 동시 세션 갱신                    | 브라우저 캐시 삭제, 재로그인      |
| 타입 오류               | 데이터베이스 스키마 변경 후 타입 미재생성 | Supabase MCP로 타입 재생성        |
| 느린 페이지 로딩        | 불필요한 데이터 조회                      | 선택적 컬럼, 페이지네이션, 인덱스 |
| RLS 정책 오류           | 잘못된 정책 설정                          | Supabase Dashboard에서 정책 확인  |
| 환경 변수 미인식        | `.env.local` 파일 누락                    | `.env.example` 복사 후 값 입력    |

### C. 관련 문서 링크

**프로젝트 내부 문서:**

- [CLAUDE.md](../../CLAUDE.md) - 프로젝트 기본 설정 및 빠른 참조
- [nextjs-16.md](./nextjs-16.md) - Next.js 16 기술 심화 가이드
- [GOOGLE_OAUTH_SETUP.md](../GOOGLE_OAUTH_SETUP.md) - Google OAuth 설정 가이드
- [PRD.md](../PRD.md) - 제품 요구사항 문서
- [ROADMAP.md](../ROADMAP.md) - 개발 로드맵

**외부 공식 문서:**

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase SSR 가이드](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [shadcn/ui 공식 문서](https://ui.shadcn.com/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)

---

**문서 마지막 업데이트:** 2026-01-02
**피드백 및 개선 제안:** 프로젝트 팀에 문의하세요.
