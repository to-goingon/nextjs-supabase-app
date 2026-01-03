import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background px-4 py-16 md:py-24 lg:py-32">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm">
          <Sparkles className="h-4 w-4" />
          <span>함께 모이는 새로운 방법</span>
        </div>
        <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          Two Gather
          <br />
          <span className="text-primary">함께 모이는 가장 쉬운 방법</span>
        </h1>
        <p className="mb-8 text-lg text-muted-foreground md:text-xl">
          친구들과의 모임, 수영, 헬스 등 다양한 이벤트를 간편하게 관리하세요
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="text-base">
            <Link href="/auth/sign-up">무료로 시작하기</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-base">
            <Link href="/dashboard">둘러보기</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
