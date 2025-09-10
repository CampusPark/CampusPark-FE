import React from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/layout/BottomNav";
import ProgressBar from "@/components/ProgressBar";
import PrimaryButton from "@/components/PrimaryButton";

export default function SpacesPageStep4() {
  return (
    <div className="min-h-svh w-full bg-zinc-50">
      <div className="relative mx-auto min-h-svh w-full max-w-[420px] sm:max-w-[480px] md:max-w-[640px] flex flex-col items-stretch overflow-hidden">
        <div className="flex-1 bg-neutral-50 flex flex-col items-center gap-2">
          <Header title="내 공간 등록하기" />
          <div className="w-full px-3 py-1 flex flex-col justify-center items-start gap-3 overflow-hidden">
            {/* 진행바 */}
            <ProgressBar currentStep={4} />

            {/* 안내 문구 */}
            <div className="w-full p-1 inline-flex justify-start items-center gap-2.5 overflow-hidden">
              <div className="flex justify-start items-center gap-2.5 overflow-hidden">
                <div className="justify-center text-black text-base font-bold font-['Pretendard'] leading-7">
                  주차 공간 사진을 업로드 해주세요
                </div>
              </div>
            </div>

            {/* 다음 버튼 */}
            <div className="p-1 w-full inline-flex justify-center items-center gap-2.5 overflow-hidden">
              <PrimaryButton onClick={() => console.log("다음 버튼 클릭!")}>
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
