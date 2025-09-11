export type SpotDetailDTO = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  pricePoint: number;
  openingTime?: string;
  description?: string;
  imageUrl?: string;
};

export async function fetchSpotDetail(id: string): Promise<SpotDetailDTO> {
  await delay(200);
  // 데모용 더미 데이터
  return {
    id,
    name: "엘레강스 빌",
    address: "대구 수성구 경대로 5길 30-7",
    latitude: 35.8889,
    longitude: 128.6109,
    pricePoint: 2500,
    openingTime: "09:00 ~ 23:00",
    description: "경북대 북문 근처 원룸 주차 공간. 시간 단위 공유 가능.",
    imageUrl: "https://placehold.co/720x200?text=CampusPark",
  };
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
