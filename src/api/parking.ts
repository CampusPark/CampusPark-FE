import axios from "axios";

export type NearbySpace = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  price: number;
  availableCount: number;
  availableStartTime: string; // "09:00:00"
  availableEndTime: string; // "23:59:59"
  thumbnailUrl?: string;
  photoUrls?: string[];
  distanceKm?: number;
};

export type NearbyResponse = {
  success: boolean;
  message: string;
  data: NearbySpace[];
  timestamp: string;
};

const baseURL = import.meta.env.VITE_API_BASE_URL;

/**
 * 경도/위도 기준 주변 주차공간 조회
 * 서버 요구사항에 맞게 method/페이로드 형태를 사용하세요.
 * 아래 예시는 POST JSON 바디로 latitude/longitude를 보냅니다.
 */
export async function fetchNearbyParkingSpaces(params: {
  latitude: number;
  longitude: number;
  radiusKm?: number; // 서버에서 받는다면 옵션
}) {
  if (!baseURL) throw new Error("VITE_API_BASE_URL이 설정되지 않았습니다.");

  const url = `${baseURL}/parking-spaces/nearby`;

  console.log("[API] GET /parking-spaces/nearby", params);

  const res = await axios.get<NearbyResponse>(url, {
    params: {
      latitude: params.latitude,
      longitude: params.longitude,
      ...(params.radiusKm ? { radiusKm: params.radiusKm } : {}),
    },
  });

  return res.data;
}
