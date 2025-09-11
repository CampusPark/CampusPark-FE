import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/layout/BottomNav";
import ProgressBar from "@/components/ProgressBar";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { ROUTE_PATH } from "@/routes/paths";

export default function SpacesPageStep2() {
  const navigate = useNavigate();

  // 간단 업로드 상태 (4칸)
  const [files, setFiles] = useState<(File | null)[]>([null, null, null, null]);
  const inputs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const onPick = (idx: number) => inputs[idx].current?.click();
  const onChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFiles((prev) => {
      const next = [...prev];
      next[idx] = f;
      return next;
    });
  };
  return (
    <div className="min-h-svh w-full bg-zinc-50">
      <div className="relative mx-auto min-h-svh w-full max-w-[420px] sm:max-w-[480px] md:max-w-[640px] flex flex-col items-stretch overflow-hidden">
        <div className="flex-1 bg-neutral-50 flex flex-col items-center gap-2">
          <Header title="내 공간 등록하기" />
          <div className="w-full px-3 py-1 flex flex-col justify-center items-start gap-3 overflow-hidden">
            {/* 진행바 */}
            <ProgressBar currentStep={2} />

            {/* 안내 문구 */}
            <div className="w-full p-1 inline-flex justify-start items-center gap-2.5 overflow-hidden">
              <div className="flex justify-start items-center gap-2.5 overflow-hidden">
                <div className="justify-center text-black text-base font-bold font-['Pretendard'] leading-7">
                  주차 공간 사진을 업로드 해주세요
                </div>
              </div>
            </div>

            {/* 업로드 그리드 */}
            <div className="w-full px-3">
              <div className="grid grid-cols-2 gap-3">
                {files.map((f, idx) => (
                  <div
                    key={idx}
                    className="h-32 bg-neutral-200 rounded-lg outline outline-1 outline-neutral-400 flex flex-col items-center justify-center gap-2"
                  >
                    {f ? (
                      <div className="flex flex-col items-center gap-1">
                        <div className="text-neutral-700 text-[10px] font-semibold">
                          {f.name}
                        </div>
                        <button
                          type="button"
                          onClick={() => onPick(idx)}
                          className="px-2 py-1 text-[11px] rounded border border-neutral-400 bg-white"
                        >
                          다른 사진 선택
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onPick(idx)}
                        className="flex flex-col items-center justify-center gap-1"
                      >
                        <img
                          src="/assets/image.svg"
                          alt="image icon"
                          className="w-6 h-6"
                        />
                        <span className="text-neutral-700 text-[10px] font-semibold">
                          사진 추가
                        </span>
                      </button>
                    )}
                    <input
                      ref={inputs[idx]}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onChange(idx, e)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 버튼 */}
            {/* <div className="flex gap-3 w-full px-3">
              <PrimaryButton
                onClick={() => navigate(ROUTE_PATH.REGISTER_STEP1)}
                className="flex-1"
              >
                이전
              </PrimaryButton>
              <PrimaryButton
                onClick={() => navigate(ROUTE_PATH.REGISTER_STEP3)}
                className="flex-1"
              >
                다음
              </PrimaryButton>
            </div>
          </div> */}

            <div className="w-full px-3 pb-2 flex items-center gap-3">
              <SecondaryButton
                fullWidth={false}
                className="flex-1"
                onClick={() => navigate(ROUTE_PATH.REGISTER_STEP1)}
              >
                이전
              </SecondaryButton>

              <PrimaryButton
                fullWidth={false}
                className="flex-1"
                onClick={() => navigate(ROUTE_PATH.REGISTER_STEP3)}
              >
                다음
              </PrimaryButton>
            </div>

            {/* 하단 네비게이션 */}
            <BottomNav />
          </div>
        </div>
      </div>
    </div>
  );
}
