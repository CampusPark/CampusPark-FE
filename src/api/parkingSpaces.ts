import axios from "axios";

export type ParkingSpaceDetail = {
  id: number;
  user_id: number;
  address: string;
  latitude: number;
  longitude: number;
  available_hours: string; // "평일 09:00 - 18:00"
  price_per_hour: number;
  status: boolean;
  created_at: string;
};

const baseURL = import.meta.env.VITE_API_BASE_URL;

/** 특정 주차 공간 상세 조회 */
export async function getParkingSpace(spaceId: number) {
  const url = `${baseURL}/parking-spaces/${spaceId}`;
  const res = await axios.get<ParkingSpaceDetail>(url);
  return res.data;
}
