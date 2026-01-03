import { Calendar, Users, CreditCard } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: "1",
    icon: Calendar,
    title: "이벤트 만들기",
    description: "제목, 날짜, 장소를 입력하고 이벤트를 생성하세요",
  },
  {
    number: "2",
    icon: Users,
    title: "친구 초대하기",
    description: "공유 링크로 친구들을 간편하게 초대하세요",
  },
  {
    number: "3",
    icon: CreditCard,
    title: "참여 및 정산",
    description: "실시간으로 참여 현황을 확인하고 자동으로 정산하세요",
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-muted/30 px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">사용 방법</h2>
          <p className="text-lg text-muted-foreground">3단계로 간편하게</p>
        </div>
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <Badge className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg">
                {step.number}
              </Badge>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <step.icon className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                </div>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
