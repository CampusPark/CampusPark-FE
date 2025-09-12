import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/layout/BottomNav";
import { ROUTE_PATH } from "@/routes/paths";

type Reservation = {
  id: string;
  spotName: string;
  locationLabel: string;
  start: string; // ISO or "HH:mm"
  end: string; // ISO or "HH:mm"
  pricePoint: number; // per hour or total — 화면 표시는 단순 포인트
  heroUrl?: string;
  status: "ACTIVE" | "DONE";
};

/** 데모용 목데이터 */
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
    spotName: "A하우스",
    locationLabel: "쪽문 맞은편",
    start: "20:00",
    end: "22:00",
    pricePoint: 3000,
    status: "DONE",
  },
];

export default function ReservationsPage() {
  const nav = useNavigate();
  const [tab, setTab] = useState<"ACTIVE" | "DONE">("ACTIVE");

  const list = useMemo(() => MOCK.filter((r) => r.status === tab), [tab]);

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[720px] bg-zinc-50 pb-[92px]">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 flex h-[51px] items-center justify-between border-b border-zinc-300 bg-white px-3">
        <div className="w-6 h-6" />
        <h1 className="text-[18px] font-semibold leading-7 text-black">
          예약 내역
        </h1>
        <div className="w-6 h-6" />
      </header>

      {/* 탭(이용중 / 이용 완료) */}
      <div className="mx-auto mt-2 flex max-w-[700px]  items-center gap-2 rounded-[24px] bg-neutral-100 p-1">
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

        {list.map((item) => (
          <article
            key={item.id}
            className="flex h-[130px] w-full items-start gap-1 rounded-lg bg-white p-2"
            onClick={() => nav(ROUTE_PATH.SPOT_DETAIL.replace(":id", "1"))}
            role="button"
          >
            {/* 썸네일 */}
            <div className="relative h-[110px] w-[104px] rounded-lg bg-amber-100 overflow-hidden">
              {item.heroUrl ? (
                <img
                  src={item.heroUrl}
                  alt={item.spotName}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            {/* 내용 */}
            <div className="flex w-[246px] flex-col justify-center gap-1 px-1 pb-2 pr-2">
              {/* 타이틀/남은시간 */}
              <div className="flex items-center justify-between">
                <div className="text-[16px] font-semibold text-black">
                  {item.spotName}
                </div>
                {item.status === "ACTIVE" && (
                  <span className="rounded-[12px] border border-green-500 bg-green-100 px-1.5 py-2 text-[10px] font-semibold leading-3 text-green-500">
                    45분 남음
                  </span>
                )}
              </div>

              {/* 위치 */}
              <div className="flex items-center gap-1 px-1">
                <i className="inline-block h-3 w-3 rounded-[2px] bg-neutral-600" />
                <span className="text-[12px] font-medium leading-7 text-neutral-600">
                  {item.locationLabel}
                </span>
              </div>

              {/* 시간 */}
              <div className="flex items-center gap-1 px-1">
                <i className="inline-block h-3 w-3 rounded-[2px] bg-neutral-600" />
                <span className="text-[12px] font-medium leading-7 text-neutral-600">
                  {item.start} ~ {item.end}
                </span>
              </div>

              {/* 포인트 */}
              <div className="flex items-center gap-1 px-1">
                <i className="inline-block h-3 w-3 rounded-[2px] bg-neutral-600" />
                <span className="text-[12px] font-semibold leading-[14px] text-blue-500">
                  {item.pricePoint.toLocaleString()}P
                </span>
              </div>
            </div>
          </article>
        ))}
      </main>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}
