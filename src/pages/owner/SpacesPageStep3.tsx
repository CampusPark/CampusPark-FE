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
  return (
    <div className="min-h-svh w-full bg-zinc-50">
      <div className="relative mx-auto min-h-svh w-full max-w-[420px] sm:max-w-[480px] md:max-w-[640px] flex flex-col items-stretch overflow-hidden">
        <div className="flex-1 bg-neutral-50 flex flex-col items-center gap-2">
          <Header title="내 공간 등록하기" />
          <div className="w-full px-3 py-1 flex flex-col justify-center items-start gap-3 overflow-hidden">
            {/* 진행바 */}
            <ProgressBar currentStep={3} />

            {/* 안내 문구 */}
            <div className="w-full p-1 inline-flex justify-start items-center gap-2.5 overflow-hidden">
              <div className="flex justify-start items-center gap-2.5 overflow-hidden">
                <div className="justify-center text-black text-base font-bold font-['Pretendard'] leading-7">
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

                <div className="w-full px-1 inline-flex justify-start items-center gap-2.5">
                  <div className="w-full h-8 bg-neutral-200 rounded border border-neutral-400" />

                  <div className="shrink-0 px-1 flex items-center">
                    <span className="text-black text-base font-semibold leading-none">
                      ~
                    </span>
                  </div>

                  <div className="w-full h-8 bg-neutral-200 rounded border border-neutral-400" />
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
                onClick={() => navigate(ROUTE_PATH.REGISTER_STEP4)}
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
