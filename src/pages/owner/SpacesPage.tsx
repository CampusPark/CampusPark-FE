import React from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/layout/BottomNav";

export default function SpacesPage() {
  return (
    <div className="min-h-svh w-full bg-zinc-50">
      <div className="relative mx-auto min-h-svh w-full max-w-[420px] sm:max-w-[480px] md:max-w-[640px] flex flex-col items-stretch overflow-hidden">
        <div className="flex-1 bg-neutral-50 flex flex-col items-center gap-2">
          <Header title="내 공간 등록하기" />

          {/* 진행바 */}
          <div className="w-96 bg-neutral-300 rounded-3xl inline-flex justify-start items-center gap-2.5 overflow-hidden">
            <div className="w-24 h-2 relative bg-blue-500 rounded-3xl" />
          </div>

          {/* 안내 문구 */}
          <div className="w-96 p-1 inline-flex justify-start items-center gap-2.5 overflow-hidden">
            <div className="flex justify-start items-center gap-2.5 overflow-hidden">
              <div className="justify-center text-black text-base font-bold font-['Pretendard'] leading-7">
                주차 공간 위치를 알려주세요
              </div>
            </div>
          </div>

          {/* 주소 입력 */}
          <div className="w-96 p-1 flex flex-col justify-center items-start gap-1 overflow-hidden">
            <div className="inline-flex justify-start items-center gap-2.5 overflow-hidden">
              <div className="justify-center text-black text-xs font-medium font-['Pretendard'] leading-none">
                주소
              </div>
            </div>
            <div className="self-stretch h-8 relative bg-neutral-100 rounded-lg border border-neutral-300" />
          </div>

          {/* 지도 미리보기 (더미) */}
          <div className="w-96 h-48 p-2.5 bg-neutral-200 rounded-lg flex flex-col justify-center items-center gap-2.5 overflow-hidden">
            <div className="flex flex-col justify-center items-center gap-2.5 overflow-hidden">
              <div className="w-12 h-12 relative">
                <div className="w-6 h-8 left-[11.97px] top-[3px] absolute bg-neutral-600" />
                <div className="w-1.5 h-1.5 left-[21px] top-[10.5px] absolute bg-neutral-600" />
                <div className="w-10 h-7 left-[3px] top-[18px] absolute bg-neutral-600" />
              </div>
            </div>
            <div className="inline-flex justify-center items-center gap-2.5 overflow-hidden">
              <div className="w-44 h-5 justify-center text-neutral-600 text-xs font-semibold font-['Pretendard'] leading-none">
                주소를 입력하면 위치가 표시됩니다.
              </div>
            </div>
          </div>

          {/* 다음 버튼 */}
          <div className="p-1 inline-flex justify-center items-center gap-2.5 overflow-hidden">
            <div className="w-80 h-14 px-2.5 py-2 bg-blue-500 rounded-xl flex justify-center items-center gap-2.5 overflow-hidden">
              <div className="text-justify justify-start text-white text-lg font-bold font-['Pretendard'] leading-7">
                다음
              </div>
            </div>
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <BottomNav />
      </div>
    </div>
  );
}
