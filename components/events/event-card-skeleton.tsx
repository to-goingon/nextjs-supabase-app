import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// 이벤트 카드 스켈레톤 Props 인터페이스
interface EventCardSkeletonProps {
  className?: string;
}

export function EventCardSkeleton({ className }: EventCardSkeletonProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="space-y-2 pb-3">
        {/* 제목과 상태 배지 스켈레톤 */}
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-12 shrink-0" />
        </div>

        {/* 카테고리 배지 스켈레톤 */}
        <Skeleton className="h-4 w-16" />
      </CardHeader>

      <CardContent className="space-y-2 pb-4">
        {/* 날짜 정보 스켈레톤 */}
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 shrink-0 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* 장소 정보 스켈레톤 */}
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 shrink-0 rounded" />
          <Skeleton className="h-4 w-40" />
        </div>

        {/* 참여자 정보 스켈레톤 */}
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 shrink-0 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
