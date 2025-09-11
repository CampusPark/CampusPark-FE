import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/layout/BottomNav";
import ProgressBar from "@/components/ProgressBar";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { ROUTE_PATH } from "@/routes/paths";

// 세션 스토리지 키 (페이지 간 임시 저장용)
// 백엔드와 단계별 즉시 저장한다면 sessionStorage는 제거해도 됩니다.
const STORAGE_KEY = "register.totalSpaces";

export default function SpacesPageStep3() {
  const navigate = useNavigate();

  // 초기값: 세션스토리지 → 기본값 1
  const [totalSpaces, setTotalSpaces] = React.useState<number>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    const n = saved ? parseInt(saved, 10) : 1;
    return Number.isFinite(n) && n > 0 ? n : 1;
  });

  // 범위 보정(클램프): 프로젝트 정책에 맞춰 최소/최대 조정
  const clamp = (n: number) => {
    const MIN = 1;
    const MAX = 15;
    return Math.min(MAX, Math.max(MIN, n));
  };

  // 입력 변경: 숫자만 허용, 빈 문자열은 타이핑 중으로 간주하여 일시 허용
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();

    if (raw === "") {
      // 비움 상태(사용자가 지우는 중)를 표현하기 위해 NaN을 임시 보관
      setTotalSpaces(NaN as unknown as number);
      return;
    }

    // 정수 파싱 (소수/문자 방지)
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) return; // 숫자 외 입력 무시
    setTotalSpaces(clamp(n));
  };

  // 포커스 아웃 시 최종 보정(빈칸/범위 밖 값 보정)
  const handleBlur = () => {
    const value = Number.isFinite(totalSpaces) ? totalSpaces : 1;
    setTotalSpaces(clamp(value));
  };

  // Enter로 제출되는 것을 방지(모바일 키보드 등)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      (e.currentTarget as HTMLInputElement).blur(); // 보정 트리거
    }
  };

  // 스크롤 휠로 값이 바뀌는 기본 동작 방지(특히 데스크톱에서 실수 방지)
  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).blur();
  };

  // 다음 단계: 저장(또는 API 호출) 후 이동
  const handleNext = async () => {
    const value = clamp(Number.isFinite(totalSpaces) ? totalSpaces : 1);

    // 임시 저장(선택사항): 단계별 서버 저장이면 제거 가능
    sessionStorage.setItem(STORAGE_KEY, String(value));

    // TODO: 백엔드 연동(단계별 즉시 저장 시)
    // try {
    //   await api.register.update({ totalSpaces: value });
    //   navigate(ROUTE_PATH.REGISTER_STEP5);
    // } catch (err) {
    //   // TODO: 에러 토스트/다이얼로그 표시
    // }

    navigate(ROUTE_PATH.REGISTER_STEP5);
  };

  const isValid = Number.isFinite(totalSpaces) && (totalSpaces as number) >= 1;

  return (
    <div className="min-h-svh w-full bg-zinc-50">
      <div className="relative mx-auto min-h-svh w-full max-w-[420px] sm:max-w-[480px] md:max-w-[640px] flex flex-col items-stretch overflow-hidden">
        <div className="flex-1 bg-neutral-50 flex flex-col items-center gap-2">
          <Header title="내 공간 등록하기" />
          <div className="w-full px-3 py-1 flex flex-col justify-center items-start gap-3 overflow-hidden">
            {/* 진행바 */}
            <ProgressBar currentStep={4} />

            {/* 섹션: 주차 가능 대수 */}
            <div className="w-full p-1 flex flex-col justify-center items-start gap-1 overflow-hidden">
              <div className="inline-flex justify-start items-center gap-2.5 overflow-hidden">
                <div className="justify-center text-black text-base font-bold leading-7">
                  주차 가능 대수는 총 몇 대인가요?
                </div>
              </div>

              {/* 유효성/도움말 */}
              <p className="text-xs text-neutral-500 px-1 pb-2">
                최소 1대, 최대 15대까지 입력할 수 있어요.
              </p>

              <div className="w-full px-1 inline-flex justify-end items-center gap-2 overflow-hidden">
                {/* 숫자 입력만 사용(헬퍼 버튼 없음) */}
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

                <div className="flex justify-start items-center gap-1 overflow-hidden">
                  <span className="text-black text-sm font-semibold leading-none">
                    대
                  </span>
                </div>
              </div>
            </div>

            {/* 이전/다음 */}
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

          {/* 하단 네비게이션 */}
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
