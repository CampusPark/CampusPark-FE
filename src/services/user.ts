// src/services/user.ts
import { api } from "@/lib/api";

export type CreateUserPayload = {
  username: string;
  role: "ROLE_CUSTOMER" | "ROLE_OWNER" | "ROLE_ADMIN"; // 백엔드 정의에 맞춰 확장
  point: number;
  trust_score: number;
};

export type UserResponse = {
  id: string;
  username: string;
  role: string;
  point: number;
  trust_score: number;
  created_at: string;
  // 백엔드가 추가로 주는 필드들(생성시각 등)이 있으면 여기에 확장
};

export async function createUser(
  payload: CreateUserPayload,
  signal?: AbortSignal
) {
  const res = await api.post<UserResponse>("/users", payload, { signal });
  return res.data;
}
