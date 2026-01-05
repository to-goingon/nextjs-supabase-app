"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DummyEvent, EventCategory } from "@/lib/dummy";

interface EventFormProps {
  mode: "create" | "edit";
  initialData?: Partial<DummyEvent>;
}

/**
 * EventForm 컴포넌트
 * 이벤트 생성 및 수정에 사용하는 폼 컴포넌트
 * React Hook Form을 사용하여 폼 상태를 관리합니다.
 */
export function EventForm({ mode, initialData }: EventFormProps) {
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: initialData || {
      title: "",
      description: "",
      category: "swimming",
      date: "",
      start_time: "",
      end_time: "",
      location: "",
      max_participants: 10,
      cost_per_person: 0,
    },
  });

  // 카테고리 값 추적
  const categoryValue = watch("category");

  /**
   * 폼 제출 핸들러
   * 현재는 콘솔 로그 출력 및 토스트 메시지만 표시
   * TODO: Phase 3에서 실제 API 연동 구현
   */
  const onSubmit = (data: any) => {
    console.log(mode === "create" ? "Creating event:" : "Updating event:", data);
    toast.success(mode === "create" ? "이벤트가 생성되었습니다" : "이벤트가 수정되었습니다");
    router.push("/dashboard");
  };

  /**
   * 취소 버튼 핸들러
   * 대시보드로 돌아가며 입력 내용은 저장되지 않음
   */
  const handleCancel = () => {
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 제목 */}
      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input id="title" placeholder="이벤트 제목을 입력하세요" {...register("title")} />
      </div>

      {/* 설명 */}
      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          placeholder="이벤트에 대한 자세한 설명을 입력하세요"
          rows={4}
          {...register("description")}
        />
      </div>

      {/* 카테고리 */}
      <div className="space-y-2">
        <Label htmlFor="category">카테고리</Label>
        <Select
          value={categoryValue}
          onValueChange={(value) => setValue("category", value as EventCategory)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="카테고리를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="swimming">수영</SelectItem>
            <SelectItem value="fitness">헬스</SelectItem>
            <SelectItem value="social">친구 모임</SelectItem>
            <SelectItem value="sports">스포츠</SelectItem>
            <SelectItem value="study">스터디</SelectItem>
            <SelectItem value="dining">식사</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 날짜 */}
      <div className="space-y-2">
        <Label htmlFor="date">날짜</Label>
        <Input id="date" type="date" {...register("date")} />
      </div>

      {/* 시간 (시작/종료) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_time">시작 시간</Label>
          <Input id="start_time" type="time" {...register("start_time")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_time">종료 시간</Label>
          <Input id="end_time" type="time" {...register("end_time")} />
        </div>
      </div>

      {/* 장소 */}
      <div className="space-y-2">
        <Label htmlFor="location">장소</Label>
        <Input id="location" placeholder="장소를 입력하세요" {...register("location")} />
      </div>

      {/* 최대 인원, 참가비 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="max_participants">최대 인원</Label>
          <Input
            id="max_participants"
            type="number"
            min="1"
            {...register("max_participants", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost_per_person">참가비 (원)</Label>
          <Input
            id="cost_per_person"
            type="number"
            min="0"
            step="1000"
            {...register("cost_per_person", { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {mode === "create" ? "이벤트 만들기" : "수정하기"}
        </Button>
        <Button type="button" variant="outline" onClick={handleCancel}>
          취소
        </Button>
      </div>
    </form>
  );
}
