// src/services/parkingspace.ts
import { api } from "@/lib/api";

/** =========================
 * Types (API DTOs & FE Model)
 * ========================== */

// 1) Create (POST) payload — follows the API spec exactly (camelCase keys)
export type CreateParkingSpacePayload = {
  address: string;
  latitude: number;
  longitude: number;
  availableStartTime: string; // ISO "YYYY-MM-DDTHH:mm:ss"
  availableEndTime: string; // ISO "YYYY-MM-DDTHH:mm:ss"
  price: number;
  availableCount: number;
};

// 2) Patch (PATCH) payload — follows the API spec exactly (snake_case keys)
export type UpdateParkingSpacePayload = {
  price_per_hour?: number;
  status?: boolean;
};

// 3) Raw responses from server (keep as-is per each endpoint spec)
export type CreateParkingSpaceResponse = {
  id: number;
  userId: number;
  address: string;
  latitude: number;
  longitude: number;
  availableStartTime?: string;
  availableEndTime?: string;
  price?: number;
  availableCount?: number;
};

export type GetParkingSpaceResponse = {
  id: number;
  user_id: number;
  address: string;
  latitude: number;
  longitude: number;
  available_hours: string;
  price_per_hour: number;
  status: boolean;
  created_at: string;
};

export type PatchParkingSpaceResponse = GetParkingSpaceResponse;

export type DeleteParkingSpaceResponse = {
  message: string; // "주차 공간이 성공적으로 삭제되었습니다."
};

// 4) Front-end normalized model (camelCase, union of fields)
export type ParkingSpace = {
  id: number;
  userId: number;
  address: string;
  latitude: number;
  longitude: number;

  // Availability — API returns two different shapes depending on endpoint
  availableStartTime?: string; // from POST response
  availableEndTime?: string; // from POST response
  availableHours?: string; // from GET/PATCH response (e.g., "평일 09:00 - 18:00")

  // Pricing
  price?: number; // from POST response
  pricePerHour?: number; // from GET/PATCH response

  // Misc
  availableCount?: number; // from POST response
  status?: boolean; // from GET/PATCH response
  createdAt?: string; // from GET/PATCH response
};

/** =========================
 * Helpers
 * ========================== */

const BASE = "/api/parkingspaces";

// Convert Create response → FE model
function toParkingSpaceFromCreate(
  res: CreateParkingSpaceResponse
): ParkingSpace {
  return {
    id: res.id,
    userId: res.userId,
    address: res.address,
    latitude: res.latitude,
    longitude: res.longitude,
    availableStartTime: res.availableStartTime,
    availableEndTime: res.availableEndTime,
    price: res.price,
    availableCount: res.availableCount,
  };
}

// Convert GET/PATCH response → FE model
function toParkingSpaceFromRead(res: GetParkingSpaceResponse): ParkingSpace {
  return {
    id: res.id,
    userId: res.user_id, // any 제거
    address: res.address,
    latitude: res.latitude,
    longitude: res.longitude,
    availableHours: res.available_hours,
    pricePerHour: res.price_per_hour,
    status: res.status,
    createdAt: res.created_at,
  };
}

/** =========================
 * API functions
 * ========================== */

/**
 * Create parking space
 * POST /api/parkingspaces?userId={userId}
 */
export async function createParkingSpace(
  userId: number,
  payload: CreateParkingSpacePayload
): Promise<ParkingSpace> {
  const { data } = await api.post<CreateParkingSpaceResponse>(
    `${BASE}?userId=${encodeURIComponent(String(userId))}`,
    payload
  );
  return toParkingSpaceFromCreate(data);
}

/**
 * Read parking space by id
 * GET /api/parkingspaces/{spaceId}
 */
export async function getParkingSpace(spaceId: number): Promise<ParkingSpace> {
  const { data } = await api.get<GetParkingSpaceResponse>(
    `${BASE}/${encodeURIComponent(String(spaceId))}`
  );
  return toParkingSpaceFromRead(data);
}

/**
 * Update parking space (partial)
 * PATCH /api/parkingspaces/{spaceId}
 */
export async function updateParkingSpace(
  spaceId: number,
  payload: UpdateParkingSpacePayload
): Promise<ParkingSpace> {
  const { data } = await api.patch<PatchParkingSpaceResponse>(
    `${BASE}/${encodeURIComponent(String(spaceId))}`,
    payload
  );
  return toParkingSpaceFromRead(data);
}

/**
 * Delete parking space
 * DELETE /api/parkingspaces/{spaceId}
 */
export async function deleteParkingSpace(spaceId: number): Promise<string> {
  const { data } = await api.delete<DeleteParkingSpaceResponse>(
    `${BASE}/${encodeURIComponent(String(spaceId))}`
  );
  return data.message;
}

/** =========================
 * (Optional) Example usage
 * ========================== */
/*
(async () => {
  // Create
  const created = await createParkingSpace(1, {
    address: "대구광역시 북구 산격동 1370",
    latitude: 35.8906,
    longitude: 128.6120,
    availableStartTime: "2025-09-09T00:00:00",
    availableEndTime: "2025-09-09T01:00:00",
    price: 1000,
    availableCount: 3,
  });

  // Read
  const read = await getParkingSpace(created.id);

  // Update
  const updated = await updateParkingSpace(read.id, { price_per_hour: 1200, status: false });

  // Delete
  const msg = await deleteParkingSpace(updated.id);
})();
*/
