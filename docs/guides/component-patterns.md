# 컴포넌트 패턴 가이드

이 문서는 Next.js 16.1.1 + React 19 환경에서 효율적이고 재사용 가능한 컴포넌트 작성 패턴을 제공합니다.

**문서 버전:** 2.0
**Next.js 버전:** 16.1.1
**React 버전:** 19.0.0
**최종 업데이트:** 2026-01-04

**주요 변경사항 (Next.js 15 → 16):**

- params와 searchParams가 이제 Promise 타입 (반드시 await 필요)
- Client Component에서 use() hook으로 Promise unwrap
- Route Handler의 context.params도 Promise로 변경

## 🧩 기본 설계 원칙

### 1. 단일 책임 원칙 (Single Responsibility)

```tsx
// ✅ 각 컴포넌트가 하나의 명확한 책임
export function UserAvatar({ user, size = "md" }) {
  return (
    <Avatar className={avatarSizes[size]}>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}

export function UserStatus({ isOnline }) {
  return <div className={cn("h-3 w-3 rounded-full", isOnline ? "bg-green-500" : "bg-gray-400")} />;
}

// ❌ 여러 책임이 섞인 컴포넌트
export function UserCard({ user }) {
  // 아바타 + 상태 + 프로필 + 액션 버튼 + 통계... (너무 많은 책임)
}
```

### 2. 컴포지션 우선 (Composition over Inheritance)

```tsx
// ✅ 컴포지션 패턴
export function Card({ children, className, ...props }) {
  return (
    <div className={cn("rounded-lg border bg-card p-6", className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-6", className)} {...props}>
      {children}
    </div>
  )
}

// 사용법
<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>설명</CardDescription>
  </CardHeader>
  <CardContent>내용</CardContent>
</Card>

// ❌ 상속 패턴 (리액트에는 부적합)
class BaseCard extends Component { ... }
class UserCard extends BaseCard { ... }
```

## 🔄 Server vs Client Components

### Server Components (기본값)

```tsx
// ✅ Server Component (데이터 패칭, SEO 중요)
import { Suspense } from "react";

export default async function UserListPage() {
  // 서버에서 데이터 패칭
  const users = await getUsers();

  return (
    <div>
      <h1>사용자 목록</h1>
      <Suspense fallback={<UserListSkeleton />}>
        <UserList users={users} />
      </Suspense>
    </div>
  );
}

// 서버 컴포넌트에서 서버 전용 유틸리티 사용 가능
async function UserList({ users }) {
  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

### Client Components ('use client' 필요)

```tsx
"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";

// ✅ Client Component (상호작용, 상태 관리)
export function UserSearchForm() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="사용자 검색..."
      />
      <SearchResults results={results} />
    </div>
  );
}

// ✅ React 19 useActionState 활용
export function UserForm() {
  const [state, formAction, isPending] = useActionState(updateUserAction, {
    success: false,
    message: "",
  });

  return (
    <form action={formAction}>
      <input name="name" required />
      <button type="submit" disabled={isPending}>
        {isPending ? "저장 중..." : "저장"}
      </button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

### Server-Client 경계 설정

```tsx
// ✅ 적절한 경계 설정 (Next.js 16)
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Next.js 16에서 params는 Promise
  const product = await getProduct(id); // 서버에서 데이터 패칭

  return (
    <div>
      {/* 서버 컴포넌트 영역 */}
      <ProductInfo product={product} />
      <ProductImages images={product.images} />

      {/* 클라이언트 컴포넌트 영역 */}
      <ProductInteractions productId={product.id} />
    </div>
  );
}

// 클라이언트 컴포넌트는 별도 파일로 분리
("use client");
export function ProductInteractions({ productId }) {
  const [liked, setLiked] = useState(false);
  // 상호작용 로직...
}
```

### Client Component에서 params 사용하기

Next.js 16에서 Client Component로 params를 전달할 때는 **React 19의 `use()` hook**을 사용하여 Promise를 unwrap합니다.

```tsx
// ✅ Server Component에서 Client Component로 params 전달
import { ClientProductDetails } from "./ClientProductDetails";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Server Component에서는 Promise 자체를 전달
  return (
    <div>
      <h1>Product Page</h1>
      <ClientProductDetails paramsPromise={params} />
    </div>
  );
}
```

```tsx
// ClientProductDetails.tsx
"use client";

import { use } from "react"; // React 19의 use() hook

interface ClientProductDetailsProps {
  paramsPromise: Promise<{ id: string }>;
}

export function ClientProductDetails({ paramsPromise }: ClientProductDetailsProps) {
  // use() hook으로 Promise unwrap
  const { id } = use(paramsPromise);

  return (
    <div>
      <p>Product ID from Client Component: {id}</p>
      {/* Client-side 상호작용 로직 */}
    </div>
  );
}
```

**중요 패턴:**

```tsx
// ✅ 올바른 패턴: Promise를 props로 전달
<ClientComponent paramsPromise={params} />

// ❌ 잘못된 패턴: Server Component에서 await한 값 전달
const { id } = await params
<ClientComponent id={id} /> // 이렇게 하면 use() hook을 사용할 수 없음

// ❌ 금지: Client Component를 async 함수로 선언
'use client'
export default async function ClientComponent({ params }) { // 불가능!
  const { id } = await params
}
```

**실제 프로젝트 예제:**

프로젝트의 `app/(mobile)/events/[id]/page.tsx`에서 볼 수 있듯이, Server Component에서 params를 직접 처리하는 것이 권장됩니다:

```tsx
// app/(mobile)/events/[id]/page.tsx
export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Server Component에서 await

  return (
    <div>
      <h1>Event Details</h1>
      <p>Event ID: {id}</p>
      {/* Client Component에는 필요한 데이터만 전달 */}
      <EventInteractions eventId={id} />
    </div>
  );
}
```

## 🎯 Props 설계 패턴

### 1. Props Interface 정의

```tsx
// ✅ 명확한 Props 타입 정의
interface ButtonProps {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Button({
  children,
  variant = "default",
  size = "default",
  disabled = false,
  loading = false,
  onClick,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? <Spinner className="mr-2" /> : null}
      {children}
    </button>
  );
}
```

### 2. Polymorphic Components

```tsx
// ✅ 다형성 컴포넌트 (as prop 패턴)
interface TextProps<T extends React.ElementType = 'p'> {
  as?: T
  children: React.ReactNode
  variant?: 'body' | 'caption' | 'subtitle'
  className?: string
}

export function Text<T extends React.ElementType = 'p'>({
  as,
  children,
  variant = 'body',
  className,
  ...props
}: TextProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof TextProps>) {
  const Component = as || 'p'

  return (
    <Component
      className={cn(textVariants[variant], className)}
      {...props}
    >
      {children}
    </Component>
  )
}

// 사용법
<Text>기본 단락</Text>
<Text as="h1" variant="subtitle">제목</Text>
<Text as="span" variant="caption">캡션</Text>
```

### 3. Render Props 패턴

```tsx
// ✅ Render Props 패턴
interface DataFetcherProps<T> {
  url: string;
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode;
}

export function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchData(url)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return children(data, loading, error);
}

// 사용법
<DataFetcher<User[]> url="/api/users">
  {(users, loading, error) => {
    if (loading) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;
    return <UserList users={users || []} />;
  }}
</DataFetcher>;
```

### 4. Next.js 16 라우트 Props 패턴

Next.js 16에서는 페이지와 레이아웃의 props가 모두 Promise 타입이 되었습니다. 타입 안전성을 위해 명확한 타입 정의가 필요합니다.

```tsx
// ✅ Page Component Props 타입 정의
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ query?: string; page?: string }>;
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { query, page } = await searchParams;

  return (
    <div>
      <h1>Product {id}</h1>
      {query && <p>Search: {query}</p>}
      {page && <p>Page: {page}</p>}
    </div>
  );
}
```

```tsx
// ✅ Layout Component Props 타입 정의
interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// ✅ 중첩 동적 라우트 (Nested Dynamic Routes)
// app/shop/[category]/[productId]/page.tsx
interface ShopPageProps {
  params: Promise<{
    category: string;
    productId: string;
  }>;
  searchParams: Promise<{
    variant?: string;
    size?: string;
  }>;
}

export default async function ShopPage({ params, searchParams }: ShopPageProps) {
  const { category, productId } = await params;
  const { variant, size } = await searchParams;

  return (
    <div>
      <h1>Category: {category}</h1>
      <h2>Product ID: {productId}</h2>
      {variant && <p>Variant: {variant}</p>}
      {size && <p>Size: {size}</p>}
    </div>
  );
}
```

**타입 헬퍼 활용:**

```tsx
// ✅ 재사용 가능한 타입 유틸리티
type AsyncParams<T> = Promise<T>;
type AsyncSearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface BasePageProps<TParams = Record<string, string>> {
  params: AsyncParams<TParams>;
  searchParams: AsyncSearchParams;
}

// 사용 예시
type BlogPageProps = BasePageProps<{ slug: string }>;
type UserPageProps = BasePageProps<{ userId: string }>;

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { slug } = await params;
  // ...
}
```

**실제 프로젝트 예제:**

```tsx
// app/(mobile)/share/[token]/page.tsx
export default async function SharedEventPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Shared Event</h1>
      <p className="text-muted-foreground mt-2">Share Token: {token}</p>
    </div>
  );
}
```

## 🔄 재사용성 패턴

### 1. 컴포넌트 변형 (Variants)

```tsx
import { cva, type VariantProps } from "class-variance-authority";

// ✅ CVA로 변형 정의
const cardVariants = cva("rounded-lg border bg-card text-card-foreground shadow-sm", {
  variants: {
    variant: {
      default: "border-border",
      outline: "border-2",
      ghost: "border-transparent shadow-none",
    },
    size: {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

interface CardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ variant, size, className, children, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, size }), className)} {...props}>
      {children}
    </div>
  );
}
```

### 2. 컴파운드 컴포넌트 패턴

```tsx
// ✅ 컴파운드 컴포넌트 패턴
interface AccordionContextType {
  openItems: Set<string>;
  toggle: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

export function Accordion({ children, type = "single" }) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = (value: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        if (type === "single") {
          newSet.clear();
        }
        newSet.add(value);
      }
      return newSet;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ value, children }) {
  return <div data-value={value}>{children}</div>;
}

export function AccordionTrigger({ children, value }) {
  const { toggle } = useContext(AccordionContext);
  return (
    <button onClick={() => toggle(value)} className="accordion-trigger">
      {children}
    </button>
  );
}

export function AccordionContent({ children, value }) {
  const { openItems } = useContext(AccordionContext);
  const isOpen = openItems.has(value);

  return isOpen ? <div className="accordion-content">{children}</div> : null;
}

// 사용법
<Accordion type="multiple">
  <AccordionItem value="item-1">
    <AccordionTrigger value="item-1">질문 1</AccordionTrigger>
    <AccordionContent value="item-1">답변 1</AccordionContent>
  </AccordionItem>
</Accordion>;
```

## ⚡ 성능 최적화 패턴

### 1. 메모이제이션

```tsx
import { memo, useMemo, useCallback } from "react";

// ✅ React.memo로 불필요한 리렌더링 방지
export const ExpensiveComponent = memo(function ExpensiveComponent({
  data,
  onUpdate,
}: {
  data: ComplexData[];
  onUpdate: (id: string) => void;
}) {
  // 복잡한 계산을 메모이제이션
  const processedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      calculated: expensiveCalculation(item),
    }));
  }, [data]);

  // 콜백 함수 메모이제이션
  const handleUpdate = useCallback(
    (id: string) => {
      onUpdate(id);
    },
    [onUpdate]
  );

  return (
    <div>
      {processedData.map((item) => (
        <ExpensiveItem key={item.id} item={item} onUpdate={handleUpdate} />
      ))}
    </div>
  );
});
```

### 2. 지연 로딩 (Lazy Loading)

```tsx
import { lazy, Suspense } from "react";

// ✅ 동적 import로 코드 분할
const HeavyComponent = lazy(() => import("./HeavyComponent"));
const Chart = lazy(() => import("@/components/charts/Chart"));

export function Dashboard() {
  return (
    <div>
      <h1>대시보드</h1>

      <Suspense fallback={<div>차트 로딩 중...</div>}>
        <Chart />
      </Suspense>

      <Suspense fallback={<div>컴포넌트 로딩 중...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}
```

### 3. 가상화 (Virtualization)

```tsx
// ✅ 큰 리스트 가상화
import { FixedSizeList as List } from "react-window";

interface VirtualizedListProps {
  items: any[];
  itemHeight: number;
  height: number;
}

export function VirtualizedList({ items, itemHeight, height }: VirtualizedListProps) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ListItem item={items[index]} />
    </div>
  );

  return (
    <List height={height} itemCount={items.length} itemSize={itemHeight}>
      {Row}
    </List>
  );
}
```

## 🛡️ 타입 안전성 패턴

### 1. 제네릭 컴포넌트

```tsx
// ✅ 타입 안전한 제네릭 컴포넌트
interface SelectProps<T> {
  options: T[];
  value?: T;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
  getValue: (option: T) => string;
  className?: string;
}

export function Select<T>({
  options,
  value,
  onChange,
  getLabel,
  getValue,
  className,
}: SelectProps<T>) {
  return (
    <select
      value={value ? getValue(value) : ""}
      onChange={(e) => {
        const selectedValue = options.find((option) => getValue(option) === e.target.value);
        if (selectedValue) onChange(selectedValue);
      }}
      className={className}
    >
      {options.map((option) => (
        <option key={getValue(option)} value={getValue(option)}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}

// 사용법 (완전한 타입 추론)
<Select<User>
  options={users}
  value={selectedUser}
  onChange={setSelectedUser}
  getLabel={(user) => user.name}
  getValue={(user) => user.id}
/>;
```

### 2. 조건부 타입

```tsx
// ✅ 조건부 props 타입
type ButtonProps<T extends boolean = false> = {
  children: React.ReactNode;
  loading?: T;
} & (T extends true
  ? { onClick?: never; disabled?: boolean }
  : { onClick: () => void; disabled?: boolean });

export function Button<T extends boolean = false>(props: ButtonProps<T>) {
  const { children, loading, onClick, disabled, ...restProps } = props;

  return (
    <button onClick={loading ? undefined : onClick} disabled={disabled || loading} {...restProps}>
      {loading ? <Spinner /> : children}
    </button>
  );
}
```

### 3. Next.js 16 Route Props 타입 헬퍼

Next.js 16에서는 Route Props의 타입 안전성을 위한 헬퍼 타입을 활용할 수 있습니다.

```tsx
// ✅ generateMetadata 타입 안전성
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params; // 반드시 await 필요

  const product = await getProduct(id);

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { preview } = await searchParams;

  // ...
}
```

```tsx
// ✅ Route Handler 타입 정의
// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params; // Route Handler도 Promise

  const product = await getProduct(id);

  return NextResponse.json(product);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  await deleteProduct(id);

  return NextResponse.json({ success: true });
}
```

```tsx
// ✅ 재사용 가능한 타입 헬퍼
// lib/types/routes.ts
export type RouteParams<T = Record<string, string>> = Promise<T>;

export type RouteSearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export interface PagePropsBase<TParams = Record<string, string>> {
  params: RouteParams<TParams>;
  searchParams: RouteSearchParams;
}

export interface LayoutPropsBase<TParams = Record<string, string>> {
  children: React.ReactNode;
  params: RouteParams<TParams>;
}

export interface RouteContextBase<TParams = Record<string, string>> {
  params: RouteParams<TParams>;
}

// 사용 예시
type ProductPageProps = PagePropsBase<{ id: string }>;
type CategoryLayoutProps = LayoutPropsBase<{ category: string }>;
type ApiRouteContext = RouteContextBase<{ userId: string }>;
```

```tsx
// ✅ 실제 프로젝트 예제: generateMetadata with async params
// app/(mobile)/events/[id]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Event ${id}`,
    description: `Event details for event ${id}`,
  };
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div>
      <h1>Event Details</h1>
      <p>Event ID: {id}</p>
    </div>
  );
}
```

**타입 안전성 체크리스트:**

- ✅ params는 항상 `Promise<T>` 타입
- ✅ searchParams는 항상 `Promise<{ [key: string]: string | string[] | undefined }>` 타입
- ✅ generateMetadata와 Page에서 동일한 타입 사용
- ✅ Route Handler의 context.params도 Promise 타입
- ✅ await 없이 params 접근 시 TypeScript 에러 발생

## 🎨 고급 패턴

### 1. Hook 기반 상태 관리

```tsx
// ✅ 커스텀 훅으로 로직 분리
function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((prev) => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse, setValue };
}

// 컴포넌트에서 사용
export function Modal({ children }) {
  const { value: isOpen, setTrue: open, setFalse: close } = useToggle();

  return (
    <>
      <button onClick={open}>모달 열기</button>
      {isOpen && <Dialog onClose={close}>{children}</Dialog>}
    </>
  );
}
```

### 2. Context + Reducer 패턴

```tsx
// ✅ 복잡한 상태 관리
interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
        total: calculateTotal([...state.items, action.payload]),
      };
    // 다른 케이스들...
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: Dispatch<CartAction>;
} | null>(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
```

## 🚫 안티패턴 및 금지사항

### ❌ 피해야 할 패턴

```tsx
// 너무 많은 props
function OverloadedComponent({
  prop1,
  prop2,
  prop3,
  prop4,
  prop5,
  prop6,
  prop7,
  prop8,
  prop9,
  prop10,
}) {
  // 너무 많은 책임
}

// 깊은 props drilling
function App() {
  const user = useUser();
  return <Level1 user={user} />;
}
function Level1({ user }) {
  return <Level2 user={user} />;
}
function Level2({ user }) {
  return <Level3 user={user} />;
}

// 거대한 컴포넌트
function GiantComponent() {
  // 500줄 이상의 JSX와 로직
  return <div>{/* 엄청난 양의 JSX */}</div>;
}

// 불필요한 래핑
function UnnecessaryWrapper({ children }) {
  return <div>{children}</div>; // 의미 없는 div
}

// 인라인 객체/함수 생성
function BadComponent() {
  return (
    <ExpensiveComponent
      config={{ option: "value" }} // 매 렌더링마다 새 객체
      onUpdate={() => {}} // 매 렌더링마다 새 함수
    />
  );
}
```

### ❌ Next.js 16 특수 안티패턴

Next.js 16에서 반드시 피해야 할 패턴들입니다.

```tsx
// ❌ params await 누락
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // 오류: params는 Promise이므로 직접 접근 불가
  const product = await getProduct(params.id); // TypeError!

  return <div>{product.name}</div>;
}

// ✅ 올바른 패턴
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // await 필수
  const product = await getProduct(id);

  return <div>{product.name}</div>;
}
```

```tsx
// ❌ searchParams await 누락
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  // 오류: searchParams도 Promise
  const query = searchParams.query; // TypeError!

  return <div>Search: {query}</div>;
}

// ✅ 올바른 패턴
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams; // await 필수

  return <div>Search: {query || "No query"}</div>;
}
```

```tsx
// ❌ generateMetadata에서 params 잘못 처리
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  // 오류: await 없이 접근
  const product = await getProduct(params.id); // TypeError!

  return {
    title: product.name,
  };
}

// ✅ 올바른 패턴
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // 먼저 params await
  const product = await getProduct(id);

  return {
    title: product.name,
  };
}
```

```tsx
// ❌ Client Component를 async 함수로 선언
"use client";

// 오류: Client Component는 async 함수가 될 수 없음
export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // 불가능!
  return <div>{id}</div>;
}

// ✅ 올바른 패턴 1: Server Component에서 처리
export default async function ServerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div>
      {/* Client Component에는 필요한 값만 전달 */}
      <ClientComponent id={id} />
    </div>
  );
}

// ✅ 올바른 패턴 2: use() hook 사용
("use client");
import { use } from "react";

export default function ClientPage({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = use(paramsPromise); // use() hook으로 unwrap
  return <div>{id}</div>;
}
```

```tsx
// ❌ Route Handler에서 params await 누락
// app/api/users/[id]/route.ts
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // 오류: params는 Promise
  const user = await getUser(params.id); // TypeError!
  return NextResponse.json(user);
}

// ✅ 올바른 패턴
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // await 필수
  const user = await getUser(id);
  return NextResponse.json(user);
}
```

**Next.js 16 안티패턴 체크리스트:**

- ❌ params를 await 없이 직접 접근
- ❌ searchParams를 await 없이 직접 접근
- ❌ generateMetadata에서 params await 누락
- ❌ Client Component를 async 함수로 선언
- ❌ Route Handler에서 context.params await 누락
- ❌ Layout에서 params await 누락

## ✅ 컴포넌트 작성 체크리스트

새 컴포넌트 작성 시 확인사항:

### 설계

- [ ] 단일 책임 원칙 준수
- [ ] 적절한 컴포지션 활용
- [ ] 재사용 가능성 고려

### 타입 안전성

- [ ] Props 인터페이스 정의
- [ ] 제네릭 활용 (필요시)
- [ ] 조건부 타입 활용 (필요시)

### 성능

- [ ] 불필요한 리렌더링 방지
- [ ] 메모이제이션 적절히 활용
- [ ] 큰 리스트 가상화 고려

### Server/Client 분리

- [ ] Server Component 우선 고려
- [ ] 'use client' 최소화
- [ ] 적절한 경계 설정

### Next.js 16 특수 요구사항

- [ ] params는 반드시 `Promise<T>` 타입으로 정의
- [ ] params 접근 전에 `await` 사용
- [ ] searchParams 접근 전에 `await` 사용
- [ ] generateMetadata에서 params await 확인
- [ ] Route Handler에서 context.params await 확인
- [ ] Client Component를 async 함수로 선언하지 않음
- [ ] Client Component에서 Promise를 unwrap할 때 `use()` hook 사용

### 접근성

- [ ] 의미있는 HTML 태그 사용
- [ ] ARIA 속성 추가
- [ ] 키보드 네비게이션 지원

### 코드 품질

- [ ] ESLint 규칙 준수
- [ ] 300줄 이하 유지
- [ ] 명확한 네이밍

이 패턴들을 활용하여 유지보수하기 쉽고 확장 가능한 컴포넌트를 작성해보세요!

---

## 🔄 Next.js 15 → 16 마이그레이션 가이드

Next.js 15에서 16으로 업그레이드할 때 필요한 변경사항을 단계별로 안내합니다.

### 1. Page Component 업데이트

```tsx
// ❌ Next.js 15 패턴
export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);

  return <div>{product.name}</div>;
}

// ✅ Next.js 16 패턴
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // await 추가
  const product = await getProduct(id);

  return <div>{product.name}</div>;
}
```

### 2. searchParams 업데이트

```tsx
// ❌ Next.js 15 패턴
export default async function SearchPage({ searchParams }) {
  const query = searchParams.query;
  const page = searchParams.page;

  return <div>Search: {query}</div>;
}

// ✅ Next.js 16 패턴
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { query, page } = await searchParams; // await 추가

  return <div>Search: {query || ""}</div>;
}
```

### 3. generateMetadata 업데이트

```tsx
// ❌ Next.js 15 패턴
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);

  return {
    title: product.name,
  };
}

// ✅ Next.js 16 패턴
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params; // await 추가
  const product = await getProduct(id);

  return {
    title: product.name,
  };
}
```

### 4. Route Handler 업데이트

```tsx
// ❌ Next.js 15 패턴
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUser(params.id);
  return NextResponse.json(user);
}

// ✅ Next.js 16 패턴
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // await 추가
  const user = await getUser(id);
  return NextResponse.json(user);
}
```

### 5. Layout Component 업데이트

```tsx
// ❌ Next.js 15 패턴
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={params.locale}>
      <body>{children}</body>
    </html>
  );
}

// ✅ Next.js 16 패턴
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params; // await 추가

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
```

### 6. Client Component 패턴

Client Component에서 params가 필요한 경우:

```tsx
// ❌ Next.js 15 패턴
"use client";

export default function ClientPage({ params }) {
  const id = params.id;
  return <div>{id}</div>;
}

// ✅ Next.js 16 패턴 1: Server에서 값 추출 후 전달
export default async function ServerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <ClientPageComponent id={id} />;
}

// ✅ Next.js 16 패턴 2: use() hook 사용
("use client");
import { use } from "react";

export default function ClientPage({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = use(paramsPromise);
  return <div>{id}</div>;
}
```

### 7. 중첩 동적 라우트 업데이트

```tsx
// ❌ Next.js 15 패턴
export default async function Page({ params }) {
  const category = params.category;
  const productId = params.productId;
  // ...
}

// ✅ Next.js 16 패턴
export default async function Page({
  params,
}: {
  params: Promise<{ category: string; productId: string }>;
}) {
  const { category, productId } = await params;
  // ...
}
```

## 📋 마이그레이션 체크리스트

프로젝트를 Next.js 16으로 마이그레이션할 때 확인해야 할 사항:

### Page Components

- [ ] 모든 page.tsx 파일의 params 타입을 `Promise<T>`로 변경
- [ ] params 접근 시 `await` 추가
- [ ] searchParams 타입을 `Promise<T>`로 변경
- [ ] searchParams 접근 시 `await` 추가

### generateMetadata

- [ ] generateMetadata 함수에서 params await 추가
- [ ] 타입 정의 업데이트 (`Promise<T>`)
- [ ] 반환 타입 명시 (`Promise<Metadata>`)

### Route Handlers

- [ ] 모든 route.ts 파일의 params 타입 업데이트
- [ ] context.params 접근 시 await 추가
- [ ] GET, POST, PUT, DELETE 등 모든 메서드 확인

### Layout Components

- [ ] 모든 layout.tsx 파일의 params 타입 업데이트
- [ ] params 접근 시 await 추가

### Client Components

- [ ] Client Component가 async 함수로 정의되지 않았는지 확인
- [ ] Promise props를 받는 경우 use() hook 사용
- [ ] 또는 Server Component에서 값 추출 후 전달

### Type Definitions

- [ ] 공통 타입 헬퍼 생성 (`RouteParams<T>`, `PagePropsBase<T>`)
- [ ] 일관된 타입 사용
- [ ] TypeScript strict mode 확인

### Testing

- [ ] 모든 동적 라우트 페이지 테스트
- [ ] generateMetadata 동작 확인
- [ ] Route Handler API 엔드포인트 테스트
- [ ] TypeScript 컴파일 에러 확인 (`npm run type-check`)

### Documentation

- [ ] 팀 내부 문서 업데이트
- [ ] 코드 리뷰 가이드라인 업데이트
- [ ] 새로운 팀원 온보딩 자료 수정

---

**참고 자료:**

- [Next.js 16 공식 문서](https://nextjs.org/docs)
- 프로젝트 내 `/docs/guides/nextjs-16.md` - 상세한 Next.js 16 가이드
- 실제 예제: `app/(mobile)/events/[id]/page.tsx`
