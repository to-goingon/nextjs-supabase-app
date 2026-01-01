# Next.js 16.1.1 개발 가이드

> Claude Code에서 Next.js 16.1.1 프로젝트를 개발할 때 따라야 할 핵심 규칙과 가이드라인

**문서 버전:** 1.0
**Next.js 버전:** 16.1.1
**React 버전:** 19.0.0
**최종 업데이트:** 2026-01-01

---

## 목차

1. [소개](#1-소개)
2. [프로젝트 아키텍처](#2-프로젝트-아키텍처)
3. [Server vs Client Components](#3-server-vs-client-components)
4. [라우팅과 네비게이션](#4-라우팅과-네비게이션)
5. [데이터 페칭 전략](#5-데이터-페칭-전략)
6. [캐싱과 재검증](#6-캐싱과-재검증)
7. [스트리밍과 로딩 상태](#7-스트리밍과-로딩-상태)
8. [Route Handlers (API Routes)](#8-route-handlers-api-routes)
9. [에러 핸들링](#9-에러-핸들링)
10. [Supabase 통합 패턴](#10-supabase-통합-패턴)
11. [개발 워크플로우](#11-개발-워크플로우)
12. [성능 최적화](#12-성능-최적화)
13. [TypeScript 모범 사례](#13-typescript-모범-사례)
14. [보안 모범 사례](#14-보안-모범-사례)
15. [자주하는 실수와 해결책](#15-자주하는-실수와-해결책)
16. [빠른 참조](#16-빠른-참조)

---

## 1. 소개

### Next.js 16.1.1 주요 특징

Next.js 16.1.1은 React 19를 기반으로 하며 다음과 같은 주요 개선사항을 포함합니다:

- **Cache Components**: `use cache` 디렉티브로 더 세밀한 캐싱 제어
- **기본 캐싱 정책 변경**: `fetch`는 더 이상 기본적으로 캐시되지 않음 (opt-in 방식)
- **향상된 타입 안전성**: `PageProps`, `LayoutProps` 등 글로벌 타입 헬퍼
- **개선된 스트리밍**: Suspense 및 Progressive Rendering 최적화
- **새로운 캐시 API**: `cacheTag`, `updateTag`, `revalidateTag`

### 전제 조건

이 가이드를 활용하려면 다음 기술에 대한 기본적인 이해가 필요합니다:

- HTML, CSS, JavaScript
- React (Hooks, Components, Props)
- TypeScript 기초
- Node.js 및 npm

### 공식 문서 참조

- [Next.js 공식 문서](https://nextjs.org/docs)
- [React 공식 문서](https://react.dev)

---

## 2. 프로젝트 아키텍처

### 2.1 App Router 파일 컨벤션

Next.js 16은 **파일 시스템 기반 라우팅**을 사용합니다. `app` 디렉토리 구조가 URL 경로에 직접 매핑됩니다.

#### 특수 파일들

| 파일명          | 용도                                       | 필수 여부                |
| --------------- | ------------------------------------------ | ------------------------ |
| `layout.tsx`    | 여러 페이지 간 공유되는 레이아웃           | 루트만 필수              |
| `page.tsx`      | 특정 라우트의 고유 UI                      | 라우트를 공개하려면 필수 |
| `loading.tsx`   | 로딩 상태 UI (자동으로 Suspense 경계 생성) | 선택                     |
| `error.tsx`     | 에러 처리 UI (Error Boundary)              | 선택                     |
| `not-found.tsx` | 404 페이지                                 | 선택                     |
| `route.ts`      | API 엔드포인트 (Route Handler)             | 선택                     |

#### 디렉토리 구조 예시

```
app/
├── layout.tsx              # 루트 레이아웃 (필수, html/body 태그 포함)
├── page.tsx                # 홈페이지 (/)
├── loading.tsx             # 홈페이지 로딩 상태
├── error.tsx               # 홈페이지 에러 처리
│
├── blog/
│   ├── layout.tsx          # 블로그 섹션 레이아웃
│   ├── page.tsx            # 블로그 목록 (/blog)
│   └── [slug]/
│       ├── page.tsx        # 개별 블로그 포스트 (/blog/my-post)
│       └── loading.tsx     # 포스트 로딩 상태
│
├── api/
│   └── posts/
│       └── route.ts        # API 엔드포인트 (/api/posts)
│
└── (auth)/                 # 라우트 그룹 (URL에 포함되지 않음)
    ├── login/
    │   └── page.tsx        # /login
    └── sign-up/
        └── page.tsx        # /sign-up
```

### 2.2 중첩 라우트

폴더를 중첩하여 중첩 라우트를 생성합니다:

- **폴더**: URL 세그먼트 정의
- **파일**: 해당 세그먼트의 UI 정의

예: `/blog/[slug]`는 3개의 세그먼트를 가집니다:

- `/` (루트)
- `blog` (세그먼트)
- `[slug]` (동적 세그먼트)

### 2.3 중첩 레이아웃

레이아웃은 폴더 계층 구조에서 자동으로 중첩됩니다:

```tsx
// app/layout.tsx (루트 레이아웃)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

// app/blog/layout.tsx (블로그 레이아웃)
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="blog-container">
      <aside>사이드바</aside>
      <main>{children}</main>
    </div>
  );
}
```

**렌더링 순서**: Root Layout → Blog Layout → Page

---

## 3. Server vs Client Components

### 3.1 기본 원칙

**중요**: Next.js 16에서는 모든 컴포넌트가 **기본적으로 Server Component**입니다. Client Component는 명시적으로 `"use client"` 디렉티브를 사용해야 합니다.

### 3.2 언제 각각을 사용해야 하는가?

#### Server Components 사용 시기 ✅

- 데이터베이스나 API에서 데이터 페칭
- 백엔드 리소스에 직접 접근
- API 키, 토큰 등 민감한 정보 처리
- 서버에 의존하는 대용량 의존성 사용
- 클라이언트로 전송되는 JavaScript 최소화

#### Client Components 사용 시기 ✅

- 이벤트 리스너 사용 (`onClick`, `onChange` 등)
- State 및 Lifecycle Effects 사용 (`useState`, `useEffect` 등)
- 브라우저 전용 API 사용 (`window`, `localStorage`, `Navigator` 등)
- Custom Hooks 사용
- React Class Components 사용

### 3.3 Client Component 생성

파일 최상단에 `"use client"` 디렉티브 추가:

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count} likes</p>
      <button onClick={() => setCount(count + 1)}>좋아요</button>
    </div>
  );
}
```

**중요**: `"use client"`는 Server와 Client 모듈 그래프 사이의 **경계**를 표시합니다. 해당 파일의 모든 import와 자식 컴포넌트는 클라이언트 번들의 일부로 간주됩니다.

### 3.4 컴포넌트 구성 패턴

#### Server Component를 Client Component에 전달하기

Client Component에 Server Component를 `children`으로 전달할 수 있습니다:

```tsx
// components/modal.tsx (Client Component)
"use client";

export default function Modal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return isOpen ? <div className="modal">{children}</div> : null;
}

// app/page.tsx (Server Component)
import Modal from "@/components/modal";
import ServerData from "@/components/server-data";

export default function Page() {
  return (
    <Modal>
      <ServerData /> {/* Server Component를 children으로 전달 */}
    </Modal>
  );
}
```

이 패턴을 사용하면 Server Component는 서버에서 미리 렌더링되어 Client Component에 전달됩니다.

#### Context Provider 패턴

React Context는 Server Component에서 지원되지 않습니다. Client Component로 감싸야 합니다:

```tsx
// components/theme-provider.tsx (Client Component)
"use client";

import { createContext } from "react";

export const ThemeContext = createContext({});

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;
}

// app/layout.tsx (Server Component)
import ThemeProvider from "@/components/theme-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

**권장사항**: Provider는 트리에서 가능한 한 깊은 곳에 배치하여 정적 Server Component 렌더링을 최적화하세요.

### 3.5 JavaScript 번들 크기 줄이기

큰 섹션 전체를 Client Component로 만들지 말고 **특정 인터랙티브 컴포넌트만** `"use client"`로 표시하세요:

```tsx
// app/layout.tsx (Server Component)
import Search from "./search"; // Client Component
import Logo from "./logo"; // Server Component

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo /> {/* Server Component */}
        <Search /> {/* Client Component만 클라이언트 측에서 실행 */}
      </nav>
      <main>{children}</main>
    </>
  );
}
```

### 3.6 보안: 환경 오염 방지

#### 문제

Server 전용 코드가 실수로 Client Component에 import되면 비밀 정보가 노출될 수 있습니다:

```ts
// lib/data.ts - API_KEY 포함
export async function getData() {
  const res = await fetch("https://external-service.com/data", {
    headers: {
      authorization: process.env.API_KEY, // 노출 위험!
    },
  });
  return res.json();
}
```

#### 해결책 1: `server-only` 패키지 사용

```bash
npm install server-only
```

```ts
// lib/data.ts
import "server-only";

export async function getData() {
  // Server 전용 코드
}
```

Client Component에서 이를 import하려고 하면 **빌드 타임 에러**가 발생합니다.

#### 해결책 2: 환경 변수 규칙

- `NEXT_PUBLIC_` 접두사가 있는 변수만 클라이언트에 노출됩니다
- 다른 모든 환경 변수는 빈 문자열로 대체됩니다

---

## 4. 라우팅과 네비게이션

### 4.1 동적 라우트

폴더 이름을 대괄호로 감싸서 동적 라우트를 생성합니다:

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

**중요**: Next.js 16에서 `params`는 Promise입니다. 반드시 `await`해야 합니다.

### 4.2 Route Props Helpers

TypeScript에서 글로벌 타입 헬퍼를 사용할 수 있습니다 (`next dev` 또는 `next build` 시 자동 생성):

```tsx
// app/blog/[slug]/page.tsx
export default async function Page(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  return <h1>블로그 포스트: {slug}</h1>;
}
```

- **`PageProps<Route>`**: 페이지 컴포넌트용 (`params`, `searchParams` 포함)
- **`LayoutProps<Route>`**: 레이아웃 컴포넌트용 (`children`, named slots 포함)

### 4.3 Search Parameters

Server Component에서는 `searchParams` prop을 사용합니다:

```tsx
// app/search/page.tsx
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { query, category } = await searchParams;
  const results = await searchDatabase(query, category);

  return <ResultsList results={results} />;
}
```

**주의**: `searchParams`를 사용하면 페이지가 **동적 렌더링**으로 전환됩니다.

Client Component에서는 `useSearchParams()` hook을 사용합니다:

```tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function SearchForm() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  return <input defaultValue={query || ""} />;
}
```

### 4.4 네비게이션: Link Component

`<Link>` 컴포넌트를 사용하여 프리페칭 및 클라이언트 측 네비게이션을 활용하세요:

```tsx
import Link from "next/link";

export default function Post({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="hover:underline">
      {post.title}
    </Link>
  );
}
```

#### Link의 이점

- **자동 프리페칭**: viewport에 보이는 링크는 자동으로 프리페치됩니다
- **클라이언트 측 네비게이션**: 전체 페이지 새로고침 없이 라우트 전환
- **상태 보존**: 스크롤 위치 및 클라이언트 상태 유지

고급 네비게이션에는 `useRouter` hook을 사용하세요:

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();

  const handleLogin = async () => {
    await performLogin();
    router.push("/dashboard");
  };

  return <button onClick={handleLogin}>로그인</button>;
}
```

---

## 5. 데이터 페칭 전략

### 5.1 Server Component에서 데이터 페칭

#### Fetch API 사용

```tsx
// app/blog/page.tsx
export default async function BlogPage() {
  const data = await fetch("https://api.example.com/posts");
  const posts = await data.json();

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

**중요**: Next.js 16에서 `fetch`는 기본적으로 캐시되지 않습니다. 명시적으로 캐싱을 활성화해야 합니다:

```tsx
// 무기한 캐시
const data = await fetch("https://...", { cache: "force-cache" });

// 시간 기반 재검증 (ISR)
const data = await fetch("https://...", { next: { revalidate: 3600 } });

// 태그 기반 재검증
const data = await fetch("https://...", { next: { tags: ["posts"] } });
```

#### ORM/Database 직접 사용

```tsx
// app/products/page.tsx
import { db, products } from "@/lib/db";

export default async function ProductsPage() {
  const allProducts = await db.select().from(products);

  return (
    <ul>
      {allProducts.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### 5.2 Client Component에서 데이터 페칭

#### React `use` Hook과 Server Promise

```tsx
// app/posts/page.tsx (Server Component)
import { Suspense } from "react";
import PostsList from "./posts-list";
import PostsSkeleton from "./posts-skeleton";

export default function PostsPage() {
  const postsPromise = getPosts(); // await하지 않음!

  return (
    <Suspense fallback={<PostsSkeleton />}>
      <PostsList postsPromise={postsPromise} />
    </Suspense>
  );
}

// app/posts/posts-list.tsx (Client Component)
("use client");

import { use } from "react";

export default function PostsList({ postsPromise }: { postsPromise: Promise<Post[]> }) {
  const posts = use(postsPromise);

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

#### SWR/React Query 사용

```tsx
"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Posts() {
  const { data, error, isLoading } = useSWR("/api/posts", fetcher);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;

  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### 5.3 순차 vs 병렬 데이터 페칭

#### 순차 페칭 (한 요청이 다른 요청에 의존)

```tsx
export default async function ArtistPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  // 첫 번째 요청
  const artist = await getArtist(username);

  // 두 번째 요청 (첫 번째 결과에 의존)
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<div>플레이리스트 로딩 중...</div>}>
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  );
}

async function Playlists({ artistID }: { artistID: string }) {
  const playlists = await getArtistPlaylists(artistID);
  return (
    <ul>
      {playlists.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

#### 병렬 페칭 (독립적인 요청들)

```tsx
export default async function ArtistPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  // 요청을 즉시 시작 (await하지 않음)
  const artistPromise = getArtist(username);
  const albumsPromise = getAlbums(username);

  // 병렬로 모두 대기
  const [artist, albums] = await Promise.all([artistPromise, albumsPromise]);

  return (
    <>
      <h1>{artist.name}</h1>
      <AlbumsList albums={albums} />
    </>
  );
}
```

**권장사항**: 부분적인 실패를 처리하려면 `Promise.allSettled()`를 사용하세요.

### 5.4 Preloading 패턴

렌더링 전에 데이터 페칭을 적극적으로 시작합니다:

```tsx
// lib/data.ts
import { cache } from "react";
import "server-only";

export const getItem = cache(async (id: string) => {
  // 데이터 페칭
  return await db.query.items.findFirst({ where: eq(items.id, id) });
});

export const preloadItem = (id: string) => {
  void getItem(id); // void는 불필요한 await 방지
};

// app/item/[id]/page.tsx
import { preloadItem, getItem } from "@/lib/data";

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  preloadItem(id); // 미리 페칭 시작

  const isAvailable = await checkAvailability();

  return isAvailable ? <Item id={id} /> : <NotAvailable />;
}

async function Item({ id }: { id: string }) {
  const item = await getItem(id); // 이미 캐시됨!
  return <div>{item.name}</div>;
}
```

### 5.5 Request Deduplication

Next.js는 동일한 렌더 패스 내에서 동일한 `fetch` 요청(GET/HEAD)을 자동으로 중복 제거합니다.

ORM/데이터베이스 호출의 경우 React `cache`를 사용하세요:

```tsx
import { cache } from "react";

export const getUser = cache(async (id: string) => {
  return await db.query.users.findFirst({ where: eq(users.id, id) });
});

// 같은 렌더링에서 여러 번 호출해도 실제로는 한 번만 실행됨
const user1 = await getUser("123");
const user2 = await getUser("123"); // 캐시에서 반환
```

---

## 6. 캐싱과 재검증

### 6.1 캐싱 전략 개요

Next.js 16은 다음과 같은 캐싱 메커니즘을 제공합니다:

| 메커니즘            | 범위            | 지속 시간           | 용도               |
| ------------------- | --------------- | ------------------- | ------------------ |
| Request Memoization | 단일 렌더 패스  | 요청 생명주기       | 중복 요청 제거     |
| Data Cache          | 요청 간         | 영구 (재검증 가능)  | 데이터 캐싱        |
| Full Route Cache    | 요청 간         | 영구 (재검증 가능)  | 정적 렌더링 결과   |
| Router Cache        | 클라이언트 세션 | 세션 또는 시간 기반 | 클라이언트 측 캐싱 |

### 6.2 Fetch API 캐싱

**중요**: Next.js 16에서 `fetch`는 기본적으로 **캐시되지 않습니다**.

```tsx
// 캐시 안 함 (기본값)
const data = await fetch("https://..."); // 매번 새로 가져옴

// 무기한 캐시
const data = await fetch("https://...", { cache: "force-cache" });

// 시간 기반 재검증 (3600초마다)
const data = await fetch("https://...", { next: { revalidate: 3600 } });

// 태그 기반 재검증
const data = await fetch("https://...", { next: { tags: ["products"] } });
```

### 6.3 Cache Components (`use cache`)

Next.js 16의 새로운 기능으로, **어떤 계산이든** 캐시할 수 있습니다 (데이터베이스 쿼리, 파일 작업 등).

```tsx
import { cacheTag, cacheLife } from "next/cache";

export async function getProducts() {
  "use cache";
  cacheTag("products");
  cacheLife("hours");

  const products = await db.query("SELECT * FROM products");
  return products;
}
```

**참고**: `unstable_cache`에서 Cache Components로 마이그레이션하는 것이 권장됩니다.

### 6.4 재검증 방법

#### `revalidateTag` - Stale-While-Revalidate

```tsx
import { revalidateTag } from 'next/cache'

export async function updateProduct(id: string) {
  // 데이터 변경
  await db.update(products).set({ ... }).where(eq(products.id, id))

  // 캐시 재검증 (백그라운드에서 새 데이터 페칭)
  revalidateTag('products', 'max')
}
```

**프로필**:

- `'max'`: 기존 캐시를 제공하면서 백그라운드에서 갱신 (권장)
- 없음 (레거시): 즉시 캐시 만료 (deprecated)

#### `updateTag` - Server Action 전용, 즉시 만료

Read-your-own-writes 시나리오에 적합합니다:

```tsx
import { updateTag } from "next/cache";

export async function createPost(formData: FormData) {
  const post = await db.post.create({
    data: {
      title: formData.get("title"),
      content: formData.get("content"),
    },
  });

  // 즉시 캐시 만료
  updateTag("posts");
  updateTag(`post-${post.id}`);

  redirect(`/posts/${post.id}`);
}
```

| 기능      | `updateTag`          | `revalidateTag`                       |
| --------- | -------------------- | ------------------------------------- |
| 위치      | Server Actions만     | Server Actions + Route Handlers       |
| 동작      | 즉시 만료            | Stale-while-revalidate (with `'max'`) |
| 사용 사례 | Read-your-own-writes | 일반 재검증                           |

#### `revalidatePath` - 경로 기반 재검증

```tsx
import { revalidatePath } from "next/cache";

export async function updateUserProfile(userId: string) {
  // 데이터 변경
  await updateUser(userId);

  // 전체 경로 재검증
  revalidatePath("/profile");
  revalidatePath(`/users/${userId}`);
}
```

### 6.5 캐싱 전략 선택 가이드

```
데이터 페칭을 어디서?
├─ 외부 API
│  └─ fetch with { next: { tags: ['tag-name'] } }
│     └─ 재검증: revalidateTag('tag-name', 'max')
│
└─ 내부 (DB/파일)
   └─ Cache Components with 'use cache' + cacheTag
      └─ 재검증:
         ├─ Server Action: updateTag('tag-name')
         └─ Route Handler: revalidateTag('tag-name', 'max')
```

---

## 7. 스트리밍과 로딩 상태

### 7.1 Streaming이란?

Streaming을 사용하면 서버에서 UI를 점진적으로 렌더링하고 클라이언트에 전송할 수 있습니다. 사용자는 전체 페이지가 렌더링되기 전에 일부 콘텐츠를 볼 수 있습니다.

### 7.2 `loading.tsx`로 Streaming

```tsx
// app/blog/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-4 h-8 w-3/4 rounded bg-gray-200"></div>
      <div className="mb-2 h-4 w-full rounded bg-gray-200"></div>
      <div className="h-4 w-5/6 rounded bg-gray-200"></div>
    </div>
  );
}
```

이 파일은 자동으로 페이지를 `<Suspense>` 경계로 감쌉니다.

### 7.3 `<Suspense>`로 세밀한 Streaming

특정 컴포넌트만 스트리밍하려면:

```tsx
// app/dashboard/page.tsx
import { Suspense } from "react";
import RevenueChart from "@/components/revenue-chart";
import LatestOrders from "@/components/latest-orders";
import ChartSkeleton from "@/components/chart-skeleton";
import OrdersSkeleton from "@/components/orders-skeleton";

export default function DashboardPage() {
  return (
    <div>
      <h1>대시보드</h1>

      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />
      </Suspense>

      <Suspense fallback={<OrdersSkeleton />}>
        <LatestOrders />
      </Suspense>
    </div>
  );
}
```

**이점**:

- 빠른 초기 로딩 (정적 콘텐츠 즉시 표시)
- 느린 데이터 페칭이 전체 페이지를 차단하지 않음
- 향상된 사용자 경험 (점진적 렌더링)

### 7.4 Skeleton 컴포넌트 패턴

```tsx
// components/post-skeleton.tsx
export default function PostSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-3/4 rounded bg-gray-200"></div>
      <div className="h-4 w-full rounded bg-gray-200"></div>
      <div className="h-4 w-5/6 rounded bg-gray-200"></div>
      <div className="h-4 w-4/5 rounded bg-gray-200"></div>
    </div>
  );
}
```

**권장사항**: 실제 콘텐츠의 레이아웃을 반영하는 의미 있는 스켈레톤을 만드세요.

---

## 8. Route Handlers (API Routes)

### 8.1 기본 사용법

Route Handler는 `route.ts` 파일에서 정의됩니다:

```tsx
// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const posts = await db.query.posts.findMany();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newPost = await db.query.posts.create({ data: body });
  return NextResponse.json(newPost, { status: 201 });
}
```

### 8.2 지원되는 HTTP 메서드

- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`
- `HEAD`
- `OPTIONS`

지원되지 않는 메서드는 `405 Method Not Allowed` 응답을 반환합니다.

### 8.3 동적 Route Handler

```tsx
// app/api/posts/[id]/route.ts
import type { NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const post = await db.query.posts.findFirst({ where: eq(posts.id, id) });

  if (!post) {
    return new Response("Not Found", { status: 404 });
  }

  return Response.json(post);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  await db.delete(posts).where(eq(posts.id, id));

  return new Response(null, { status: 204 });
}
```

### 8.4 캐싱 동작

**기본값**: Route Handler는 **캐시되지 않습니다**.

GET 메서드만 캐시 가능:

```tsx
// app/api/data/route.ts
export const dynamic = "force-static";

export async function GET() {
  const data = await fetch("https://api.example.com/data", {
    cache: "force-cache",
  });
  return Response.json(await data.json());
}
```

Cache Components와 함께 사용:

```tsx
import { cacheLife } from "next/cache";

export async function GET() {
  const products = await getProducts();
  return Response.json(products);
}

async function getProducts() {
  "use cache";
  cacheLife("hours");
  return await db.query("SELECT * FROM products");
}
```

**주의**: `use cache`는 Route Handler 본문에 직접 사용할 수 없고, 헬퍼 함수로 추출해야 합니다.

### 8.5 Route 충돌 규칙

- `page.tsx`와 `route.ts`는 **같은 경로에 공존할 수 없습니다**

| Page                  | Route              | 결과    |
| --------------------- | ------------------ | ------- |
| `app/page.tsx`        | `app/route.ts`     | ❌ 충돌 |
| `app/page.tsx`        | `app/api/route.ts` | ✅ 유효 |
| `app/[user]/page.tsx` | `app/api/route.ts` | ✅ 유효 |

### 8.6 Request/Response 예시

```tsx
// app/api/search/route.ts
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // URL 검색 파라미터 읽기
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  // 헤더 읽기
  const userAgent = request.headers.get("user-agent");

  // 쿠키 읽기
  const token = request.cookies.get("token");

  const results = await searchDatabase(query);

  // 응답 생성
  return Response.json(
    { results, userAgent },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60",
        "Content-Type": "application/json",
      },
    }
  );
}
```

---

## 9. 에러 핸들링

### 9.1 `error.tsx` (Error Boundary)

```tsx
// app/blog/error.tsx
"use client"; // Error components는 반드시 Client Component여야 함

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <h2>문제가 발생했습니다!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```

**주의**: `error.tsx`는 **반드시 Client Component**여야 합니다 (`'use client'` 필요).

### 9.2 `not-found.tsx`

```tsx
// app/blog/[slug]/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-12 text-center">
      <h2 className="mb-4 text-2xl font-bold">포스트를 찾을 수 없습니다</h2>
      <p className="mb-4">요청하신 블로그 포스트가 존재하지 않습니다.</p>
      <Link href="/blog" className="text-blue-600 hover:underline">
        블로그 목록으로 돌아가기
      </Link>
    </div>
  );
}
```

페이지에서 수동으로 트리거:

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound(); // not-found.tsx로 이동
  }

  return <article>{post.content}</article>;
}
```

### 9.3 Global Error Handler

```tsx
// app/global-error.tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>전역 에러가 발생했습니다</h2>
        <button onClick={reset}>다시 시도</button>
      </body>
    </html>
  );
}
```

**참고**: `global-error.tsx`는 루트 `layout.tsx`를 대체하므로 자체 `<html>` 및 `<body>` 태그를 정의해야 합니다.

---

## 10. Supabase 통합 패턴

이 프로젝트는 `@supabase/ssr`을 사용하여 쿠키 기반 인증을 구현합니다.

### 10.1 핵심 원칙

**중요**: Supabase 클라이언트를 **절대 전역 변수나 캐시에 저장하지 마세요**. 항상 함수 내에서 새로운 클라이언트를 생성해야 합니다 (Vercel Fluid Compute 호환성을 위해 중요).

### 10.2 세 가지 클라이언트 패턴

#### Pattern 1: Server Components & Route Handlers

```tsx
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component에서는 쿠키 설정 실패 가능 (무시 가능)
          }
        },
      },
    }
  );
}
```

**사용법**:

```tsx
// app/profile/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return <div>환영합니다, {profile.username}님</div>;
}
```

#### Pattern 2: Client Components

```tsx
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
```

**사용법**:

```tsx
// components/login-form.tsx
"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const supabase = createClient();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (!error) {
      router.push("/dashboard");
    }
  };

  return <form onSubmit={handleLogin}>...</form>;
}
```

#### Pattern 3: Middleware

```tsx
// lib/supabase/proxy.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 중요: getClaims() 호출하여 세션 갱신
  const {
    data: { user },
  } = await supabase.auth.getClaims();

  // 인증되지 않은 사용자 리다이렉트
  if (!user && !request.nextUrl.pathname.startsWith("/auth")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

**middleware.ts에서 사용**:

```tsx
// middleware.ts
import { updateSession } from "@/lib/supabase/proxy";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
```

**중요**:

- `getClaims()`를 즉시 호출하여 SSR에서 무작위 로그아웃 방지
- 정확한 `supabaseResponse` 객체를 반환하여 브라우저와 서버 간 쿠키 동기화 유지

### 10.3 타입 안전성

모든 Supabase 클라이언트는 `<Database>` 제네릭으로 타입화됩니다:

```tsx
// lib/supabase/database.types.ts (자동 생성)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
```

**사용 예시**:

```tsx
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export default async function ProfilePage() {
  const supabase = await createClient();

  // 타입 안전성!
  const { data: profile } = await supabase
    .from("profiles") // 자동 완성됨
    .select("*")
    .single();

  // profile의 타입은 Tables<'profiles'>
  return <div>{profile?.username}</div>;
}
```

### 10.4 타입 재생성

스키마가 변경되면 타입을 재생성하세요:

```bash
# Supabase MCP 도구 사용 (권장)
# 또는 Supabase CLI 사용
npx supabase gen types typescript --project-id hbjjytsmhgsgbecthwky > lib/supabase/database.types.ts
```

---

## 11. 개발 워크플로우

### 11.1 npm 명령어

```bash
# 개발 서버 (localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start

# 코드 품질 및 포맷팅
npm run lint              # ESLint 체크
npm run lint:fix          # ESLint 체크 + 자동 수정
npm run format            # Prettier로 모든 파일 포맷팅
npm run format:check      # 파일 수정 없이 포맷 체크
npm run type-check        # TypeScript 타입 체킹
npm run type-check:watch  # 감시 모드로 타입 체킹
```

### 11.2 환경 설정

`.env.local` 파일 생성 (`.env.example`에서 복사):

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

**중요**:

- `NEXT_PUBLIC_` 접두사가 있는 변수만 클라이언트에 노출됩니다
- 민감한 정보 (API 키, 토큰)는 접두사 없이 사용하세요

### 11.3 코드 품질 자동화

#### ESLint 설정 (`eslint.config.mjs`)

```js
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "warn",
    },
  },
];

export default eslintConfig;
```

#### Prettier 설정 (`.prettierrc`)

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

#### Pre-commit Hooks (Husky + lint-staged)

커밋 시 자동으로 실행:

1. 변경된 파일에 Prettier 포맷팅
2. TypeScript 파일에 ESLint 자동 수정
3. 모든 체크가 통과해야 커밋 성공

`package.json` 설정:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["prettier --write", "eslint --fix"],
    "*.{js,jsx,json,css,md}": ["prettier --write"]
  }
}
```

---

## 12. 성능 최적화

### 12.1 클라이언트 측 JavaScript 최소화

#### 원칙

- 기본적으로 Server Component 사용
- 인터랙티브한 부분만 Client Component로 분리
- 큰 라이브러리는 Server Component에서 사용

#### 예시

**나쁜 예**:

```tsx
// app/page.tsx
"use client"; // 전체 페이지를 Client Component로!

import { useState } from "react";
import { MarkdownRenderer } from "heavy-markdown-lib"; // 큰 라이브러리

export default function Page({ content }) {
  const [likes, setLikes] = useState(0);

  return (
    <>
      <MarkdownRenderer content={content} />
      <button onClick={() => setLikes(likes + 1)}>좋아요 {likes}</button>
    </>
  );
}
```

**좋은 예**:

```tsx
// app/page.tsx (Server Component)
import { MarkdownRenderer } from "heavy-markdown-lib";
import LikeButton from "./like-button";

export default function Page({ content }) {
  return (
    <>
      <MarkdownRenderer content={content} /> {/* 서버에서 렌더링 */}
      <LikeButton /> {/* 클라이언트 상호작용만 */}
    </>
  );
}

// app/like-button.tsx (Client Component)
("use client");

import { useState } from "react";

export default function LikeButton() {
  const [likes, setLikes] = useState(0);
  return <button onClick={() => setLikes(likes + 1)}>좋아요 {likes}</button>;
}
```

### 12.2 정적 vs 동적 렌더링

#### 정적 렌더링 (기본값)

빌드 시 사전 렌더링됩니다. 다음 경우에 적합:

- 정적 블로그 포스트
- 제품 페이지
- 마케팅 페이지

#### 동적 렌더링으로 전환되는 경우

다음 중 하나를 사용하면 자동으로 동적 렌더링:

- `cookies()`, `headers()` 사용
- `searchParams` prop 사용
- `fetch`에서 `cache: 'no-store'` 사용
- Route Config: `export const dynamic = 'force-dynamic'`

### 12.3 번들 크기 최적화

#### 동적 import 사용

```tsx
import dynamic from "next/dynamic";

// 클라이언트 측 렌더링 + 코드 분할
const DynamicChart = dynamic(() => import("@/components/chart"), {
  loading: () => <ChartSkeleton />,
  ssr: false, // 서버 측 렌더링 비활성화
});

export default function Dashboard() {
  return <DynamicChart data={chartData} />;
}
```

#### 컴포넌트별 번들 분석

```tsx
// 필요한 모듈만 import
import { formatDate } from "date-fns/formatDate"; // ✅ 특정 함수만
// import * as dateFns from 'date-fns'            // ❌ 전체 라이브러리
```

---

## 13. TypeScript 모범 사례

### 13.1 Route Props Helpers 사용

```tsx
// app/blog/[slug]/page.tsx
export default async function Page(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const { category, tag } = await props.searchParams;

  return <BlogPost slug={slug} category={category} tag={tag} />;
}

// app/dashboard/layout.tsx
export default function Layout(props: LayoutProps<"/dashboard">) {
  return (
    <div className="dashboard">
      <Sidebar />
      {props.children}
    </div>
  );
}
```

**이점**:

- 타입 안전성
- 자동 완성
- 리팩토링 시 타입 에러 감지

### 13.2 Supabase 타입 안전성

```tsx
import type { Database, Tables } from "@/lib/supabase/database.types";

// Row 타입
type Profile = Tables<"profiles">;

// Insert 타입
type ProfileInsert = TablesInsert<"profiles">;

// Update 타입
type ProfileUpdate = TablesUpdate<"profiles">;

// 사용 예시
async function updateProfile(userId: string, updates: ProfileUpdate) {
  const supabase = await createClient();
  return await supabase.from("profiles").update(updates).eq("id", userId);
}
```

### 13.3 Strict Mode 준수

`tsconfig.json`에서 엄격 모드가 활성화되어 있습니다:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

**권장사항**:

- 타입 단언(`as`) 최소화
- `any` 타입 피하기 (경고로 설정됨)
- 옵셔널 체이닝 (`?.`) 활용
- Null 체크 철저히

---

## 14. 보안 모범 사례

### 14.1 `server-only` 패키지 사용

서버 전용 코드가 클라이언트에 노출되는 것을 방지:

```bash
npm install server-only
```

```tsx
// lib/auth/session.ts
import "server-only";

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function validateApiKey(apiKey: string) {
  // 민감한 검증 로직
  return apiKey === process.env.INTERNAL_API_KEY;
}
```

### 14.2 환경 변수 보안

#### 클라이언트 노출 규칙

```bash
# .env.local

# ✅ 클라이언트에 노출됨
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX

# ❌ 클라이언트에 노출되지 않음 (서버만)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

#### 실수 방지

```tsx
// ❌ 나쁜 예 - 클라이언트에서 서버 키 사용 시도
"use client";

export default function BadComponent() {
  const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // undefined!
  // ...
}

// ✅ 좋은 예 - 서버에서만 사용
export async function getAdminData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // 서버만 접근 가능
  );
  // ...
}
```

### 14.3 Supabase RLS (Row Level Security)

Supabase 테이블에 항상 RLS를 활성화하세요:

```sql
-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 정책: 사용자는 자신의 프로필만 조회
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 정책: 사용자는 자신의 프로필만 업데이트
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

**원칙**:

- 모든 테이블에 RLS 활성화
- 최소 권한 원칙 적용
- Service Role 키는 절대 클라이언트에 노출 금지

### 14.4 XSS 방지

React는 기본적으로 XSS를 방지하지만, `dangerouslySetInnerHTML`은 피하세요:

```tsx
// ❌ 위험
<div dangerouslySetInnerHTML={{ __html: userContent }} />;

// ✅ 안전 - 라이브러리 사용
import DOMPurify from "isomorphic-dompurify";

<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />;
```

---

## 15. 자주하는 실수와 해결책

### 15.1 Supabase 클라이언트 캐싱 ❌

**잘못된 예**:

```tsx
// ❌ 절대 이렇게 하지 마세요!
const supabase = await createClient(); // 전역 변수

export default async function Page() {
  const { data } = await supabase.from("posts").select();
  return <PostsList posts={data} />;
}
```

**올바른 예**:

```tsx
// ✅ 함수 내에서 매번 생성
export default async function Page() {
  const supabase = await createClient(); // 함수 내부에서 생성
  const { data } = await supabase.from("posts").select();
  return <PostsList posts={data} />;
}
```

### 15.2 params/searchParams await 누락 ❌

**잘못된 예**:

```tsx
// ❌ Next.js 16에서는 에러 발생
export default function Page({ params }) {
  const { id } = params; // Promise를 await하지 않음!
  return <div>{id}</div>;
}
```

**올바른 예**:

```tsx
// ✅ async/await 사용
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div>{id}</div>;
}
```

### 15.3 "use client" 디렉티브 위치 ❌

**잘못된 예**:

```tsx
import { useState } from "react";

// ❌ import 아래에 위치
("use client");

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**올바른 예**:

```tsx
// ✅ 파일 최상단
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 15.4 Middleware 응답 처리 ❌

**잘못된 예**:

```tsx
// ❌ 새로운 Response 생성
export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  return NextResponse.next(); // 쿠키 손실!
}
```

**올바른 예**:

```tsx
// ✅ updateSession의 응답을 그대로 반환
export async function middleware(request: NextRequest) {
  return await updateSession(request); // 쿠키 유지
}
```

### 15.5 Route Handler와 page.tsx 충돌 ❌

**잘못된 예**:

```
app/
└── api/
    ├── page.tsx   ❌ 충돌!
    └── route.ts   ❌ 충돌!
```

**올바른 예**:

```
app/
├── api/
│   └── posts/
│       └── route.ts  ✅ API 엔드포인트
└── posts/
    └── page.tsx      ✅ UI 페이지
```

### 15.6 fetch 캐싱 가정 ❌

**잘못된 예 (Next.js 15에서의 오래된 습관)**:

```tsx
// ❌ Next.js 16에서는 캐시되지 않음!
const data = await fetch("https://api.example.com/posts");
```

**올바른 예**:

```tsx
// ✅ 명시적으로 캐싱 설정
const data = await fetch("https://api.example.com/posts", {
  cache: "force-cache", // 또는 next: { revalidate: 3600 }
});
```

---

## 16. 빠른 참조

### 16.1 파일 컨벤션 치트시트

| 파일            | 용도           | Client/Server     |
| --------------- | -------------- | ----------------- |
| `layout.tsx`    | 공유 레이아웃  | Server (기본)     |
| `page.tsx`      | 페이지 UI      | Server (기본)     |
| `loading.tsx`   | 로딩 UI        | Server            |
| `error.tsx`     | 에러 UI        | **Client** (필수) |
| `not-found.tsx` | 404 페이지     | Server            |
| `route.ts`      | API 엔드포인트 | Server            |
| `middleware.ts` | 미들웨어       | Edge Runtime      |

### 16.2 Server vs Client 결정 트리

```
컴포넌트가 필요한가?
├─ 이벤트 리스너 (onClick, onChange 등)
│  └─ ✅ Client Component
│
├─ State/Effects (useState, useEffect 등)
│  └─ ✅ Client Component
│
├─ 브라우저 API (window, localStorage 등)
│  └─ ✅ Client Component
│
├─ Custom Hooks
│  └─ ✅ Client Component
│
└─ 그 외 모든 경우
   └─ ✅ Server Component (기본값)
```

### 16.3 캐싱 전략 치트시트

```
어떤 데이터를 캐시할까?
│
├─ 외부 API 데이터
│  └─ fetch with { next: { tags: ['tag'] } }
│     └─ 재검증: revalidateTag('tag', 'max')
│
├─ 데이터베이스 쿼리
│  └─ Cache Component with 'use cache' + cacheTag
│     └─ 재검증:
│        ├─ Server Action: updateTag('tag')
│        └─ Route Handler: revalidateTag('tag', 'max')
│
└─ 전체 라우트
   └─ revalidatePath('/path')
```

### 16.4 Supabase 클라이언트 선택

```
어디서 실행될까?
│
├─ Server Component / Route Handler
│  └─ import { createClient } from '@/lib/supabase/server'
│     └─ const supabase = await createClient()
│
├─ Client Component
│  └─ import { createClient } from '@/lib/supabase/client'
│     └─ const supabase = createClient()
│
└─ Middleware
   └─ import { updateSession } from '@/lib/supabase/proxy'
      └─ return await updateSession(request)
```

### 16.5 데이터 페칭 패턴 선택

```
데이터 페칭 전략 선택
│
├─ 순차적 (A가 B에 의존)
│  └─ const a = await fetchA()
│     └─ const b = await fetchB(a.id)
│
├─ 병렬적 (독립적인 요청)
│  └─ const [a, b] = await Promise.all([fetchA(), fetchB()])
│
├─ 스트리밍 (점진적 렌더링)
│  └─ <Suspense fallback={<Skeleton />}>
│        <AsyncComponent />
│     </Suspense>
│
└─ Preloading (미리 페칭)
   └─ preload(id) // 렌더링 전 시작
      └─ const data = await getData(id) // 나중에 사용
```

### 16.6 환경 변수 네이밍

```bash
# 클라이언트 노출 (브라우저에서 접근 가능)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX

# 서버 전용 (브라우저에서 접근 불가)
DATABASE_URL=postgresql://...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
OPENAI_API_KEY=sk-...
```

### 16.7 자주 사용하는 명령어

```bash
# 개발
npm run dev                 # 개발 서버 시작
npm run build              # 프로덕션 빌드
npm start                  # 프로덕션 서버

# 코드 품질
npm run lint               # ESLint 체크
npm run lint:fix           # ESLint 자동 수정
npm run format             # Prettier 포맷팅
npm run type-check         # TypeScript 타입 체크

# Supabase
npx supabase gen types typescript --project-id PROJECT_ID > lib/supabase/database.types.ts
```

---

## 마치며

이 가이드는 Next.js 16.1.1과 Supabase를 사용한 현대적인 웹 애플리케이션 개발의 핵심 개념과 모범 사례를 다룹니다.

### 핵심 원칙 요약

1. **Server Component 우선** - 기본적으로 Server Component를 사용하고, 필요시에만 Client Component 사용
2. **명시적 캐싱** - Next.js 16은 opt-in 캐싱 방식. 필요한 곳에 명시적으로 캐싱 설정
3. **타입 안전성** - TypeScript와 자동 생성된 타입을 활용하여 개발 시 오류 조기 발견
4. **보안 우선** - `server-only`, 환경 변수 규칙, RLS를 활용한 다층 보안
5. **성능 최적화** - 스트리밍, 코드 분할, 적절한 캐싱으로 최적의 사용자 경험 제공

### 추가 학습 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [React 공식 문서](https://react.dev)
- [Supabase 문서](https://supabase.com/docs)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/handbook/intro.html)

### 프로젝트 관련 문서

- `/CLAUDE.md` - 프로젝트 개요 및 아키텍처
- `/README.md` - 프로젝트 설정 및 시작 가이드

---

**문서 버전**: 1.0
**최종 업데이트**: 2026-01-01
**작성**: Claude Code Assistant
