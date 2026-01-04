import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 빈 상태 컴포넌트 Props 인터페이스
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center",
        "bg-muted/30",
        className
      )}
    >
      {/* 아이콘 */}
      <div className="bg-muted mb-4 rounded-full p-4">
        <Icon className="text-muted-foreground size-8" />
      </div>

      {/* 제목 */}
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>

      {/* 설명 (선택적) */}
      {description && <p className="text-muted-foreground mb-6 max-w-sm text-sm">{description}</p>}

      {/* CTA 버튼 (선택적) */}
      {action && (
        <Button onClick={action.onClick || (() => {})} className="mt-2" variant="default">
          {action.label}
          {/* TODO: 버튼 클릭 로직 구현 필요 */}
        </Button>
      )}
    </div>
  );
}
