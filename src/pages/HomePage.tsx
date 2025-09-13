import BottomNav from "@/components/layout/BottomNav";
import KakaoMap from "@/components/KakaoMap";
import SearchTrigger from "@/components/SearchTrigger";
import { useNavigate, Link, generatePath } from "react-router-dom";
import { ROUTE_PATH } from "@/routes/paths";

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
  const nav = useNavigate();

  return (
    <div className="relative min-h-dvh w-full bg-zinc-50 pb-24">
      <div className="relative">
        {/* 지도 자체는 z-10 */}
        <KakaoMap />

        {/* 지도 위 오버레이 영역 */}
        <div className="pointer-events-none absolute inset-x-0 top-5 z-20 flex justify-center px-4">
          <SearchTrigger
            onClick={() => nav("/search")}
            className="pointer-events-auto w-5/6 max-w-[720px]"
          />
        </div>
      </div>

      {/* 아래 패널 */}
      <section className="relative -mt-2 w-full rounded-t-md px-2 sm:px-3 py-3">
        {/* 섹션 타이틀 */}
        <h2 className="mx-auto mt-6 mb-2 w-full max-w-[700px] px-1 text-[16px] sm:text-[18px] font-bold text-black">
          근처 주차 공간
        </h2>

        {/* 리스트 */}
        <div className="mx-auto w-full max-w-[700px] grid gap-3 px-1">
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
  const to = generatePath(ROUTE_PATH.SPOT_DETAIL, { id: spot.id });
  return (
    <Link
      to={to}
      className={[
        "flex w-full max-w-[680px] items-center gap-2 rounded-lg bg-white",
        "p-2 sm:p-3 mx-auto",
        "shadow-sm hover:shadow-md transition-shadow",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
      ].join(" ")}
      aria-label={`${spot.name} 상세로 이동`}
    >
      {/* 썸네일 */}
      <div className="overflow-hidden rounded-lg bg-orange-50 flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24">
        {spot.image ? (
          <img
            src={spot.image}
            alt={`${spot.name} 썸네일`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>

      {/* 텍스트 영역 */}
      <div className="flex min-w-0 flex-col items-start justify-center gap-1 p-1">
        <p className="truncate text-base sm:text-[18px] md:text-[20px] font-semibold leading-6 sm:leading-7 text-black">
          {spot.name}
        </p>

        <div className="flex items-center gap-1">
          <span className="text-sm font-bold leading-5 sm:leading-6 text-blue-500">
            {spot.pricePoint.toLocaleString()}P
          </span>
          <span className="text-xs font-semibold leading-5 sm:leading-6 text-neutral-600">
            {spot.unit}
          </span>
        </div>

        <div className="flex items-center gap-2 py-1 pr-1">
          <img
            src="/assets/mypage_temperature.svg"
            alt="temperature icon"
            className="w-4 h-4"
          />
          <span className="text-xs font-semibold text-amber-500">
            {spot.manner}
          </span>
          <span className="text-xs font-medium  text-gray-500">매너 온도</span>
        </div>
      </div>
    </Link>
  );
}
