import { CheckCircle2, XCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 참여자 아이템 Props 인터페이스
interface ParticipantItemProps {
  name: string;
  avatarUrl?: string;
  isAttended: boolean;
  isPaid: boolean;
  className?: string;
}

// 이름의 첫 글자를 추출하여 Avatar Fallback으로 사용
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ParticipantItem({
  name,
  avatarUrl,
  isAttended,
  isPaid,
  className,
}: ParticipantItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg p-3",
        "hover:bg-muted/50 transition-colors",
        className
      )}
    >
      {/* 왼쪽: 아바타와 이름 */}
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-10 shrink-0">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="text-sm">{getInitials(name)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{name}</p>
        </div>
      </div>

      {/* 오른쪽: 출석/정산 배지 */}
      <div className="flex shrink-0 items-center gap-2">
        {/* 출석 배지 */}
        {isAttended ? (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400"
          >
            <CheckCircle2 className="size-3" />
            <span className="hidden sm:inline">출석</span>
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground flex items-center gap-1">
            <XCircle className="size-3" />
            <span className="hidden sm:inline">미출석</span>
          </Badge>
        )}

        {/* 정산 배지 */}
        {isPaid ? (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
          >
            <CheckCircle2 className="size-3" />
            <span className="hidden sm:inline">정산완료</span>
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground flex items-center gap-1">
            <XCircle className="size-3" />
            <span className="hidden sm:inline">미정산</span>
          </Badge>
        )}
      </div>
    </div>
  );
}
