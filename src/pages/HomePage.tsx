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

        {/* 지도 위 오버레이 영역 (드래그 가능하도록 래퍼는 pointer-events-none) */}
        <div className="pointer-events-none absolute inset-x-0 top-5 z-20 flex justify-center px-4">
          {/* 실제 버튼만 클릭 가능하도록 pointer-events-auto */}
          <SearchTrigger
            onClick={() => nav("/search")}
            className="pointer-events-auto w-5/6"
          />
        </div>
      </div>

      {/* 아래 패널 */}
      <section className="relative -mt-2 w-full rounded-t-md py-3">
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
  const to = generatePath(ROUTE_PATH.SPOT_DETAIL, { id: spot.id });
  return (
    <Link
      to={to}
      className="flex h-[90px] w-full items-center gap-2 rounded-lg bg-white p-1 shadow-[0_0_8px_rgba(0,0,0,0.25)]
                 hover:shadow-[0_2px_12px_rgba(0,0,0,0.18)] transition-shadow
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={`${spot.name} 상세로 이동`}
    >
      <div className="h-20 w-[98px] rounded-lg bg-orange-50" />
      <div className="flex h-[74px] flex-col items-start justify-center gap-1 p-1">
        <p className="text-[20px] font-bold leading-4 text-black">
          {spot.name}
        </p>

        <div className="flex items-center gap-1">
          <span className="text-[15px] font-bold leading-4 text-blue-500">
            {spot.pricePoint}P
          </span>
          <span className="text-[12px] font-semibold leading-4 text-neutral-600">
            {spot.unit}
          </span>
        </div>

        <div className="flex items-center gap-1 py-1 pr-1">
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
    </Link>
  );
}
