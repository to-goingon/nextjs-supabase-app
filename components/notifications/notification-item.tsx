import { DollarSign, Edit, Mail, XCircle } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

// 알림 타입 정의
type NotificationType = "invite" | "update" | "settlement" | "cancel";

// 알림 아이템 Props 인터페이스
interface NotificationItemProps {
  type: NotificationType;
  message: string;
  isRead: boolean;
  eventId: string;
  createdAt: string;
  className?: string;
}

// 타입별 아이콘과 색상 설정
const notificationConfig: Record<
  NotificationType,
  {
    icon: React.ElementType;
    iconColor: string;
    bgColor: string;
  }
> = {
  invite: {
    icon: Mail,
    iconColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-950",
  },
  update: {
    icon: Edit,
    iconColor: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-950",
  },
  settlement: {
    icon: DollarSign,
    iconColor: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-950",
  },
  cancel: {
    icon: XCircle,
    iconColor: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-950",
  },
};

export function NotificationItem({
  type,
  message,
  isRead,
  eventId,
  createdAt,
  className,
}: NotificationItemProps) {
  const config = notificationConfig[type];
  const Icon = config.icon;

  return (
    <Link
      href={`/events/${eventId}`}
      className={cn(
        "block rounded-lg border p-4 transition-all hover:shadow-md active:scale-[0.98]",
        // 읽지 않은 알림은 강조 배경색
        !isRead && "border-primary/20 bg-primary/5 dark:border-primary/30 dark:bg-primary/10",
        isRead && "bg-background",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* 타입별 아이콘 */}
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            config.bgColor
          )}
        >
          <Icon className={cn("size-5", config.iconColor)} />
        </div>

        {/* 메시지와 날짜 */}
        <div className="min-w-0 flex-1 space-y-1">
          <p
            className={cn(
              "text-sm leading-relaxed",
              !isRead && "text-foreground font-medium",
              isRead && "text-muted-foreground"
            )}
          >
            {message}
          </p>
          <p className="text-muted-foreground text-xs">{createdAt}</p>
        </div>

        {/* 읽지 않은 표시 점 */}
        {!isRead && <div className="bg-primary size-2 shrink-0 rounded-full" />}
      </div>
    </Link>
  );
}
