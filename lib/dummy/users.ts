/**
 * 사용자 더미 데이터 생성 유틸리티
 * 10명의 샘플 사용자 데이터를 제공합니다.
 */

export type UserRole = "user" | "admin";

export interface DummyUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

/**
 * 10명의 샘플 사용자 데이터
 * - 관리자 2명, 일반 사용자 8명
 * - 다양한 프로필 이미지 (UI Avatars API 사용)
 */
export const dummyUsers: DummyUser[] = [
  {
    id: "user-001",
    email: "admin@example.com",
    name: "김관리",
    avatar_url: "https://ui-avatars.com/api/?name=김관리&background=0D8ABC&color=fff",
    role: "admin",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "user-002",
    email: "john.admin@example.com",
    name: "John Admin",
    avatar_url: "https://ui-avatars.com/api/?name=John+Admin&background=6366F1&color=fff",
    role: "admin",
    created_at: "2025-01-02T00:00:00Z",
  },
  {
    id: "user-003",
    email: "soyoung@example.com",
    name: "이소영",
    avatar_url: "https://ui-avatars.com/api/?name=이소영&background=EC4899&color=fff",
    role: "user",
    created_at: "2025-02-10T08:30:00Z",
  },
  {
    id: "user-004",
    email: "minsu.kim@example.com",
    name: "김민수",
    avatar_url: "https://ui-avatars.com/api/?name=김민수&background=10B981&color=fff",
    role: "user",
    created_at: "2025-03-15T14:20:00Z",
  },
  {
    id: "user-005",
    email: "jiyeon@example.com",
    name: "박지연",
    avatar_url: "https://ui-avatars.com/api/?name=박지연&background=F59E0B&color=fff",
    role: "user",
    created_at: "2025-04-05T09:15:00Z",
  },
  {
    id: "user-006",
    email: "david.lee@example.com",
    name: "David Lee",
    avatar_url: "https://ui-avatars.com/api/?name=David+Lee&background=8B5CF6&color=fff",
    role: "user",
    created_at: "2025-05-20T11:45:00Z",
  },
  {
    id: "user-007",
    email: "sara.park@example.com",
    name: "Sara Park",
    avatar_url: "https://ui-avatars.com/api/?name=Sara+Park&background=EF4444&color=fff",
    role: "user",
    created_at: "2025-06-12T16:30:00Z",
  },
  {
    id: "user-008",
    email: "junho@example.com",
    name: "최준호",
    avatar_url: "https://ui-avatars.com/api/?name=최준호&background=14B8A6&color=fff",
    role: "user",
    created_at: "2025-07-08T10:00:00Z",
  },
  {
    id: "user-009",
    email: "emily.kim@example.com",
    name: "Emily Kim",
    avatar_url: "https://ui-avatars.com/api/?name=Emily+Kim&background=F97316&color=fff",
    role: "user",
    created_at: "2025-08-25T13:20:00Z",
  },
  {
    id: "user-010",
    email: "hyunwoo@example.com",
    name: "정현우",
    avatar_url: "https://ui-avatars.com/api/?name=정현우&background=3B82F6&color=fff",
    role: "user",
    created_at: "2025-09-18T15:40:00Z",
  },
];

/**
 * 사용자 ID로 사용자 정보 조회
 */
export function getUserById(userId: string): DummyUser | undefined {
  return dummyUsers.find((user) => user.id === userId);
}

/**
 * 역할별 사용자 필터링
 */
export function getUsersByRole(role: UserRole): DummyUser[] {
  return dummyUsers.filter((user) => user.role === role);
}

/**
 * 관리자 사용자 목록 조회
 */
export function getAdminUsers(): DummyUser[] {
  return getUsersByRole("admin");
}

/**
 * 일반 사용자 목록 조회
 */
export function getRegularUsers(): DummyUser[] {
  return getUsersByRole("user");
}
