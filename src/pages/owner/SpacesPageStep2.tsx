import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/layout/BottomNav";
import ProgressBar from "@/components/ProgressBar";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { ROUTE_PATH } from "@/routes/paths";

export default function SpacesPageStep3() {
  const navigate = useNavigate();

  const periods = ["오전", "오후"] as const;
  const hours = React.useMemo(
    () => Array.from({ length: 12 }, (_, i) => i + 1),
    []
  );
  type Period = (typeof periods)[number];

  const [startPeriod, setStartPeriod] = React.useState<Period>("오전");
  const [startHour, setStartHour] = React.useState<number>(9); // 09
  const [endPeriod, setEndPeriod] = React.useState<Period>("오후");
  const [endHour, setEndHour] = React.useState<number>(6); // 18

  // 오전/오후 + 1~12시 -> 0~23시
  const to24h = (p: Period, h12: number) => {
    const isAM = p === "오전";
    if (isAM) return h12 === 12 ? 0 : h12; // 12AM => 0
    return h12 === 12 ? 12 : h12 + 12; // 12PM => 12
  };

  // 0~23시 -> "HH:00:00"
  const toHHMMSS = (hour24: number) =>
    `${String(hour24).padStart(2, "0")}:00:00`;

  const handleNext = () => {
    const s = to24h(startPeriod, startHour);
    const e = to24h(endPeriod, endHour);

    if (s >= e) {
      window.alert("종료 시간은 시작 시간보다 커야 합니다.");
      return;
    }

    // ⬇️ 날짜 제외: 시간만 저장
    const startTimeOnly = toHHMMSS(s); // "09:00:00"
    const endTimeOnly = toHHMMSS(e); // "18:00:00"

    localStorage.setItem("parking_availableStartTime", startTimeOnly);
    localStorage.setItem("parking_availableEndTime", endTimeOnly);

    // 표시용 라벨(선택)
    const label = `${startPeriod} ${String(startHour).padStart(2, "0")}:00 ~ ${endPeriod} ${String(endHour).padStart(2, "0")}:00`;
    localStorage.setItem("parking_time_range_label", label);

    navigate(ROUTE_PATH.REGISTER_STEP4);
  };

  return (
    <div className="flex-1 flex flex-col items-stretch bg-neutral-50">
      <Header title="내 공간 등록하기" />
      <div className="w-full px-4 py-1 flex flex-col justify-center items-start gap-3 overflow-hidden">
        <ProgressBar currentStep={3} />

        <div className="w-full p-1 inline-flex justify-start items-center gap-2.5 overflow-hidden">
          <div className="flex justify-start items-center gap-2.5 overflow-hidden">
            <div className="justify-center text-black text-base font-bold leading-7">
              언제 대여가 가능한가요?
            </div>
          </div>
        </div>

        {/* 시간 선택 */}
        <div className="w-full flex flex-col justify-center items-start gap-1 overflow-hidden">
          <div className="self-stretch py-1 flex flex-col justify-center items-start gap-1 overflow-hidden">
            <div className="w-full px-2 inline-flex justify-start items-center gap-1 overflow-hidden">
              <div className="flex justify-start items-center gap-2.5 overflow-hidden">
                <div className="w-16 h-3.5 justify-center text-black text-[10px] font-semibold leading-none">
                  시간 선택
                </div>
              </div>
            </div>

            <div className="w-full px-1 inline-flex justify-start items-center gap-1">
              {/* 시작 - 오전/오후 */}
              <select
                aria-label="시작 오전/오후"
                value={startPeriod}
                onChange={(e) => setStartPeriod(e.target.value as Period)}
                className="flex-[3] h-8 bg-white rounded border border-neutral-400 px-2 text-sm outline-none focus:outline-none focus:ring-0"
              >
                {periods.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {/* 시작 - 시각 */}
              <select
                aria-label="시작 시각"
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
                className="flex-[7] h-8 bg-white rounded border border-neutral-400 px-2 text-sm outline-none focus:outline-none focus:ring-0"
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, "0")}:00
                  </option>
                ))}
              </select>

              <div className="shrink-0 px-3 flex items-center">
                <span className="text-black text-base font-semibold leading-none">
                  ~
                </span>
              </div>

              {/* 종료 - 오전/오후 */}
              <select
                aria-label="종료 오전/오후"
                value={endPeriod}
                onChange={(e) => setEndPeriod(e.target.value as Period)}
                className="flex-[3] h-8 bg-white rounded border border-neutral-400 px-2 text-sm outline-none focus:outline-none focus:ring-0"
              >
                {periods.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {/* 종료 - 시각 */}
              <select
                aria-label="종료 시각"
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
                className="flex-[7] h-8 bg-white rounded border border-neutral-400 px-2 text-sm outline-none focus:outline-none focus:ring-0"
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, "0")}:00
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 다음 버튼 */}
        <div className="w-full p-3 pb-2 flex items-center gap-3">
          <SecondaryButton
            fullWidth={false}
            className="flex-1"
            onClick={() => navigate(ROUTE_PATH.REGISTER_STEP2)}
          >
            이전
          </SecondaryButton>
          <PrimaryButton
            fullWidth={false}
            className="flex-1"
            onClick={handleNext}
          >
            다음
          </PrimaryButton>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
