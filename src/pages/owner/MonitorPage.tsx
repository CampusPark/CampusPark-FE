import React from "react";
import ParkingSpaceCard from "@/components/ParkingSpaceCard";
import PrimaryButton from "@/components/PrimaryButton";

export default function MonitorPage() {
  return (
    <div className="min-h-svh w-full bg-zinc-50">
      <div className="relative mx-auto min-h-svh w-full max-w-[420px] sm:max-w-[480px] md:max-w-[640px] flex flex-col items-stretch overflow-hidden">
        <div className="flex-1 bg-neutral-50 flex flex-col items-center gap-2">
          <div className="w-full h-12 p-3 bg-white border-b border-zinc-300 inline-flex justify-between items-center">
            <div className="w-6 h-6 relative" />
            <div className="text-right justify-start text-black text-base sm:text-lg font-semibold leading-6 sm:leading-7">
              내 공간 등록하기
            </div>
            <div className="w-6 h-6 relative" />
          </div>

          <div className="w-full px-3 sm:px-4 py-1 flex flex-col justify-center items-start gap-3 overflow-hidden">
            <div className="w-full inline-flex justify-start items-center gap-2.5 overflow-hidden">
              <div className="h-6 flex justify-start items-center gap-2.5 overflow-hidden">
                <div className="text-black text-base sm:text-lg font-semibold leading-6 sm:leading-7">
                  내 주차공간 관리
                </div>
              </div>
            </div>

            <ParkingSpaceCard
              name="엘레강스빌"
              location="북문 근처"
              points={2500}
              timeWindow="09:00 ~ 11:00"
            />
          </div>

          <div className="w-full px-3 sm:px-4 pb-2">
            <PrimaryButton onClick={() => console.log("추가하기 버튼 클릭!")}>
              내 주차공간 추가하기
            </PrimaryButton>
          </div>
        </div>

        {/* 하단 탭바: sticky로 고정 */}
        <div
          className="w-full px-6 py-2 sticky bottom-0 bg-white border-t border-neutral-200 inline-flex justify-between items-center overflow-hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="w-10 inline-flex flex-col justify-center items-center overflow-hidden">
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-4 h-4 left-[4px] top-[3.50px] absolute bg-neutral-400" />
            </div>
            <div className="self-stretch text-center justify-start text-neutral-400 text-[10px] font-bold leading-none">
              홈
            </div>
          </div>

          <div className="w-10 inline-flex flex-col justify-center items-center overflow-hidden">
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-5 h-5 left-[2px] top-[2px] absolute bg-neutral-400" />
            </div>
            <div className="self-stretch text-center justify-start text-neutral-400 text-[10px] font-bold leading-none">
              예약 내역
            </div>
          </div>

          <div className="w-10 inline-flex flex-col justify-center items-center overflow-hidden">
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-5 h-4 left-[2px] top-[2px] absolute bg-neutral-400" />
            </div>
            <div className="self-stretch text-center justify-start text-neutral-400 text-[10px] font-bold leading-none">
              출차 등록
            </div>
          </div>

          <div className="w-10 inline-flex flex-col justify-center items-center overflow-hidden">
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-5 h-5 left-[2px] top-[2px] absolute bg-blue-500" />
            </div>
            <div className="self-stretch text-center justify-start text-blue-500 text-[10px] font-bold leading-none">
              공간 등록
            </div>
          </div>

          <div className="w-12 inline-flex flex-col justify-center items-center overflow-hidden">
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-4 h-5 left-[3px] top-[2px] absolute bg-neutral-400" />
            </div>
            <div className="self-stretch text-center justify-start text-neutral-400 text-[10px] font-bold leading-none">
              마이 페이지
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
