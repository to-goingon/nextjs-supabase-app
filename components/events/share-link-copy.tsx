"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * 공유 링크 복사 컴포넌트
 * - 이벤트 공유 링크를 표시하고 클립보드에 복사하는 기능 제공
 * - 복사 성공 시 2초간 체크 아이콘 표시 및 토스트 메시지
 */
interface ShareLinkCopyProps {
  /** 이벤트 공유 토큰 */
  token: string;
}

export function ShareLinkCopy({ token }: ShareLinkCopyProps) {
  const [copied, setCopied] = useState(false);

  // 전체 공유 URL 생성 (서버 사이드 렌더링 고려)
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/share/${token}`;

  /**
   * 클립보드에 공유 링크 복사
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("링크가 복사되었습니다");

      // 2초 후 복사 상태 리셋
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("링크 복사에 실패했습니다");
    }
  };

  return (
    <div className="flex gap-2">
      {/* 공유 URL 입력 필드 (읽기 전용) */}
      <Input
        value={shareUrl}
        readOnly
        className="font-mono text-sm"
        onClick={(e) => e.currentTarget.select()}
      />

      {/* 복사 버튼 */}
      <Button onClick={handleCopy} variant="outline" size="icon" className="shrink-0">
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </Button>
    </div>
  );
}
