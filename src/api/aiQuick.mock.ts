// 단순 주차장 요약 정보
export interface SpotLite {
  id: string;
  name: string;
  address: string;
}

// 시간대 정보
export interface TimeSlot {
  label: string;
  start: string; // e.g. "20:00"
  end: string; // e.g. "22:00"
}

// keyword → 주차장 리스트 검색
export async function searchSpotsByKeyword(
  keyword: string
): Promise<SpotLite[]> {
  await delay(250);

  // 1. 정규화 함수 정의
  const normalize = (text: string) =>
    text.replace(/\s+/g, "").replace(/경대/g, "경북대");

  // 2. 전체 Mock 데이터
  const allSpots: SpotLite[] = [
    { id: "a1", name: "A하우스", address: "경북대 북문 앞" },
    { id: "b2", name: "B주차장", address: "북문 사거리" },
    { id: "c3", name: "C원룸", address: "경대로 5길" },
  ];

  // 3. 검색어 전처리
  const q = normalize(keyword);

  // 4. 필터링
  return allSpots.filter(
    (s) => normalize(s.name).includes(q) || normalize(s.address).includes(q)
  );
}

// 특정 주차장 예약 가능 시간대 조회
export async function fetchTimeSlots(spotId: string): Promise<TimeSlot[]> {
  await delay(200);

  if (spotId === "a1") {
    return [
      { label: "18시~20시", start: "18:00", end: "20:00" },
      { label: "20시~22시", start: "20:00", end: "22:00" },
    ];
  }

  return [
    { label: "10시~12시", start: "10:00", end: "12:00" },
    { label: "12시~14시", start: "12:00", end: "14:00" },
  ];
}

// 예약 생성 결과 타입
export interface ReservationResult {
  ok: true;
  reservationId: string;
}

// 예약 생성
export async function createReservation(opts: {
  spotId: string;
  start: string;
  end: string;
}): Promise<ReservationResult> {
  await delay(200);

  // opts 사용 예시: 예약 정보 출력
  console.log(
    `예약 생성: spotId=${opts.spotId}, start=${opts.start}, end=${opts.end}`
  );

  return { ok: true, reservationId: "rsv_123" };
}

// 내부 지연 함수 (Promise<void> 명시)
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
