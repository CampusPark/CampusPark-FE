import React from "react";

export default function MonitorPage() {
  return (
    <div className="w-96 h-[868px] relative bg-zinc-50 inline-flex flex-col justify-start items-start overflow-hidden">
      <div className="self-stretch h-[812px] bg-neutral-50 flex flex-col justify-start items-center gap-2">
        <div className="self-stretch h-12 p-3 bg-white border-b border-zinc-300 inline-flex justify-between items-center">
          <div className="w-6 h-6 relative" />
          <div className="text-right justify-start text-black text-lg font-semibold font-['Pretendard'] leading-7">
            내 공간 등록하기
          </div>
          <div className="w-6 h-6 relative" />
        </div>

        <div className="w-96 p-1 flex flex-col justify-center items-start gap-3 overflow-hidden">
          <div className="self-stretch inline-flex justify-start items-center gap-2.5 overflow-hidden">
            <div className="h-6 flex justify-start items-center gap-2.5 overflow-hidden">
              <div className="w-40 h-8 justify-center text-black text-lg font-semibold font-['Pretendard'] leading-7">
                내 주차공간 관리
              </div>
            </div>
          </div>

          <div className="self-stretch p-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-blue-500 flex flex-col justify-center items-start overflow-hidden">
            <div className="self-stretch h-6 p-1 inline-flex justify-start items-start overflow-hidden">
              <div className="w-48 h-4 justify-center text-black text-lg font-semibold font-['Pretendard'] leading-7">
                엘레강스빌
              </div>
            </div>

            <div className="self-stretch h-6 px-1 inline-flex justify-start items-center gap-2 overflow-hidden">
              <div className="flex justify-start items-start gap-2.5 overflow-hidden">
                <div className="justify-center text-neutral-500 text-xs font-semibold font-['Pretendard'] leading-7">
                  위치
                </div>
              </div>
              <div className="flex justify-start items-start gap-2.5 overflow-hidden">
                <div className="justify-center text-black text-xs font-semibold font-['Pretendard'] leading-7">
                  쪽문 근처
                </div>
              </div>
            </div>

            <div className="self-stretch h-6 px-1 inline-flex justify-start items-center gap-2 overflow-hidden">
              <div className="h-6 flex justify-start items-start gap-2.5 overflow-hidden">
                <div className="justify-center text-neutral-500 text-xs font-semibold font-['Pretendard'] leading-7">
                  포인트
                </div>
              </div>
              <div className="flex justify-start items-start gap-2.5 overflow-hidden">
                <div className="w-24 h-7 justify-center">
                  <span className="text-blue-500 text-xs font-semibold font-['Pretendard'] leading-7">
                    2500P{" "}
                  </span>
                  <span className="text-neutral-500 text-[8px] font-semibold font-['Pretendard'] leading-7">
                    /시간
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-1 inline-flex justify-center items-center gap-2.5 overflow-hidden">
          <div className="w-80 h-14 px-2.5 py-2 bg-blue-500 rounded-xl flex justify-center items-center gap-2.5 overflow-hidden">
            <div className="justify-start text-white text-lg font-bold font-['Pretendard'] leading-7">
              내 주차공간 추가하기
            </div>
          </div>
        </div>
      </div>

      <div className="w-96 px-8 py-2 left-0 top-[812px] absolute bg-white border-t border-neutral-200 inline-flex justify-between items-center overflow-hidden">
        <div className="w-10 inline-flex flex-col justify-center items-center overflow-hidden">
          <div className="w-6 h-6 relative overflow-hidden">
            <div className="w-4 h-4 left-[4px] top-[3.50px] absolute bg-neutral-400" />
          </div>
          <div className="self-stretch text-center justify-start text-neutral-400 text-[10px] font-bold font-['Pretendard'] leading-none">
            홈
          </div>
        </div>

        <div className="w-10 inline-flex flex-col justify-center items-center overflow-hidden">
          <div className="w-6 h-6 relative overflow-hidden">
            <div className="w-5 h-5 left-[2px] top-[2px] absolute bg-neutral-400" />
          </div>
          <div className="self-stretch text-center justify-start text-neutral-400 text-[10px] font-bold font-['Pretendard'] leading-none">
            예약 내역
          </div>
        </div>

        <div className="w-10 inline-flex flex-col justify-center items-center overflow-hidden">
          <div className="w-6 h-6 relative overflow-hidden">
            <div className="w-5 h-4 left-[2px] top-[2px] absolute bg-neutral-400" />
          </div>
          <div className="self-stretch text-center justify-start text-neutral-400 text-[10px] font-bold font-['Pretendard'] leading-none">
            출차 등록
          </div>
        </div>

        <div className="w-10 inline-flex flex-col justify-center items-center overflow-hidden">
          <div className="w-6 h-6 relative overflow-hidden">
            <div className="w-5 h-5 left-[2px] top-[2px] absolute bg-blue-500" />
          </div>
          <div className="self-stretch text-center justify-start text-blue-500 text-[10px] font-bold font-['Pretendard'] leading-none">
            공간 등록
          </div>
        </div>

        <div className="w-12 inline-flex flex-col justify-center items-center overflow-hidden">
          <div className="w-6 h-6 relative overflow-hidden">
            <div className="w-4 h-5 left-[3px] top-[2px] absolute bg-neutral-400" />
          </div>
          <div className="self-stretch text-center justify-start text-neutral-400 text-[10px] font-bold font-['Pretendard'] leading-none">
            마이 페이지
          </div>
        </div>
      </div>
    </div>
  );
}
