import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type BookingState = {
  spotId?: number | string; // = parkingSpaceId
  spotName?: string;
  name?: string; // 폴백
  locationLabel?: string;
  address?: string;
  pricePerHour?: number;
  pricePoint?: number;
  defaultRange?: { start: string; end: string }; // "14:00" 등
};

type DayKey = "today" | "tomorrow";

export default function SpotBookingPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const s = (state ?? {}) as BookingState;

  // ---- 넘어온 데이터 파싱 (안전한 폴백) ----
  const parkingSpaceId =
    typeof s.spotId === "string" ? parseInt(s.spotId, 10) : (s.spotId ?? 1);
  const spotName = s.spotName ?? s.name ?? "이름 없음";
  const locationLabel = s.locationLabel ?? s.address ?? "위치 정보 없음";
  const pricePerHour = ((): number => {
    const v = s.pricePerHour ?? s.pricePoint;
    return typeof v === "number" && Number.isFinite(v) ? v : 2500;
  })();
  const defaultRange = s.defaultRange ?? { start: "14:00", end: "18:00" };

  // ---- 오늘/내일만 제공 ----
  const dayLabels: Record<DayKey, string> = { today: "오늘", tomorrow: "내일" };
  const [day, setDay] = useState<DayKey>("today");

  // ---- 시간 옵션 (00:00 ~ 23:30 / 30분 단위) ----
  const timeOptions = useMemo(() => {
    const arr: string[] = [];
    for (let h = 0; h < 24; h++) {
      arr.push(`${String(h).padStart(2, "0")}:00`);
      arr.push(`${String(h).padStart(2, "0")}:30`);
    }
    return arr;
  }, []);

  const [startTime, setStartTime] = useState(defaultRange.start);
  const [endTime, setEndTime] = useState(defaultRange.end);

  // 이용시간(시간) & 결제 포인트
  const hours = useMemo(() => {
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    const diffMin = Math.max(0, end - start);
    return Math.max(0, Math.ceil(diffMin / 60));
  }, [startTime, endTime]);
  const totalPoint = hours * pricePerHour;

  // ---- 로컬 타임존 기준으로 YYYY-MM-DDTHH:mm:00 만들기 ----
  const toLocalDateTimeString = (base: Date, hhmm: string) => {
    const [hh, mm] = hhmm.split(":").map(Number);
    const d = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate(),
      hh,
      mm,
      0,
      0
    );
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const H = String(d.getHours()).padStart(2, "0");
    const M = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day}T${H}:${M}:00`;
  };

  // 오늘/내일의 실제 날짜 객체
  const baseDate = useMemo(() => {
    const now = new Date();
    if (day === "today") return now;
    const t = new Date(now);
    t.setDate(now.getDate() + 1);
    return t;
  }, [day]);

  // ---- 예약 제출 핸들러 (JSON 구성) ----
  const submitBooking = async () => {
    if (!hours) {
      alert("시작/종료 시간을 확인해 주세요.");
      return;
    }
    const payload = {
      parkingSpaceId,
      startTime: toLocalDateTimeString(baseDate, startTime),
      endTime: toLocalDateTimeString(baseDate, endTime),
    };

    // TODO: fetch(POST ...)로 교체
    // await fetch('/api/reservations', { method:'POST', body: JSON.stringify(payload) ... })
    // 데모: 콘솔 출력 + 알림
    // eslint-disable-next-line no-console
    console.log("BOOKING PAYLOAD:", payload);
    alert("예약 요청을 전송했습니다.\n" + JSON.stringify(payload, null, 2));
    nav(-1);
  };

  return (
    <div className="relative min-h-dvh w-full bg-zinc-50">
      {/* Header */}
      <header className="flex h-[51px] w-full items-center justify-between border-b border-zinc-300 px-3">
        <button
          type="button"
          onClick={() => nav(-1)}
          aria-label="뒤로"
          className="grid h-6 w-6 place-items-center"
        >
          <span className="material-symbols-outlined text-[26px] leading-none">
            chevron_left
          </span>
        </button>
        <h1 className="text-[18px] font-semibold leading-7 text-black">
          주차 공간 상세
        </h1>
        <div className="h-6 w-6" />
      </header>

      <main className="mx-auto flex w-full max-w-[700px] flex-col gap-2 px-2 pb-28 pt-2">
        {/* 요약 카드 */}
        <section className="rounded-lg bg-white p-2 shadow-sm ring-1 ring-neutral-300">
          <div className="px-1 py-1">
            <h2 className="text-[18px] font-semibold leading-7 text-black">
              {spotName}
            </h2>
          </div>

          <div className="flex items-center gap-2 px-1 py-1 text-[12px]">
            <span className="font-semibold text-neutral-500">위치</span>
            <span className="font-semibold text-black">{locationLabel}</span>
          </div>

          <div className="flex items-center gap-2 px-1 py-1 text-[12px]">
            <span className="font-semibold text-neutral-500">시간</span>
            <span className="font-semibold text-black">
              {startTime} ~ {endTime}
            </span>
            <button
              type="button"
              className="rounded-2xl bg-blue-500 px-2 py-1 text-[10px] font-bold text-white"
              onClick={() => window.scrollTo({ top: 9999, behavior: "smooth" })}
            >
              이용 가능 시간 상세 보기
            </button>
          </div>

          <div className="flex items-center gap-2 px-1 py-1">
            <span className="text-[12px] font-semibold text-neutral-500">
              포인트
            </span>
            <span className="text-[12px] font-semibold">
              <span className="text-blue-500">
                {pricePerHour.toLocaleString()}P
              </span>
              <span className="text-neutral-500 text-[10px]"> /시간</span>
            </span>
          </div>
        </section>

        {/* 날짜 선택 (오늘/내일만) */}
        <section className="rounded-lg bg-white p-3">
          <h3 className="mb-2 text-[16px] font-semibold">날짜 선택</h3>
          <div className="grid grid-cols-2 gap-2">
            {(["today", "tomorrow"] as DayKey[]).map((k) => {
              const active = day === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setDay(k)}
                  className={[
                    "rounded-lg px-3 py-2 text-[14px] font-medium",
                    active
                      ? "bg-blue-500 text-white"
                      : "ring-1 ring-neutral-200 text-black",
                  ].join(" ")}
                >
                  {dayLabels[k]}
                </button>
              );
            })}
          </div>
        </section>

        {/* 시간 선택 */}
        <section className="rounded-lg bg-white p-3">
          <h3 className="mb-2 text-[16px] font-semibold">시간 선택</h3>
          <div className="flex gap-4">
            <div className="flex w-1/2 flex-col gap-1">
              <span className="text-[14px] font-medium">시작 시간</span>
              <select
                className="h-9 rounded-lg border border-neutral-200 px-2"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              >
                {timeOptions.map((t) => (
                  <option key={`s-${t}`} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-1/2 flex-col gap-1">
              <span className="text-[14px] font-medium">종료 시간</span>
              <select
                className="h-9 rounded-lg border border-neutral-200 px-2"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              >
                {timeOptions.map((t) => (
                  <option key={`e-${t}`} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* 결제 정보 */}
        <section className="rounded-lg bg-white p-3">
          <h3 className="mb-2 text-[16px] font-semibold">결제 정보</h3>

          <Row label="시간당 요금">
            <span className="text-[14px]">
              {pricePerHour.toLocaleString()}P
            </span>
          </Row>

          <Row label="이용 시간">
            <span className="text-[14px]">{hours}시간</span>
          </Row>

          <div className="my-2 h-px w-full bg-neutral-300/80" />

          <Row label={<strong>총 결제 금액</strong>}>
            <span className="text-[14px] font-semibold text-blue-600">
              {totalPoint.toLocaleString()}P
            </span>
          </Row>

          <div className="mt-2 rounded-lg bg-neutral-100 px-2 py-1">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-neutral-600">보유 포인트</span>
              <span className="font-semibold">15,000P</span>
            </div>
          </div>
        </section>
      </main>

      {/* 고정 CTA */}
      <div className="fixed bottom-2 left-1/2 z-40 w-full max-w-[700px] -translate-x-1/2 px-2">
        <button
          type="button"
          onClick={submitBooking}
          className="w-full rounded-xl bg-blue-500 px-3 py-3 mb-2 text-[18px] font-bold text-white shadow"
        >
          {totalPoint.toLocaleString()}P 결제하고 예약하기
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="text-[14px] text-neutral-700">{label}</div>
      <div className="text-right">{children}</div>
    </div>
  );
}
