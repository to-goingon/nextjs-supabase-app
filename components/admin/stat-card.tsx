import { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// 통계 카드 Props 인터페이스
interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  description,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        {/* 레이블 */}
        <p className="text-muted-foreground text-sm font-medium">{label}</p>

        {/* 아이콘 */}
        <div className="bg-primary/10 rounded-full p-2">
          <Icon className="text-primary size-4" />
        </div>
      </CardHeader>

      <CardContent className="space-y-1">
        {/* 통계 숫자 */}
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold tabular-nums">{value}</p>

          {/* 트렌드 표시 (선택적) */}
          {trend && (
            <span
              className={cn(
                "text-sm font-medium",
                trend.isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>
          )}
        </div>

        {/* 설명 텍스트 (선택적) */}
        {description && <p className="text-muted-foreground text-xs">{description}</p>}
      </CardContent>
    </Card>
  );
}
