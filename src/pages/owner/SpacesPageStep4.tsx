import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/layout/BottomNav";
import ProgressBar from "@/components/ProgressBar";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { ROUTE_PATH } from "@/routes/paths";

export default function SpacesPageStep4() {
  const navigate = useNavigate();
  return (
    <div className="min-h-svh w-full bg-zinc-50">
      <div className="relative mx-auto min-h-svh w-full max-w-[420px] sm:max-w-[480px] md:max-w-[640px] flex flex-col items-stretch overflow-hidden">
        <div className="flex-1 bg-neutral-50 flex flex-col items-center gap-2">
          <Header title="내 공간 등록하기" />
          <div className="w-full px-3 py-1 flex flex-col justify-center items-start gap-3 overflow-hidden">
            {/* 진행바 */}
            <ProgressBar currentStep={4} />

            {/* 섹션: 주차 가능 대수 */}
            <div className="w-full p-1 flex flex-col justify-center items-start gap-2 overflow-hidden">
              <div className="inline-flex justify-start items-center gap-2.5 overflow-hidden">
                <div className="justify-center text-black text-base font-bold leading-7">
                  주차 가능 대수는 총 몇 대 인가요?
                </div>
              </div>

              <div className="w-full px-1 inline-flex justify-end items-center gap-1 overflow-hidden">
                <div className="w-16 h-8 relative bg-neutral-100 rounded-lg border border-neutral-300" />
                <div className="flex justify-start items-center gap-2.5 overflow-hidden">
                  <div className="w-3 justify-center text-black text-xs font-semibold leading-none">
                    대
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
                onClick={() => navigate(ROUTE_PATH.REGISTER_STEP5)}
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
