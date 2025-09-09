import BottomNav from "@/components/layout/BottomNav";

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
    <div className="relative w-full min-h-dvh bg-zinc-50">
      {/* 상단 지도(이미지) */}
      <div className="relative flex h-[394px] w-full overflow-hidden rounded-t-lg">
        <img
          src="https://placehold.co/389x394"
          alt="map"
          className="h-full w-full object-cover"
        />
      </div>
      {/* 아래 패널 */}
      <section className="relative -mt-2 w-full rounded-t-md bg-gray-100 p-2">
        {/* 필터 카드 */}
        <div className="mx-auto mb-3 w-full max-w-[389px] rounded-xl bg-white p-1 shadow-[0_0_8px_rgba(0,0,0,0.25)]">
          {/* 시간/날짜 범위 - 스켈레톤 형태 */}
          <div className="flex h-9 items-center justify-center gap-2">
            <div className="flex w-[318px] items-center gap-2">
              <div className="h-5 w-36 rounded bg-gray-200" />
              <span className="text-[10px] font-bold leading-4 text-black">
                ~
              </span>
              <div className="h-5 w-36 rounded bg-gray-200" />
            </div>
            <button
              type="button"
              className="grid h-3.5 w-3.5 place-items-center rounded-[2px] bg-blue-500 p-1"
              aria-label="검색"
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
                <path d="M21 20l-5.2-5.2a7 7 0 10-1.4 1.4L20 21l1-1zM4 10a6 6 0 1112 0A6 6 0 014 10z" />
              </svg>
            </button>
          </div>

          {/* 가격 범위 */}
          <div className="px-1 py-2">
            <div className="mb-1 flex items-center gap-1 px-1">
              <span className="text-[10px] font-semibold leading-4 text-black">
                가격 범위
              </span>
            </div>
            <div className="flex h-6 items-center gap-2">
              <div className="h-5 w-[150px] rounded bg-gray-200" />
              <span className="text-[10px] font-bold leading-4 text-black">
                ~
              </span>
              <div className="h-5 w-[150px] rounded bg-gray-200" />
            </div>
          </div>
        </div>

        {/* 섹션 타이틀 */}
        <div className="mx-auto flex h-[22px] w-full max-w-[389px] items-center px-2.5">
          <h2 className="text-[16px] font-bold leading-4 text-black">
            근처 주차 공간
          </h2>
        </div>

        {/* 리스트 */}
        <div className="mx-auto grid w-full max-w-[389px] gap-3 pb-28">
          {dummySpots.map((s) => (
            <SpotCard key={s.id} spot={s} />
          ))}
        </div>
      </section>
      <BottomNav />
    </div>
  );
}

function SpotCard({ spot }: { spot: Spot }) {
  return (
    <div className="flex h-[90px] w-full items-center gap-2 rounded-lg bg-white p-1 shadow-[0_0_8px_rgba(0,0,0,0.25)]">
      <div className="h-20 w-[98px] rounded-lg bg-orange-50" />
      <div className="flex h-[74px] w-[240px] flex-col items-start justify-center gap-1 p-1">
        <div>
          <p className="text-[20px] font-bold leading-4 text-black">
            {spot.name}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[15px] font-bold leading-4 text-blue-500">
            {spot.pricePoint}P
          </span>
          <span className="text-[12px] font-semibold leading-4 text-neutral-600">
            {spot.unit}
          </span>
        </div>

        <div className="flex items-center gap-1 py-1 pr-1">
          {/* 온도 아이콘 대체 */}
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
          <span className="text-[10px] font-semibold leading-4 text-amber-500">
            {spot.manner}
          </span>
          <span className="text-[10px] font-semibold leading-4 text-gray-500">
            매너 온도
          </span>
        </div>
      </div>
    </div>
  );
}
