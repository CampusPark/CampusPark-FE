// src/api/stt.ts
export interface ParkingSpaceLite {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
  availableStartTime: string;
  availableEndTime: string;
  price: number;
  status: boolean;
  availableCount: number;
}

export interface SttListResp {
  success: boolean;
  data: ParkingSpaceLite[];
  timestamp: string;
}

export interface SttDetailResp {
  success: boolean;
  data: {
    parkingSpace: ParkingSpaceLite & {
      availableStartTime: string; // "09:00:00"
      availableEndTime: string; // "18:00:00"
    };
    availableTimeSlots: { startTime: string; endTime: string }[];
  };
  timestamp: string;
}

export interface ReserveResp {
  success: boolean;
  message: string;
  data: {
    id: number;
    userId: number;
    parkingSpaceId: number;
    startTime: string;
    endTime: string;
    status: "RESERVED";
  };
  timestamp: string;
}

const BASE = import.meta.env.VITE_API_BASE ?? "";
const defaultHeaders = { "Content-Type": "application/json" };

/** 1) 인접 주소 리스트 */
export async function fetchSttList(params: {
  userId: number;
  address: string;
}) {
  // 명세는 GET이지만 Body가 있어 POST로 구현 (백엔드가 GET+쿼리만 받으면 아래를 수정)
  const url = new URL("/stt/list", BASE);
  url.searchParams.set("userId", String(params.userId));
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ address: params.address }),
  });
  if (!res.ok) throw new Error(`list ${res.status}`);
  const json = (await res.json()) as SttListResp;
  if (!json.success) throw new Error("list failed");
  return json;
}

/** 2) 상세(몇 번째 선택) */
export async function fetchSttDetail(params: { userId: number; text: string }) {
  const url = new URL("/stt/detail", BASE);
  url.searchParams.set("userId", String(params.userId));
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ text: params.text }),
  });
  if (!res.ok) throw new Error(`detail ${res.status}`);
  const json = (await res.json()) as SttDetailResp;
  if (!json.success) throw new Error("detail failed");
  return json;
}

/** 3) 예약 */
export async function postSttReserve(params: {
  userId: number;
  parkingSpaceId: number;
  text: string; // "오후 12시부터 오후 3시까지"
}) {
  const url = new URL("/stt/reserve", BASE);
  url.searchParams.set("userId", String(params.userId));
  url.searchParams.set("parkingSpaceId", String(params.parkingSpaceId));
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ text: params.text }),
  });
  if (!res.ok) throw new Error(`reserve ${res.status}`);
  const json = (await res.json()) as ReserveResp;
  if (!json.success) throw new Error("reserve failed");
  return json;
}
