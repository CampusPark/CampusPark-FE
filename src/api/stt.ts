import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

// 공통 Axios 인스턴스 (필요하면 withCredentials 등 옵션 추가)
const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// 유저 ID 기본 로딩 (없으면 1로)
export function getUserId(): number {
  const saved = Number(localStorage.getItem("parking_userId") || "1");
  return Number.isFinite(saved) ? saved : 1;
}

/** ---------- Types ---------- **/

export type STTListItem = {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
  availableStartTime: string; // "2025-09-12T09:00:00"
  availableEndTime: string; // "2025-09-12T18:00:00"
  price: number;
  status: boolean;
  availableCount: number;
};

export type STTListResponse = {
  success: boolean;
  data: STTListItem[];
  timestamp: string;
};

export type STTDetailParking = {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
  availableStartTime: string; // "09:00:00"
  availableEndTime: string; // "18:00:00"
  price: number;
  status: boolean;
  availableCount: number;
};

export type STTDetailSlot = {
  startTime: string; // "2025-09-13T09:00:00"
  endTime: string; // "2025-09-13T12:00:00"
};

export type STTDetailResponse = {
  success: boolean;
  data: {
    parkingSpace: STTDetailParking;
    availableTimeSlots: STTDetailSlot[];
  };
  timestamp: string;
};

export type STTReserveResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
    userId: number;
    parkingSpaceId: number;
    startTime: string; // "2025-09-13T15:00:00"
    endTime: string; // "2025-09-13T17:00:00"
    status: "RESERVED" | string;
  };
  timestamp: string;
};

/** ---------- APIs ---------- **/

/**
 * 1) 인접 주소 리스트 조회 (GET /stt/list?userId=..)
 * - ⚠️ 서버 요구사항: GET 이지만 body에 address 포함
 *   axios는 GET에도 data를 보낼 수 있음(서버가 허용해야 함)
 */
export async function sttFetchNearbyList(params: {
  userId: number;
  address: string;
}) {
  const url = `${baseURL}/stt/list`;
  const res = await axios.post<STTListResponse>(
    url,
    { address: params.address },
    {
      params: { userId: params.userId },
    }
  );
  return res.data;
}
/**
 * 2) 몇 번째 항목을 선택했는지 상세 조회 (POST /stt/detail?userId=..)
 */
export async function sttFetchDetail(params: {
  userId?: number;
  text: string; // 예: "3번째"
}): Promise<STTDetailResponse> {
  const userId = params.userId ?? getUserId();

  const res = await api.post<STTDetailResponse>(
    "/stt/detail",
    { text: params.text },
    { params: { userId } }
  );

  return res.data;
}

/**
 * 3) 예약 생성 (POST /stt/reserve?userId=..&parkingSpaceId=..)
 * body: { text: "오후 12시부터 오후 3시까지" }
 */
export async function sttReserveByText(params: {
  userId?: number;
  parkingSpaceId: number;
  text: string;
}): Promise<STTReserveResponse> {
  const userId = params.userId ?? getUserId();

  const res = await api.post<STTReserveResponse>(
    "/stt/reserve",
    { text: params.text },
    { params: { userId, parkingSpaceId: params.parkingSpaceId } }
  );

  return res.data;
}
