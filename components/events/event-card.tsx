import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// 이벤트 상태 타입 정의
type EventStatus = "upcoming" | "ongoing" | "completed";

// 이벤트 카드 Props 인터페이스
interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  participantCount: number;
  status: EventStatus;
  category?: string;
  className?: string;
}

// 상태별 배지 스타일 매핑
const statusConfig: Record<
  EventStatus,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  upcoming: { label: "예정", variant: "default" },
  ongoing: { label: "진행중", variant: "secondary" },
  completed: { label: "완료", variant: "outline" },
};

export function EventCard({
  id,
  title,
  date,
  location,
  participantCount,
  status,
  category,
  className,
}: EventCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <Link href={`/events/${id}`} className="block">
      <Card
        className={cn(
          "transition-all hover:shadow-md active:scale-[0.98]",
          "cursor-pointer",
          className
        )}
      >
        <CardHeader className="space-y-2 pb-3">
          {/* 제목과 상태 배지 */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-base leading-tight font-semibold">{title}</h3>
            <Badge variant={statusInfo.variant} className="shrink-0">
              {statusInfo.label}
            </Badge>
          </div>

          {/* 카테고리 배지 (선택적) */}
          {category && (
            <Badge variant="outline" className="text-muted-foreground w-fit text-xs">
              {category}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-2 pb-4">
          {/* 날짜 정보 */}
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Calendar className="size-4 shrink-0" />
            <span className="truncate">{date}</span>
          </div>

          {/* 장소 정보 */}
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {/* 참여자 정보 */}
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Users className="size-4 shrink-0" />
            <span>{participantCount}명 참여</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
