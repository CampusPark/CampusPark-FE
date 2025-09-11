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
  const [error, setError] = useState("");

  const validate = (value: number | "") => {
    if (value === "") return "";
    if (value % 100 !== 0) {
      return "포인트는 100 단위로 입력해주세요.";
    }
    return "";
  };

  const handleSubmit = () => {
    const err = validate(price);
    setError(err);

    if (!err) {
      // 유효할 경우에만 이동
      navigate(ROUTE_PATH.MONITOR);
    }
  };

  return (
    <div className="min-h-svh w-full bg-zinc-50">
      <div className="relative mx-auto min-h-svh w-full max-w-[420px] sm:max-w-[480px] md:max-w-[640px] flex flex-col items-stretch overflow-hidden">
        <div className="flex-1 bg-neutral-50 flex flex-col items-center gap-2">
          <Header title="내 공간 등록하기" />

          <div className="w-full px-3 py-1 flex flex-col gap-3">
            {/* 진행바 */}
            <ProgressBar currentStep={5} />

            {/* 안내 문구 */}
            <div className="w-full p-1 flex flex-col gap-2">
              <div className="text-black text-base font-bold leading-7">
                시간 당 대여 가격을 입력하세요
              </div>
            </div>

            {/* 가격 입력 라인 */}
            <div className="w-full p-1 flex flex-col gap-2.5">
              <div className="text-xs font-semibold text-black">
                시간당 가격(포인트)
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-28 h-8 rounded border border-neutral-300 bg-neutral-100 text-sm text-black px-2 
                             outline-none 
                             [&::-webkit-outer-spin-button]:appearance-none 
                             [&::-webkit-inner-spin-button]:appearance-none 
                             [appearance:textfield]"
                  placeholder="0"
                />
                <span className="text-blue-600 text-2xl font-bold">P</span>
                <span className="text-neutral-600 text-sm font-semibold">
                  / 시간
                </span>
                {/* AI 추천 버튼: 클릭 & 커서만 */}
                <button
                  type="button"
                  onClick={() => {}}
                  className="w-32 h-8 px-2 bg-blue-500 rounded text-white text-xs font-bold 
                             inline-flex items-center justify-center cursor-pointer active:opacity-90"
                >
                  AI 추천 사용하기
                </button>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <p className="text-red-500 text-xs font-medium">{error}</p>
              )}
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="w-full p-3 pb-2 flex items-center gap-3">
            <SecondaryButton
              fullWidth={false}
              className="flex-1"
              onClick={() => navigate(ROUTE_PATH.REGISTER_STEP4)}
            >
              이전
            </SecondaryButton>

            <PrimaryButton
              fullWidth={false}
              className="flex-1"
              onClick={handleSubmit}
              disabled={price === ""}
            >
              등록 완료
            </PrimaryButton>
          </div>

          <BottomNav />
        </div>
      </div>
    </div>
  );
}
