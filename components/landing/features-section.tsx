import { Calendar, CreditCard, Bell } from "lucide-react";

import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Calendar,
    title: "간편한 이벤트 생성",
    description: "클릭 몇 번으로 친구들과의 모임을 쉽게 만들어보세요",
  },
  {
    icon: CreditCard,
    title: "자동 정산 관리",
    description: "참가비 자동 계산과 정산으로 금전 관리 걱정 끝",
  },
  {
    icon: Bell,
    title: "실시간 알림",
    description: "이벤트 변경사항을 실시간으로 받아보세요",
  },
];

export function FeaturesSection() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-[480px]">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">주요 기능</h2>
          <p className="text-sm text-muted-foreground">Two Gather로 모임을 더 쉽게</p>
        </div>
        <div className="flex flex-col gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="p-6">
              <feature.icon className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
