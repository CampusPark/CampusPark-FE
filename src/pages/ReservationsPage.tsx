import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/layout/BottomNav";
import ParkingSpaceCard from "@/components/ParkingSpaceCard"; // ✅ 추가
import { ROUTE_PATH } from "@/routes/paths";
import Header from "@/components/Header";

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

/** Reservation → ParkingSpaceCard props 매핑 */
function toPsCardProps(r: Reservation) {
  return {
    name: r.spotName,
    location: r.locationLabel,
    points: r.pricePoint,
    timeWindow: `${r.start} ~ ${r.end}`,
    thumbnailUrl: r.heroUrl,
  } as const;
}

export default function ReservationsPage() {
  const nav = useNavigate();
  const [tab, setTab] = useState<"ACTIVE" | "DONE">("ACTIVE");

  const list = useMemo(() => MOCK.filter((r) => r.status === tab), [tab]);

  return (
    <div className="flex-1 flex flex-col items-stretch bg-neutral-50">
      <Header title="예약 내역" />
      <div className="w-full px-4 py-1 flex flex-col justify-center items-start gap-1]">
        {/* 탭 바 */}
        <div className="mx-auto flex w-full items-center gap-2 rounded-[24px] bg-neutral-100 p-1">
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
            <ActiveReservationCard
              key={item.id}
              data={item}
              onClick={
                () => nav(ROUTE_PATH.RESERVATION_DETAIL.replace(":id", item.id)) // ✅ 실제 id 사용
              }
              // remainingMinutes={calcRemainingMinutes(item)} // 필요하면 계산로직 연결
            />
          ) : (
            <DoneReservationCard key={item.id} data={item} />
          )
        )}
      </main>

      <BottomNav />
    </div>
  );
}

/* -------------------- 래퍼 카드들 -------------------- */

/** 이용중 카드: ParkingSpaceCard 재사용 + 남은시간 배지 */
function ActiveReservationCard({
  data,
  onClick,
  remainingMinutes = 45, // 임시값. 실제로는 종료시각/현재시각으로 계산해 넣어도 됨
}: {
  data: Reservation;
  onClick?: () => void;
  remainingMinutes?: number;
}) {
  const ps = toPsCardProps(data);

  return (
    <div className="relative">
      <ParkingSpaceCard
        {...ps}
        remainingMinutes={remainingMinutes}
        onClick={onClick}
      />
    </div>
  );
}

/** 완료 카드: ParkingSpaceCard 재사용 + 완료 전용 정보 블록 */
function DoneReservationCard({ data }: { data: Reservation }) {
  const ps = toPsCardProps(data);

  return (
    <div className="relative">
      {/* 우상단 배지 */}
      <span className="absolute right-2 top-2 rounded-lg border border-blue-600 bg-blue-100 px-2 py-1 text-[10px] font-semibold leading-3 text-blue-600">
        반납 완료
      </span>

      <ParkingSpaceCard {...ps} />

      {/* 완료 전용 하단 섹션 */}
      <div className="mt-1 rounded border border-neutral-200 bg-white px-2 py-2">
        {/* 날짜 */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium leading-4 text-neutral-500">
            {fmtDateK(data.returnedAt)}
          </span>
        </div>

        {/* 이용 시간 + 상세보기 버튼 */}
        <div className="mt-1 flex items-center gap-2">
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

        {/* 포인트(/시간) */}
        <div className="mt-1 flex items-center gap-2">
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
      </div>
    </div>
  );
}
