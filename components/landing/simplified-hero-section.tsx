import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SimplifiedHeroSection() {
  return (
    <section className="px-4 py-12 text-center">
      <h1 className="mb-4 text-3xl font-bold">Two Gather</h1>
      <p className="text-muted-foreground mb-6">친구들과 쉽게 모이세요</p>
      <div className="flex flex-col gap-3">
        <Button asChild size="lg">
          <Link href="/auth/sign-up">시작하기</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/dashboard">둘러보기</Link>
        </Button>
      </div>
    </section>
  );
}
