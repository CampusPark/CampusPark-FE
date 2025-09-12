import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/layout/BottomNav";
import { ROUTE_PATH } from "@/routes/paths";

type Reservation = {
  id: string;
  spotName: string;
  locationLabel: string;
  start: string; // "HH:mm"
  end: string; // "HH:mm"
  pricePoint: number;
  heroUrl?: string;
  status: "ACTIVE" | "DONE";
  // DONE 전용
  returnedAt?: string; // ISO (예: "2025-09-07T11:05:00+09:00")
};

/** 데모용 데이터 */
const MOCK: Reservation[] = [
  {
    id: "rsv_1",
    spotName: "엘레강스빌",
    locationLabel: "북문 근처",
    start: "09:00",
    end: "11:00",
    pricePoint: 2500,
    status: "ACTIVE",
  },
  {
    id: "rsv_2",
    spotName: "엘레강스빌",
    locationLabel: "쪽문 근처",
    start: "14:00",
    end: "18:00",
    pricePoint: 2500,
    status: "DONE",
    returnedAt: "2025-09-07T18:05:00+09:00",
  },
];

/** 2025.09.07 (일요일) 형태로 포매팅 */
function fmtDateK(dateISO?: string) {
  if (!dateISO) return "";
  const d = new Date(dateISO);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const day = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${yyyy}.${mm}.${dd} (${day}요일)`;
}

export default function ReservationsPage() {
  const nav = useNavigate();
  const [tab, setTab] = useState<"ACTIVE" | "DONE">("ACTIVE");

  const list = useMemo(() => MOCK.filter((r) => r.status === tab), [tab]);

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[720px] bg-zinc-50 pb-[92px]">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 flex h-[51px] items-center justify-between border-b border-zinc-300 bg-white px-3">
        <div className="h-6 w-6" />
        <h1 className="text-[18px] font-semibold leading-7 text-black">
          예약 내역
        </h1>
        <div className="h-6 w-6" />
      </header>

      {/* 탭 */}
      <div className="mx-auto mt-2 flex w-[700px] items-center gap-2 rounded-[24px] bg-neutral-100 p-1">
        <button
          type="button"
          onClick={() => setTab("ACTIVE")}
          className={[
            "h-[33px] flex-1 rounded-[24px] text-center text-[12px] font-medium",
            tab === "ACTIVE" ? "bg-white text-blue-600" : "text-neutral-600",
          ].join(" ")}
        >
          이용중
        </button>
        <button
          type="button"
          onClick={() => setTab("DONE")}
          className={[
            "h-[33px] flex-1 rounded-[24px] text-center text-[12px] font-medium",
            tab === "DONE" ? "bg-white text-blue-600" : "text-neutral-600",
          ].join(" ")}
        >
          이용 완료
        </button>
      </div>

      {/* 리스트 */}
      <main className="mx-auto mt-2 flex w-full max-w-[700px] flex-col gap-2 px-2">
        {list.length === 0 && (
          <div className="py-10 text-center text-sm text-neutral-400">
            표시할 예약이 없어요.
          </div>
        )}

        {list.map((item) =>
          item.status === "ACTIVE" ? (
            <ActiveCard
              key={item.id}
              data={item}
              onClick={() =>
                nav(ROUTE_PATH.RESERVATION_DETAIL.replace(":id", "1"))
              }
            />
          ) : (
            <DoneCard key={item.id} data={item} />
          )
        )}
      </main>

      <BottomNav />
    </div>
  );
}

/* -------------------- Active Card -------------------- */

function ActiveCard({
  data,
  onClick,
}: {
  data: Reservation;
  onClick?: () => void;
}) {
  return (
    <article
      className="flex h-[130px] w-full cursor-pointer items-start gap-1 rounded-lg bg-white p-2"
      onClick={onClick}
    >
      {/* 썸네일 */}
      <div className="relative h-[110px] w-[104px] overflow-hidden rounded-lg bg-amber-100">
        {data.heroUrl ? (
          <img
            src={data.heroUrl}
            alt={data.spotName}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      {/* 내용 */}
      <div className="flex w-full max-w-[560px] flex-col justify-center gap-1 px-1 pb-2 pr-2">
        {/* 타이틀 / 남은시간 배지 */}
        <div className="flex items-center justify-between">
          <div className="text-[16px] font-semibold text-black">
            {data.spotName}
          </div>
          <span className="rounded-[12px] border border-green-500 bg-green-100 px-1.5 py-2 text-[10px] font-semibold leading-3 text-green-500">
            45분 남음
          </span>
        </div>

        {/* 위치 */}
        <RowIconText text={data.locationLabel} />

        {/* 시간 */}
        <RowIconText text={`${data.start} ~ ${data.end}`} />

        {/* 포인트 */}
        <div className="flex items-center gap-1 px-1">
          <i className="inline-block h-3 w-3 rounded-[2px] bg-neutral-600" />
          <span className="text-[12px] font-semibold leading-[14px] text-blue-500">
            {data.pricePoint.toLocaleString()}P
          </span>
        </div>
      </div>
    </article>
  );
}

/* -------------------- Done Card -------------------- */

function DoneCard({ data }: { data: Reservation }) {
  return (
    <article className="flex w-full flex-col items-center gap-1 rounded border border-neutral-300 bg-white p-2">
      {/* 제목 + 반납 완료 배지 */}
      <div className="flex h-[25px] w-full items-center gap-5 px-1">
        <div className="flex-1 text-[18px] font-semibold leading-7 text-black">
          {data.spotName}
        </div>
        <span className="rounded-lg border border-blue-600 bg-blue-100 px-2 py-1 text-[10px] font-semibold leading-3 text-blue-600">
          반납 완료
        </span>
      </div>

      {/* 날짜 */}
      <div className="flex h-[17px] w-full items-center gap-2 px-1">
        <span className="text-[10px] font-medium leading-4 text-neutral-500">
          {fmtDateK(data.returnedAt)}
        </span>
      </div>

      {/* 위치 */}
      <div className="flex h-[26px] w-full items-center gap-2 px-1">
        <span className="text-[12px] font-semibold leading-7 text-neutral-500">
          위치
        </span>
        <span className="text-[12px] font-semibold leading-7 text-black">
          {data.locationLabel}
        </span>
      </div>

      {/* 시간 */}
      <div className="flex h-[26px] w-full items-center gap-2 px-1">
        <span className="text-[12px] font-semibold leading-7 text-neutral-500">
          시간
        </span>
        <span className="text-[12px] font-semibold leading-7 text-black">
          {data.start}~{data.end} 이용 가능
        </span>
        <button
          type="button"
          className="ml-2 rounded-[12px] bg-blue-500 px-2 py-2 text-[9px] font-bold text-white"
        >
          이용 가능 시간 상세 보기
        </button>
      </div>

      {/* 포인트 */}
      <div className="flex h-[26px] w-full items-center gap-2 px-1">
        <span className="text-[12px] font-semibold leading-7 text-neutral-500">
          포인트
        </span>
        <span className="text-[12px] font-semibold leading-7 text-blue-500">
          {data.pricePoint.toLocaleString()}P
        </span>
        <span className="text-[8px] font-semibold leading-7 text-neutral-500">
          /시간
        </span>
      </div>
    </article>
  );
}

/* -------------------- Small UI helpers -------------------- */

function RowIconText({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1 px-1">
      <i className="inline-block h-3 w-3 rounded-[2px] bg-neutral-600" />
      <span className="text-[12px] font-medium leading-7 text-neutral-600">
        {text}
      </span>
    </div>
  );
}
