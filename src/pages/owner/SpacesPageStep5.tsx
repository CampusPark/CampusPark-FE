import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios"; // ❌ 지금은 백엔드 미연동이므로 주석
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

  // 가격 검증(100 단위)
  const validate = (value: number | "") => {
    if (value === "") return "가격을 입력해주세요.";
    if (value < 0) return "0 이상으로 입력해주세요.";
    if (value % 100 !== 0) return "포인트는 100 단위로 입력해주세요.";
    return "";
  };

  // 로컬 히스토리에 누적 저장
  const pushLocalSubmission = (payload: any) => {
    const KEY = "parking_submissions";
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    list.push({
      id: (globalThis as any).crypto?.randomUUID?.() ?? `local-${Date.now()}`,
      createdAt: new Date().toISOString(),
      payload,
    });
    localStorage.setItem(KEY, JSON.stringify(list));
  };

  const handleSubmit = async () => {
    const err = validate(price);
    setError(err);
    if (err) return;

    // 1) 가격 저장
    localStorage.setItem("parking_price", String(price));

    // 2) 이전 스텝 값 모으기
    const userId = Number(localStorage.getItem("parking_userId") || "1"); // 필요 시 교체
    const address = localStorage.getItem("parking_address") || "";
    const name = localStorage.getItem("parking_name") || "";
    const latitude = parseFloat(localStorage.getItem("parking_lat") || "0");
    const longitude = parseFloat(localStorage.getItem("parking_lng") || "0");
    const availableStartTime =
      localStorage.getItem("parking_availableStartTime") || "";
    const availableEndTime =
      localStorage.getItem("parking_availableEndTime") || "";
    const availableCount = parseInt(
      localStorage.getItem("parking_availableCount") || "0",
      10
    );
    const finalPrice = parseInt(
      localStorage.getItem("parking_price") || "0",
      10
    );

    // ✅ 사진 & 썸네일 읽기 (Step2에서 저장)
    const photos: string[] =
      JSON.parse(localStorage.getItem("parking_photos") || "[]") ?? [];
    let thumbnailUrl =
      localStorage.getItem("parking_thumbnailUrl") ?? (photos[0] || "");

    // 필수값 간단 검증
    if (!address) {
      alert("주소 정보가 없습니다. Step1에서 주소를 입력해주세요.");
      navigate(ROUTE_PATH.REGISTER_STEP1);
      return;
    }
    if (!availableStartTime || !availableEndTime) {
      alert("대여 가능 시간이 없습니다. Step3에서 시간을 설정해주세요.");
      navigate(ROUTE_PATH.REGISTER_STEP3);
      return;
    }
    if (!availableCount || availableCount < 1) {
      alert("주차 가능 대수가 없습니다. Step4에서 대수를 입력해주세요.");
      navigate(ROUTE_PATH.REGISTER_STEP4);
      return;
    }
    if (!photos.length) {
      alert("사진이 없습니다. Step2에서 최소 1장의 사진을 업로드해주세요.");
      navigate(ROUTE_PATH.REGISTER_STEP2);
      return;
    }
    // 썸네일 누락 시 첫 번째 사진으로 보정
    if (!thumbnailUrl) thumbnailUrl = photos[0];

    // 3) API 스펙과 동일한 payload (로컬 전용) + photos/thumbnailUrl 포함
    const payload = {
      address,
      name,
      latitude,
      longitude,
      availableStartTime, // "YYYY-MM-DDTHH:00:00"
      availableEndTime, // "YYYY-MM-DDTHH:00:00"
      price: finalPrice,
      availableCount,
      photos, // object URL 배열 (해커톤 임시)
      thumbnailUrl, // 첫 번째 사진(또는 사용자가 지정한 값)
    };

    // 미리보기/테스트용 저장
    localStorage.setItem("parking_lastPayload", JSON.stringify(payload));
    pushLocalSubmission(payload);

    // 4) 백엔드 요청은 지금 주석
    // try {
    //   const res = await axios.post(`/api/parkingspaces?userId=${userId}`, payload);
    //   if (res.status === 201) {
    //     navigate(ROUTE_PATH.MONITOR);
    //     return;
    //   } else {
    //     alert("등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
    //   }
    // } catch (e) {
    //   console.error(e);
    //   alert("서버와 통신 중 오류가 발생했습니다.");
    // }

    // 5) 바로 완료 화면(테스트 페이지)로 이동
    navigate(ROUTE_PATH.MONITOR);
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

                {/* AI 추천 (임시 비활성 로직) */}
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
              disabled={price === ""} // 비어있으면 비활성화
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
