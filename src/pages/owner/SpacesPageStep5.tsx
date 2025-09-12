// SpacesPageStep5.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/layout/BottomNav";
import ProgressBar from "@/components/ProgressBar";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { ROUTE_PATH } from "@/routes/paths";

// ✅ 서비스 불러오기
import {
  createParkingSpace,
  type CreateParkingSpacePayload,
} from "@/services/parkingspace";

const USE_BACKEND =
  (import.meta.env.VITE_USE_BACKEND ?? "false").toLowerCase() === "true";

export default function SpacesPageStep5() {
  const navigate = useNavigate();
  const [price, setPrice] = useState<number | "">("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 가격 검증(100 단위)
  const validate = (value: number | "") => {
    if (value === "") return "가격을 입력해주세요.";
    if (value < 0) return "0 이상으로 입력해주세요.";
    if (value % 100 !== 0) return "포인트는 100 단위로 입력해주세요.";
    return "";
  };

  // 로컬 히스토리에 누적 저장 (프리뷰/테스트)
  type ParkingSubmissionPayload = {
    address: string;
    name: string;
    latitude: number;
    longitude: number;
    availableStartTime: string;
    availableEndTime: string;
    price: number;
    availableCount: number;
    photos: string[];
    thumbnailUrl: string;
  };

  const pushLocalSubmission = (payload: ParkingSubmissionPayload) => {
    const KEY = "parking_submissions";
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    list.push({
      id: globalThis.crypto?.randomUUID?.() ?? `local-${Date.now()}`,
      createdAt: new Date().toISOString(),
      payload,
    });
    localStorage.setItem(KEY, JSON.stringify(list));
  };

  const handleSubmit = async () => {
    const err = validate(price);
    setError(err);
    if (err) return;

    setSubmitting(true);
    try {
      // 1) 가격 저장
      localStorage.setItem("parking_price", String(price));

      // 2) 이전 스텝 값 모으기 (로컬)
      const userId = Number(localStorage.getItem("parking_userId") || "1"); // 필요 시 실제 로그인 값으로 교체
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

      // ✅ 사진 & 썸네일(프리뷰 전용)
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
      if (!thumbnailUrl) thumbnailUrl = photos[0];

      // 3) 로컬 프리뷰용 payload 저장
      const previewPayload: ParkingSubmissionPayload = {
        address,
        name,
        latitude,
        longitude,
        availableStartTime, // "YYYY-MM-DDTHH:00:00"
        availableEndTime, // "YYYY-MM-DDTHH:00:00"
        price: finalPrice,
        availableCount,
        photos,
        thumbnailUrl,
      };
      localStorage.setItem(
        "parking_lastPayload",
        JSON.stringify(previewPayload)
      );
      pushLocalSubmission(previewPayload);

      // 4) (옵션) 백엔드 호출 — services 사용
      if (USE_BACKEND) {
        const backendBody: CreateParkingSpacePayload = {
          address,
          latitude,
          longitude,
          availableStartTime,
          availableEndTime,
          price: finalPrice,
          availableCount,
        };

        try {
          await createParkingSpace(userId, backendBody);
          // 성공 시 모니터로 이동
          navigate(ROUTE_PATH.MONITOR);
          return;
        } catch (e: any) {
          console.error(e);
          alert(
            e?.message || "등록에 실패했습니다. 잠시 후 다시 시도해주세요."
          );
          return; // 실패 시 여기서 종료(원하면 프리뷰로 진행하도록 변경 가능)
        }
      }

      // 5) 백엔드 미연동: 프리뷰 완료 화면(모니터)로 이동
      navigate(ROUTE_PATH.MONITOR);
    } finally {
      setSubmitting(false);
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
                  onBlur={() => setError(validate(price))}
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
              disabled={price === "" || submitting}
            >
              {submitting ? "등록 중..." : "등록 완료"}
            </PrimaryButton>
          </div>

          <BottomNav />
        </div>
      </div>
    </div>
  );
}
