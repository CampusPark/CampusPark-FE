import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/layout/BottomNav";
import ProgressBar from "@/components/ProgressBar";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { ROUTE_PATH } from "@/routes/paths";

// ✅ 로컬 스토리지 키 (API: availableCount)
const LOCAL_KEY = "parking_availableCount";

export default function SpacesPageStep4() {
  const navigate = useNavigate();

  // 초기값: localStorage → 기본값 1
  const [totalSpaces, setTotalSpaces] = React.useState<number>(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    const n = saved ? parseInt(saved, 10) : 1;
    return Number.isFinite(n) && n > 0 ? n : 1;
  });

  // 범위 보정
  const clamp = (n: number) => {
    const MIN = 1;
    const MAX = 15;
    return Math.min(MAX, Math.max(MIN, n));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    if (raw === "") {
      setTotalSpaces(NaN as unknown as number);
      return;
    }
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) return;
    setTotalSpaces(clamp(n));
  };

  const handleBlur = () => {
    const value = Number.isFinite(totalSpaces) ? totalSpaces : 1;
    setTotalSpaces(clamp(value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      (e.currentTarget as HTMLInputElement).blur();
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).blur();
  };

  // 다음 단계: localStorage에 저장 후 이동
  const handleNext = async () => {
    const value = clamp(Number.isFinite(totalSpaces) ? totalSpaces : 1);

    // ✅ API에서 사용할 키명으로 저장 (availableCount)
    localStorage.setItem(LOCAL_KEY, String(value));

    navigate(ROUTE_PATH.REGISTER_STEP5);
  };

  const isValid = Number.isFinite(totalSpaces) && (totalSpaces as number) >= 1;

  return (
    <div className="min-h-svh w-full bg-zinc-50">
      <div className="relative mx-auto min-h-svh w-full max-w-[420px] sm:max-w-[480px] md:max-w-[640px] flex flex-col items-stretch overflow-hidden">
        <div className="flex-1 bg-neutral-50 flex flex-col items-center gap-2">
          <Header title="내 공간 등록하기" />
          <div className="w-full px-3 py-1 flex flex-col justify-center items-start gap-3 overflow-hidden">
            <ProgressBar currentStep={4} />

            <div className="w-full p-1 flex flex-col justify-center items-start gap-1 overflow-hidden">
              <div className="inline-flex justify-start items-center gap-2.5 overflow-hidden">
                <div className="justify-center text-black text-base font-bold leading-7">
                  주차 가능 대수는 총 몇 대인가요?
                </div>
              </div>
              <p className="text-xs text-neutral-500 px-1 pb-2">
                최소 1대, 최대 15대까지 입력할 수 있어요.
              </p>

              <div className="w-full px-1 inline-flex justify-end items-center gap-2 overflow-hidden">
                <input
                  aria-label="주차 가능 대수"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  type="number"
                  min={1}
                  max={15}
                  value={Number.isFinite(totalSpaces) ? totalSpaces : ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  onWheel={handleWheel}
                  placeholder="3"
                  className="w-20 h-9 text-center bg-neutral-100 rounded-lg border border-neutral-300 outline-none focus:ring-0"
                />
                <span className="text-black text-sm font-semibold leading-none">
                  대
                </span>
              </div>
            </div>

            <div className="w-full p-3 pb-2 flex items-center gap-3">
              <SecondaryButton
                fullWidth={false}
                className="flex-1"
                onClick={() => navigate(ROUTE_PATH.REGISTER_STEP3)}
              >
                이전
              </SecondaryButton>
              <PrimaryButton
                fullWidth={false}
                className="flex-1"
                onClick={handleNext}
                disabled={!isValid}
              >
                다음
              </PrimaryButton>
            </div>
          </div>

          <BottomNav />
        </div>
      </div>
    </div>
  );
}
