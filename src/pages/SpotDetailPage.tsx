import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// 필요한 타입은 프로젝트 상황에 맞게 교체
type SpotDetail = {
  id: string | number;
  name: string;
  locationText: string; // 예: "쪽문 근처"
  availableText: string; // 예: "14~18시 이용 가능"
  pointPerHour: number; // 예: 2500
  providerName: string; // 예: "김대학"
  mannerTemp: string; // 예: "85°C"
  aiSummary: string; // AI 공간 설명
  heroUrl?: string; // 상단 이미지
};

// TODO: 실제 API 연동으로 교체
async function fetchSpotDetailMock(id: string): Promise<SpotDetail> {
  return {
    id,
    name: "엘레강스빌",
    locationText: "쪽문 근처",
    availableText: "14~18시 이용 가능",
    pointPerHour: 2500,
    providerName: "김대학",
    mannerTemp: "85°C",
    aiSummary:
      "쪽문 근처에 위치한 주차 공간입니다. CCTV가 설치되어 있어 안전하며, 주차 공간이 넓고 쾌적합니다. 하지만 이중 주차가 될 가능성이 있으니 시간 여유가 없다면 추천하지 않아요!",
    heroUrl: "", // 빈 값이면 플레이스홀더 배경 표시
  };
}

export default function SpotDetailPage() {
  const nav = useNavigate();
  const { id = "" } = useParams<{ id: string }>();
  const [data, setData] = useState<SpotDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchSpotDetailMock(String(id))
      .then((d) => alive && setData(d))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading || !data) {
    return (
      <div className="mx-auto min-h-dvh w-full bg-white">
        <Header onBack={() => nav(-1)} />
        <div className="p-4 text-sm text-neutral-500">불러오는 중…</div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto min-h-dvh w-full bg-white">
      {/* 상단 헤더 */}
      <Header title="주차 공간 상세" onBack={() => nav(-1)} />

      {/* 히어로 이미지 또는 플레이스홀더 */}
      <div className="mx-auto h-[270px] w-full  max-w-[720px] px-3 bg-slate-500">
        {data.heroUrl ? (
          <img
            src={data.heroUrl}
            alt={data.name}
            className="h-full w-full rounded object-cover"
          />
        ) : null}
      </div>

      {/* 기본 정보 카드 */}
      <section className="mx-auto mt-2 w-full max-w-[680px] rounded border border-neutral-300 p-2.5">
        {/* 이름 */}
        <div className="px-0.5 pb-2.5">
          <h1 className="text-[18px] font-semibold leading-7 text-black">
            {data.name}
          </h1>
        </div>

        {/* 위치 */}
        <Row label="위치" value={data.locationText} />

        {/* 시간 + 상세 버튼 */}
        <div className="mt-0.5 flex items-center gap-2 px-1">
          <Labeled className="text-[12px] font-semibold text-black">
            <span className="text-neutral-500">시간&nbsp;</span>
            {data.availableText}
          </Labeled>

          <button
            type="button"
            className="rounded-full bg-blue-500 px-2.5 py-2 text-[10px] font-bold  text-white"
            // onClick={...} // 시간 상세 모달 등 연결
          >
            이용 가능 시간 상세 보기
          </button>
        </div>

        {/* 포인트 */}
        <div className="mt-0.5 flex items-center gap-2 px-1">
          <span className="text-[12px] font-semibold text-neutral-500">
            포인트
          </span>
          <div className="text-[12px] font-semibold leading-7">
            <span className="text-blue-500">{data.pointPerHour}P</span>
            <span className="text-[10px] text-neutral-500"> /시간</span>
          </div>
        </div>
      </section>

      {/* 제공자 + 매너온도 박스 */}
      <section className="mx-auto mt-2 flex w-full max-w-[680px] items-center justify-between gap-2 rounded-lg bg-neutral-100 p-1">
        <div className="p-1">
          <div className="p-1">
            <span className="text-[12px] font-semibold text-black">
              {data.providerName}
            </span>
          </div>
          <div className="p-1">
            <span className="text-[10px] font-medium text-neutral-500">
              공간 제공자
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1">
          {/* 온도 아이콘 간단 대체 */}
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="#FFA629"
              d="M13 15.1V5a1 1 0 10-2 0v10.1a3.5 3.5 0 102 0z"
            />
          </svg>
          <span className="text-[10px] font-semibold text-amber-500">
            {data.mannerTemp}
          </span>
          <span className="text-[10px] font-semibold text-gray-500">
            매너 온도
          </span>
        </div>
      </section>

      {/* 공간 설명 + AI 설명 박스 */}
      <section className="mx-auto mt-2 w-full max-w-[680px] px-2">
        <div className="mb-2 text-[12px] font-semibold text-neutral-600">
          공간 설명
        </div>

        <div className="rounded border border-blue-600 p-2">
          <div className="mb-1 flex items-center gap-1">
            <div className="grid h-3 w-3 place-items-center rounded-full bg-blue-500">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-blue-600">
              AI 공간 설명
            </span>
          </div>

          <p className="text-[10px] leading-3 text-blue-600">
            {data.aiSummary}
          </p>
        </div>
      </section>

      {/* 하단 고정 버튼 (네비게이션 숨김) */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[720px]
                   bg-gradient-to-t from-white/90 to-white/0 pb-[calc(env(safe-area-inset-bottom,0)+16px)] pt-6"
      >
        <div className="pointer-events-auto mx-auto w-full max-w-[680px] px-2">
          <button
            type="button"
            className="h-12 w-full rounded-xl bg-blue-500 text-[16px] font-bold text-white shadow-md"
            // onClick={...} // 예약 흐름 연결
          >
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Sub Components ---------- */

function Header({
  title = "주차 공간 상세",
  onBack,
}: {
  title?: string;
  onBack: () => void;
}) {
  return (
    <header className="flex h-[51px] w-full items-center justify-between border-b border-zinc-300 px-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="뒤로"
        className="grid h-6 w-6 place-items-center"
      >
        <span className="material-symbols-outlined text-[22px] leading-none">
          chevron_left
        </span>
      </button>
      <h2 className="text-[18px] font-semibold leading-7 text-black">
        {title}
      </h2>
      <div className="h-6 w-6" />
    </header>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-0.5 flex items-center gap-2 px-1">
      <span className="text-[12px] font-semibold text-neutral-500">
        {label}
      </span>
      <span className="text-[12px] font-semibold text-black">{value}</span>
    </div>
  );
}

function Labeled({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={className}>{children}</div>;
}
