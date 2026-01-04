import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="bg-primary text-primary-foreground px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">지금 Two Gather를 시작하세요</h2>
        <p className="mb-8 text-lg opacity-90">무료로 시작하고 친구들과 함께 모이세요</p>
        <Button asChild size="lg" variant="secondary" className="text-base">
          <Link href="/auth/sign-up" className="inline-flex items-center gap-2">
            무료로 시작하기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
