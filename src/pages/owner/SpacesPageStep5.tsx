import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/layout/BottomNav";
import ProgressBar from "@/components/ProgressBar";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { ROUTE_PATH } from "@/routes/paths";

export default function SpacesPageStep5() {
  const navigate = useNavigate();
  const [price, setPrice] = useState<number | "">("");

  const handleAiRecommend = () => {
    setPrice(1200); // TODO: AI 추천 로직 연동
  };

  return (
    <div className="min-h-svh w-full bg-zinc-50">
      <div className="relative mx-auto min-h-svh w-full max-w-[420px] sm:max-w-[480px] md:max-w-[640px] flex flex-col items-stretch overflow-hidden">
        <div className="flex-1 bg-neutral-50 flex flex-col items-center gap-2">
          <Header title="내 공간 등록하기" />

          <div className="w-full px-3 py-1 flex flex-col justify-center items-start gap-3 overflow-hidden">
            {/* 진행바 */}
            <ProgressBar currentStep={5} />

            {/* 안내 문구 */}
            <div className="w-full p-1 flex flex-col justify-center items-start gap-2 overflow-hidden">
              <div className="inline-flex justify-start items-center gap-2.5 overflow-hidden">
                <div className="justify-center text-black text-base font-bold leading-7">
                  시간 당 대여 가격을 입력하세요
                </div>
              </div>

              <div className="px-1 inline-flex justify-start items-center gap-1 overflow-hidden">
                <div className="w-3 h-3 relative">
                  <img
                    src="/assets/info.svg"
                    alt="info icon"
                    className="w-3 h-3"
                  />
                </div>
                <div className="justify-center text-blue-600 text-[10px] font-medium leading-3">
                  AI 추천을 사용해보세요! 적정 가격을 추천해줍니다.
                </div>
              </div>
            </div>

            {/* 가격 입력 라인 */}
            <div className="w-full p-1 flex flex-col justify-center items-start gap-2.5 overflow-hidden">
              <div className="inline-flex justify-start items-center gap-2.5 overflow-hidden">
                <div className="w-32 h-4 justify-center text-black text-xs font-medium leading-none">
                  시간당 가격(포인트)
                </div>
              </div>

              <div className="self-stretch h-8 inline-flex justify-start items-center gap-1 overflow-hidden">
                {/* 입력 박스 (회색, 포커스/스피너 제거) */}
                <input
                  type="number"
                  min={0}
                  step={100}
                  inputMode="numeric"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="0"
                  className="w-28 h-8 rounded border border-neutral-300 bg-neutral-100 text-sm text-black px-2 
                             outline-none focus:outline-none 
                             [&::-webkit-outer-spin-button]:appearance-none 
                             [&::-webkit-inner-spin-button]:appearance-none 
                             [appearance:textfield]"
                  aria-label="시간당 가격(포인트)"
                />

                <div className="h-6 flex justify-center items-end gap-2.5 overflow-hidden">
                  <span className="text-blue-600 text-2xl font-bold leading-none">
                    P
                  </span>
                </div>

                <div className="h-6 flex justify-center items-end gap-2.5 overflow-hidden">
                  <span className="text-neutral-600 text-sm font-semibold leading-none">
                    / 시간
                  </span>
                </div>

                <div className="w-32 h-8 p-1 rounded-lg flex justify-center items-center gap-2.5 overflow-hidden">
                  <button
                    type="button"
                    onClick={handleAiRecommend}
                    className="w-32 h-6 p-2.5 bg-blue-500 rounded flex justify-center items-center gap-2.5 overflow-hidden"
                  >
                    <span className="text-white text-xs font-bold leading-none">
                      AI 추천 사용하기
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 다음 버튼 */}
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
              onClick={() => navigate(ROUTE_PATH.MONITOR)}
              disabled={price === ""}
            >
              등록 완료
            </PrimaryButton>
          </div>

          {/* 하단 네비게이션 */}
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
