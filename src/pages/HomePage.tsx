import BottomNav from "@/components/layout/BottomNav";
import KakaoMap from "@/components/KakaoMap";

type Spot = {
  id: string;
  name: string;
  pricePoint: number; // P
  unit: string; // "/시간"
  manner: string; // "85°C"
  image?: string;
};

const dummySpots: Spot[] = [
  {
    id: "1",
    name: "엘레강스 빌",
    pricePoint: 2500,
    unit: "/시간",
    manner: "85°C",
  },
  {
    id: "2",
    name: "엘레강스 빌",
    pricePoint: 2500,
    unit: "/시간",
    manner: "85°C",
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-dvh w-full bg-zinc-50 pb-24">
      <KakaoMap />

      {/* 아래 패널 */}
      <section className="relative -mt-2 w-full rounded-t-md py-3">
        {/* 필터 카드 */}
        <div className="w-full rounded-xl bg-white p-3 shadow-[0_0_8px_rgba(0,0,0,0.25)]">
          {/* 시간 범위 */}
          <div className="flex h-9 items-center justify-between gap-2">
            <div className="flex flex-1 items-center gap-2">
              <div className="h-5 flex-1 rounded bg-gray-200" />
              <span className="text-[10px] font-bold leading-4 text-black">
                ~
              </span>
              <div className="h-5 flex-1 rounded bg-gray-200" />
            </div>
            <button
              type="button"
              className="grid h-6 w-6 place-items-center rounded bg-blue-500"
              aria-label="검색"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M21 20l-5.2-5.2a7 7 0 10-1.4 1.4L20 21l1-1zM4 10a6 6 0 1112 0A6 6 0 014 10z" />
              </svg>
            </button>
          </div>

          {/* 가격 범위 */}
          <div className="mt-3">
            <div className="mb-1 px-1">
              <span className="text-[10px] font-semibold leading-4 text-black">
                가격 범위
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 flex-1 rounded bg-gray-200" />
              <span className="text-[10px] font-bold leading-4 text-black">
                ~
              </span>
              <div className="h-5 flex-1 rounded bg-gray-200" />
            </div>
          </div>
        </div>

        {/* 섹션 타이틀 */}
        <h2 className="mt-8 mb-4 text-[16px] font-bold leading-4 text-black">
          근처 주차 공간
        </h2>

        {/* 리스트 */}
        <div className="grid gap-3">
          {dummySpots.map((s) => (
            <SpotCard key={s.id} spot={s} />
          ))}
        </div>
      </section>

      {/* 선택적: 스페이서 대신 컨테이너 pb-24로 처리 */}
      <BottomNav />
    </div>
  );
}

function SpotCard({ spot }: { spot: Spot }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_0_8px_rgba(0,0,0,0.2)]">
      {/* 썸네일 */}
      <div className="h-16 w-20 flex-shrink-0 rounded-xl bg-orange-50" />

      {/* 본문 */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-[20px] font-bold leading-5 text-black">
          {spot.name}
        </p>

        <div className="flex items-baseline gap-1">
          <span className="text-[15px] font-bold leading-4 text-blue-500">
            {spot.pricePoint}P
          </span>
          <span className="text-[12px] font-semibold leading-4 text-neutral-600">
            {spot.unit}
          </span>
        </div>

        <div className="flex items-center gap-1 pt-1 text-[10px]">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            className="text-amber-500"
          >
            <path
              fill="#FFA629"
              d="M13 15.1V5a1 1 0 10-2 0v10.1a3.5 3.5 0 102 0z"
            />
          </svg>
          <span className="font-semibold text-amber-500">{spot.manner}</span>
          <span className="font-semibold text-gray-500">매너 온도</span>
        </div>
      </div>
    </div>
  );
}
