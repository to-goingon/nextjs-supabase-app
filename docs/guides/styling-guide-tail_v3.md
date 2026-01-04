# 스타일링 가이드

이 문서는 TailwindCSS v3.4.19 + shadcn/ui를 활용한 스타일링 규칙과 모범 사례를 제공합니다.

## 🎨 기술 스택 개요

### 핵심 스타일링 도구

- **TailwindCSS v3.4.19**: 유틸리티 기반 CSS 프레임워크
- **shadcn/ui**: Radix UI 기반 컴포넌트 라이브러리 (new-york style)
- **next-themes**: 다크모드 지원 (class 전략 사용)
- **tailwindcss-animate**: 애니메이션 플러그인
- **CSS Variables**: HSL 형식의 동적 테마 시스템
- **prettier-plugin-tailwindcss**: 자동 클래스 정렬
- **class-variance-authority (CVA)**: 컴포넌트 변형 관리

## ⚙️ Tailwind CSS v3 설정

### 설정 파일 구조

프로젝트는 TypeScript 기반 설정을 사용합니다:

**파일: `tailwind.config.ts`**

```typescript
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... 기타 색상
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
```

### 주요 설정 포인트

1. **다크모드 전략**: `darkMode: ["class"]` - `.dark` 클래스 기반 토글
2. **Content 경로**: 모든 컴포넌트 파일을 명시적으로 지정
3. **테마 확장**: `theme.extend`로 기본 설정 유지하면서 확장
4. **플러그인**: ES 모듈 import 방식 사용
5. **타입 안전성**: `satisfies Config`로 타입 체크

### CSS 가져오기

**파일: `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    /* ... 기타 변수 */
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    /* ... 기타 변수 */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### PostCSS 설정

**파일: `postcss.config.mjs`**

```javascript
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

## 🚀 TailwindCSS v3 사용 규칙

### 기본 원칙

```tsx
// ✅ 올바른 Tailwind 클래스 사용
<div className="bg-background flex items-center justify-between rounded-lg p-4 shadow-md">
  <h2 className="text-foreground text-lg font-semibold">제목</h2>
  <Button variant="outline" size="sm">
    버튼
  </Button>
</div>;

// ❌ 인라인 스타일 사용 금지
<div style={{ display: "flex", padding: "16px" }}>
  <h2 style={{ fontSize: "18px" }}>제목</h2>
</div>;
```

### 클래스 작성 순서

Prettier 플러그인이 자동으로 정렬하지만, 수동 작성 시 다음 순서를 따르세요:

```tsx
<div
  className={cn(
    // 1. 레이아웃 (display, position)
    "absolute flex",

    // 2. 크기 (width, height, padding, margin)
    "m-2 h-auto w-full p-4",

    // 3. 타이포그래피 (font, text)
    "text-center text-lg font-medium",

    // 4. 배경 및 테두리
    "border-border bg-background rounded-md border",

    // 5. 효과 (shadow, opacity, transform)
    "opacity-90 shadow-lg hover:scale-105",

    // 6. 상호작용 (hover, focus, active)
    "hover:bg-accent focus:ring-2 active:scale-95",

    // 조건부 클래스
    isActive && "bg-primary text-primary-foreground",
    className
  )}
></div>
```

### 반응형 디자인

```tsx
// ✅ 모바일 우선 접근법
<div
  className={cn(
    // 기본 (모바일)
    "flex flex-col space-y-4 p-4",

    // 태블릿 (768px+)
    "md:flex-row md:space-y-0 md:space-x-6 md:p-6",

    // 데스크톱 (1024px+)
    "lg:mx-auto lg:max-w-6xl lg:p-8",

    // 대형 화면 (1280px+)
    "xl:max-w-7xl"
  )}
></div>;

// ❌ 데스크톱 우선 접근법 지양
<div className="hidden md:hidden lg:block"></div>;
```

### 커스텀 클래스 최소화

```tsx
// ✅ Tailwind 유틸리티 클래스 우선 사용
<button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"></button>;

// ❌ 커스텀 CSS 클래스 지양
<button className="custom-button"></button>;
```

## 🎭 shadcn/ui 컴포넌트 활용

### 기본 사용법

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ✅ shadcn/ui 컴포넌트 활용
export function UserCard({ user }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="outline">프로필 보기</Button>
      </CardContent>
    </Card>
  );
}
```

### 컴포넌트 변형 (Variants)

```tsx
// Button 컴포넌트 변형
<Button variant="default">기본 버튼</Button>
<Button variant="destructive">삭제 버튼</Button>
<Button variant="outline">아웃라인 버튼</Button>
<Button variant="secondary">보조 버튼</Button>
<Button variant="ghost">고스트 버튼</Button>
<Button variant="link">링크 버튼</Button>

// 크기 변형
<Button size="default">기본 크기</Button>
<Button size="sm">작은 크기</Button>
<Button size="lg">큰 크기</Button>
<Button size="icon">아이콘만</Button>
```

### 컴포넌트 커스터마이징

```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ✅ 기존 컴포넌트 확장
export function CustomButton({ className, ...props }) {
  return (
    <Button
      className={cn(
        "transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-lg",
        className
      )}
      {...props}
    />
  );
}

// ❌ 처음부터 새로 만들기
export function MyButton({ className, ...props }) {
  return <button className="bg-blue-500... px-4 py-2" {...props} />;
}
```

### 새 shadcn/ui 컴포넌트 추가

```bash
# 컴포넌트 추가
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog

# 모든 컴포넌트 확인
npx shadcn@latest add
```

## 🌓 다크모드 구현

### Tailwind CSS v3 다크모드 설정

```typescript
// tailwind.config.ts
export default {
  darkMode: ["class"], // v3.4.1 권장 문법
  // ...
} satisfies Config;
```

v3에서는 `darkMode: ["class"]` 또는 `darkMode: "class"` 모두 사용 가능합니다.

### next-themes 통합

```tsx
// app/layout.tsx
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**중요 속성:**

- `attribute="class"`: HTML 요소에 `.dark` 클래스 추가
- `suppressHydrationWarning`: 서버/클라이언트 불일치 경고 제거
- `disableTransitionOnChange`: 테마 전환 시 깜빡임 방지

### CSS 변수 기반 테마 전환

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
  }
}
```

### 컴포넌트에서 다크모드 처리

```tsx
// ✅ 시맨틱 색상 변수 사용 (권장)
<div className="border-border bg-background text-foreground">
  <h1 className="text-primary">제목</h1>
  <p className="text-muted-foreground">설명</p>
</div>;

// ❌ 하드코딩된 다크모드 클래스 (지양)
<div className="bg-white text-black dark:bg-gray-900 dark:text-white">
  <h1 className="text-blue-600 dark:text-blue-400">제목</h1>
</div>;
```

### 조건부 다크모드 스타일

특별한 경우에만 `dark:` 접두사 사용:

```tsx
// ✅ 특수한 경우에만 dark: 사용
<div className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-700"></div>
```

### 테마 토글 컴포넌트

```tsx
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Hydration 불일치 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">테마 전환</span>
    </Button>
  );
}
```

## 🎨 색상 시스템

### CSS 변수 기반 색상

`app/globals.css`에 정의된 색상 변수 (HSL 형식):

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}
```

### Tailwind 설정에서 CSS 변수 사용

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
    },
  },
}
```

### 색상 사용 예시

```tsx
// ✅ 시맨틱 색상 클래스 사용
<div className="border-border bg-background">
  <h1 className="text-foreground">메인 텍스트</h1>
  <p className="text-muted-foreground">보조 텍스트</p>
  <Button className="bg-primary text-primary-foreground">버튼</Button>
</div>;

// ❌ 직접 색상 지정
<div className="border-gray-200 bg-white">
  <h1 className="text-gray-900">메인 텍스트</h1>
  <p className="text-gray-600">보조 텍스트</p>
</div>;
```

### 투명도 조절

```tsx
// ✅ 투명도 모디파이어 사용
<div className="bg-primary/90">90% 불투명도</div>
<div className="bg-primary/80 hover:bg-primary/90">호버 시 진하게</div>
<div className="bg-gradient-to-b from-primary/5 to-background">미묘한 그라디언트</div>
```

## ✨ 애니메이션 가이드

### tailwindcss-animate 플러그인

프로젝트는 `tailwindcss-animate` 플러그인을 사용합니다:

```typescript
// tailwind.config.ts
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  // ...
  plugins: [tailwindcssAnimate],
} satisfies Config;
```

### 내장 애니메이션 클래스

```tsx
// ✅ Tailwind 애니메이션 활용
<div className="animate-in fade-in slide-in-from-bottom-4 duration-300">페이드 인</div>

<div className="animate-pulse">로딩 인디케이터</div>

<div className="transition-all duration-200 hover:scale-105">호버 애니메이션</div>

// ✅ 나가는 애니메이션
<div className="animate-out fade-out slide-out-to-bottom-4">페이드 아웃</div>
```

### Radix UI data-state 애니메이션

shadcn/ui 컴포넌트는 Radix UI의 data-state 속성을 활용합니다:

```tsx
// ✅ data-state 기반 애니메이션 (Dialog, Dropdown 등)
<DialogContent
  className={cn(
    "animate-in fade-in-0 zoom-in-95",
    "data-[state=open]:animate-in",
    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
  )}
>
  {children}
</DialogContent>
```

### 트랜지션 활용

```tsx
// ✅ 기본 트랜지션
<button className="transition-colors duration-200 hover:bg-accent">색상 전환</button>

// ✅ 복합 트랜지션
<button className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
  스케일 + 그림자
</button>

// ✅ 개별 속성 트랜지션
<div className="transition-transform duration-300 hover:rotate-3">회전 효과</div>
```

### 성능 최적화

```tsx
// ✅ will-change로 GPU 가속
<div className="transition-transform will-change-transform hover:scale-105">최적화된 애니메이션</div>

// ✅ hover에만 will-change 적용
<div className="transition-transform hover:scale-105 hover:will-change-transform">
  필요할 때만 최적화
</div>

// ❌ 과도한 애니메이션
<div className="animate-spin animate-bounce animate-pulse">{/* 너무 많음 */}</div>
```

## 📱 반응형 디자인 패턴

### 모바일 우선 전략

```tsx
// ✅ 모바일 우선 (기본 → 태블릿 → 데스크톱)
<div
  className={cn(
    // 기본 (모바일, 0-767px)
    "flex flex-col space-y-4 p-4",

    // 태블릿 (768px+)
    "md:flex-row md:space-y-0 md:space-x-6 md:p-6",

    // 데스크톱 (1024px+)
    "lg:mx-auto lg:max-w-6xl lg:p-8",

    // 대형 화면 (1280px+)
    "xl:max-w-7xl"
  )}
></div>;

// ❌ 데스크톱 우선 (비권장)
<div className="flex-row md:flex-row lg:flex-col"></div>;
```

### 중단점 (Breakpoints)

Tailwind CSS v3 기본 중단점:

```typescript
// tailwind.config.ts (기본값)
theme: {
  screens: {
    'sm': '640px',   // @media (min-width: 640px)
    'md': '768px',   // @media (min-width: 768px)
    'lg': '1024px',  // @media (min-width: 1024px)
    'xl': '1280px',  // @media (min-width: 1280px)
    '2xl': '1536px', // @media (min-width: 1536px)
  }
}
```

### 컨테이너 패턴

```tsx
// ✅ 모바일 친화적 레이아웃
<main className="mx-auto max-w-[480px] pb-16">{children}</main>;

// ✅ 반응형 컨테이너
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-7xl">{/* 컨텐츠 */}</div>
</div>;

// ✅ 임의 최대 너비
<div className="mx-auto max-w-[calc(100%-2rem)]">{/* 양쪽 1rem 여백 */}</div>;
```

### Grid 레이아웃

```tsx
// ✅ 반응형 그리드
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map((item) => (
    <Card key={item.id}>...</Card>
  ))}
</div>;

// ✅ 복잡한 그리드
<div className="grid grid-cols-[auto_1fr_auto] gap-4 md:grid-cols-[200px_1fr_200px]">
  <aside>사이드바</aside>
  <main>메인 컨텐츠</main>
  <aside>오른쪽 사이드바</aside>
</div>;
```

### 조건부 표시/숨김

```tsx
// ✅ 반응형 표시/숨김
<div className="hidden md:flex md:space-x-6">
  <NavLink href="/about">소개</NavLink>
  <NavLink href="/contact">연락처</NavLink>
</div>

<div className="md:hidden">
  <MobileMenu />
</div>
```

## 🛠️ 유틸리티 함수

### cn() 헬퍼 함수

**파일: `lib/utils.ts`**

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**작동 원리:**

1. `clsx`: 조건부 클래스명을 문자열로 결합
2. `twMerge`: Tailwind 클래스 충돌 해결

### 실제 사용 패턴

```tsx
// ✅ 기본 사용법
<div className={cn("base-classes", className)}></div>;

// ✅ 조건부 클래스
<div
  className={cn("base-classes", isActive && "active-classes", isDisabled && "disabled-classes")}
></div>;

// ✅ 복잡한 조건
<Button
  className={cn(
    "base-button-styles",
    variant === "primary" && "bg-primary text-primary-foreground",
    variant === "secondary" && "bg-secondary text-secondary-foreground",
    size === "sm" && "h-8 px-3 text-xs",
    size === "lg" && "h-10 px-8",
    disabled && "cursor-not-allowed opacity-50",
    className
  )}
></Button>;

// ✅ 배열 형태
<div
  className={cn([
    "flex items-center",
    "border-border rounded-md border p-4",
    "bg-background",
    isHighlighted && "ring-primary ring-2",
  ])}
></div>;
```

### CVA와 cn() 조합

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
```

## 🎯 Tailwind CSS v3 모범 사례

### 1. Content 경로 최적화

```typescript
// ✅ 정확한 경로 지정으로 빌드 성능 향상
content: [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
],

// ❌ 너무 광범위한 경로
content: ["./**/*.{js,ts,jsx,tsx}"],
```

### 2. CSS 레이어 활용

```css
@layer base {
  /* 기본 스타일 재정의 */
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  /* 재사용 가능한 컴포넌트 스타일 */
  .btn-primary {
    @apply bg-primary text-primary-foreground hover:bg-primary/90;
  }
}

@layer utilities {
  /* 커스텀 유틸리티 클래스 */
  .text-balance {
    text-wrap: balance;
  }
}
```

### 3. 임의 값 (Arbitrary Values) 사용

```tsx
// ✅ 필요시 임의 값 사용
<div className="top-[117px]"></div>
<div className="grid-cols-[auto_1fr_auto]"></div>
<div className="max-w-[calc(100%-2rem)]"></div>

// ✅ 임의 속성
<div className="[mask-image:linear-gradient(to_bottom,black,transparent)]"></div>

// ❌ 과도한 임의 값 사용 (재사용성 고려)
<div className="mt-[23px] ml-[47px] h-[187px] w-[243px]"></div>
```

### 4. JIT 모드 활용 (v3 기본값)

Tailwind CSS v3는 기본적으로 JIT(Just-in-Time) 모드를 사용합니다:

- ✅ 빌드 시간 단축
- ✅ 모든 변형 조합 사용 가능
- ✅ 파일 크기 최적화
- ✅ 개발 서버 재시작 불필요

```tsx
// ✅ JIT 모드 덕분에 가능
<div className="top-[117px]"></div>
<div className="before:content-['Hello']"></div>
<div className="lg:hover:bg-primary"></div>
<div className="[&>*]:py-2"></div>
```

### 5. 플러그인 활용

```typescript
// tailwind.config.ts
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  plugins: [
    tailwindcssAnimate,
    // 필요시 추가 플러그인
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
  ],
} satisfies Config;
```

## 📚 실제 프로젝트 예제

### 1. Mobile Navigation 패턴

**파일: `components/layout/bottom-nav.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Plus, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/dashboard", icon: Calendar, label: "대시보드" },
  { href: "/events/create", icon: Plus, label: "생성", highlight: true },
  { href: "/notifications", icon: Bell, label: "알림" },
  { href: "/profile", icon: User, label: "프로필" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-background fixed right-0 bottom-0 left-0 z-50 border-t">
      <div className="mx-auto max-w-[480px]">
        <ul className="grid grid-cols-5 gap-1 px-2 py-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-lg py-2 transition-colors",
                    isActive && "text-primary font-semibold",
                    !isActive && "text-muted-foreground hover:text-foreground",
                    item.highlight && "text-primary"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", item.highlight && "h-6 w-6")} />
                  <span className="text-[10px]">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
```

**주요 패턴:**

- Fixed positioning으로 하단 고정
- 모바일 최대 너비 제한 (`max-w-[480px]`)
- Grid 레이아웃 (5열)
- 조건부 스타일링 with `cn()`
- 아이콘 크기 일관성

### 2. Theme Switcher 패턴

**파일: `components/theme-switcher.tsx`**

```tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const ICON_SIZE = 16;

  // Hydration 불일치 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          {theme === "light" ? (
            <Sun size={ICON_SIZE} className="text-muted-foreground" />
          ) : theme === "dark" ? (
            <Moon size={ICON_SIZE} className="text-muted-foreground" />
          ) : (
            <Laptop size={ICON_SIZE} className="text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      {/* ... */}
    </DropdownMenu>
  );
};
```

**주요 패턴:**

- `mounted` 상태로 hydration 불일치 방지
- 상수로 아이콘 크기 통일
- Semantic 색상 사용 (`text-muted-foreground`)
- 조건부 아이콘 렌더링

### 3. CVA 기반 Button 컴포넌트

**파일: `components/ui/button.tsx`**

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

**주요 패턴:**

- 베이스 클래스에 공통 스타일
- Variant별 시맨틱 색상 사용
- Opacity 모디파이어 (`/90`, `/80`)
- SVG 자식 요소 스타일링 (`[&_svg]:size-4`)
- 접근성 포커스 스타일

## 🔧 문제 해결 가이드

### 1. 스타일이 적용되지 않을 때

```tsx
// ❌ 동적 클래스명 (작동 안 함)
<div className={`text-${color}-500`}></div>;

// ✅ 완전한 클래스명 사용
<div className={color === "red" ? "text-red-500" : "text-blue-500"}></div>;

// ✅ cn() 함수 활용
<div
  className={cn(
    "base-classes",
    color === "red" && "text-red-500",
    color === "blue" && "text-blue-500"
  )}
></div>;
```

### 2. 다크모드가 작동하지 않을 때

**체크리스트:**

- [ ] `tailwind.config.ts`에 `darkMode: ["class"]` 설정
- [ ] html 태그에 `suppressHydrationWarning` 추가
- [ ] ThemeProvider의 `attribute="class"` 확인
- [ ] CSS 변수 정의 확인 (`:root`와 `.dark`)
- [ ] next-themes 버전 확인 (^0.4.0+)

### 3. Purge/Content 경로 문제

```typescript
// ✅ 올바른 경로 설정
content: [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
],

// ❌ 잘못된 경로
content: ["./src/**/*.tsx"], // src 폴더가 없음
```

### 4. 클래스 우선순위 문제

```tsx
// ✅ twMerge 사용 (cn 함수 내부에서 사용)
import { cn } from "@/lib/utils";

<Button className={cn("bg-blue-500", "bg-red-500")}></Button>; // red-500 적용

// ❌ 일반 문자열 결합
<Button className="bg-blue-500 bg-red-500"></Button>; // 둘 다 적용되어 예측 불가
```

### 5. 빌드 시 스타일 누락

```bash
# PostCSS와 Tailwind CSS 확인
npm ls tailwindcss
npm ls postcss
npm ls autoprefixer

# 캐시 삭제 후 재빌드
rm -rf .next
npm run build
```

### 6. Hydration 불일치 오류

```tsx
// ✅ 클라이언트에서만 렌더링
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  return null;
}
```

## 🚫 금지사항

### ❌ 피해야 할 패턴

```tsx
// 인라인 스타일 사용
<div style={{ backgroundColor: "red" }}></div>;

// 긴 클래스명 하드코딩
<div className="flex h-screen w-full items-center justify-center rounded-lg border-4 border-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-2xl font-bold text-white shadow-2xl"></div>;

// 중복된 스타일 정의
<div className="padding-4 p-4 pt-4 pr-4 pb-4 pl-4"></div>;

// !important 남용
<div className="!bg-blue-500 !text-red-500"></div>;

// Tailwind와 CSS 모듈 혼재
<div className={`${styles.customClass} flex items-center`}></div>;
```

### ❌ 잘못된 색상 사용

```tsx
// 하드코딩된 색상
<div className="bg-gray-100 text-gray-900"></div>;

// 다크모드 미고려
<div className="bg-white text-black"></div>;

// 접근성 미고려
<button className="bg-red-200 text-red-300">저대비 버튼</button>;
```

### ❌ 잘못된 반응형 패턴

```tsx
// 중단점 순서 오류
<div className="sm:hidden md:block lg:flex"></div>;

// 불필요한 중복
<div className="flex md:flex lg:flex"></div>;
```

## ✅ 스타일링 체크리스트

새 컴포넌트 작성 시 확인사항:

### 기본 사항

- [ ] TailwindCSS 유틸리티 클래스 우선 사용
- [ ] cn() 함수로 클래스 조합
- [ ] 시맨틱 색상 변수 사용
- [ ] 반응형 디자인 적용 (모바일 우선)
- [ ] Prettier 플러그인으로 자동 정렬

### 다크모드

- [ ] 다크모드 대응 색상 사용
- [ ] 하드코딩된 색상 없음
- [ ] 테마 전환 시 깨짐 없음
- [ ] CSS 변수 일관성 유지

### 성능

- [ ] 불필요한 애니메이션 없음
- [ ] will-change 적절히 사용
- [ ] 인라인 스타일 없음
- [ ] 임의 값 최소화

### 접근성

- [ ] 충분한 색상 대비 (WCAG AA 기준)
- [ ] 포커스 상태 스타일링
- [ ] 스크린 리더 고려 (sr-only)
- [ ] 키보드 네비게이션 지원

### 유지보수

- [ ] 일관된 클래스 순서
- [ ] 재사용 가능한 컴포넌트 활용
- [ ] CVA로 변형 관리
- [ ] 의미있는 클래스 조합

### TypeScript

- [ ] 컴포넌트 Props 타입 정의
- [ ] VariantProps 활용 (CVA 사용 시)
- [ ] className prop 타입 지정

이 가이드를 따라 일관성 있고 아름다운 UI를 구현해보세요!
