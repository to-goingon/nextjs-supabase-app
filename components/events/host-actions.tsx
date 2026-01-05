"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type EventStatus } from "@/lib/dummy";

interface HostActionsProps {
  eventId: string;
  currentStatus: EventStatus;
}

/**
 * 주최자 전용 액션 버튼 컴포넌트
 * - 수정: 이벤트 수정 페이지로 이동
 * - 삭제: 확인 Dialog 후 대시보드로 이동
 * - 상태 변경: Select로 이벤트 상태 변경
 */
export function HostActions({ eventId, currentStatus }: HostActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState<EventStatus>(currentStatus);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    console.log("Deleting event:", eventId);
    toast.success("이벤트가 삭제되었습니다");
    setShowDeleteDialog(false);
    router.push("/dashboard");
  };

  const handleStatusChange = (newStatus: EventStatus) => {
    console.log("Changing status:", { eventId, from: status, to: newStatus });
    setStatus(newStatus as EventStatus);
    toast.success("이벤트 상태가 변경되었습니다");
  };

  return (
    <div className="flex gap-2">
      {/* 수정 버튼 */}
      <Button asChild variant="outline" className="flex-1">
        <Link href={`/events/${eventId}/edit`}>
          <Edit className="mr-2 size-4" />
          수정
        </Link>
      </Button>

      {/* 삭제 버튼 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex-1">
            <Trash2 className="mr-2 size-4" />
            삭제
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>이벤트 삭제</DialogTitle>
            <DialogDescription>
              정말로 이 이벤트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 상태 변경 드롭다운 */}
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className="flex-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="upcoming">예정</SelectItem>
          <SelectItem value="ongoing">진행중</SelectItem>
          <SelectItem value="completed">완료</SelectItem>
          <SelectItem value="cancelled">취소</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
