import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ 백엔드 연동/로그 출력을 위해 활성화
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

    // 1) 가격 저장
    localStorage.setItem("parking_price", String(price));

    // 2) 이전 스텝 값 모으기
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
    const payload: ParkingSubmissionPayload = {
      address,
      name, // address 에서 상세주소 값(빌라, 건물 이름)추출 -> 공간 카드 랜더링 용이
      latitude,
      longitude,
      availableStartTime, // "YYYY-MM-DDTHH:00:00"
      availableEndTime, // "YYYY-MM-DDTHH:00:00"
      price: finalPrice,
      availableCount,
      photos, // (해커톤 임시) object URL 배열
      thumbnailUrl, // 첫 번째 사진(또는 사용자가 지정한 값)
    };

    // 미리보기/테스트용 저장
    localStorage.setItem("parking_lastPayload", JSON.stringify(payload));
    pushLocalSubmission(payload);

    // 4) 백엔드 요청 + 응답을 콘솔에 출력
    // 실제 API PATH/BASE_URL 은 프로젝트 설정에 맞게 조정하세요.
    try {
      const userId = Number(localStorage.getItem("parking_userId") || "1");
      const url = `/api/parkingspaces?userId=${userId}`;

      console.log("🟦 [SpacesPageStep5] 요청 URL:", url);
      console.log("🟦 [SpacesPageStep5] 요청 Payload:", payload);

      const res = await axios.post(url, payload);

      console.log("🟩 [SpacesPageStep5] 응답 status:", res.status);
      console.log("🟩 [SpacesPageStep5] 응답 headers:", res.headers);
      console.log("🟩 [SpacesPageStep5] 응답 data:", res.data);

      if (res.status === 201) {
        // 성공적으로 생성됨
        navigate(ROUTE_PATH.MONITOR);
        return;
      } else {
        console.warn(
          "🟨 [SpacesPageStep5] 예상치 못한 상태 코드:",
          res.status,
          res.data
        );
        alert("등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch (e: any) {
      // axios 오류 상세 출력
      if (e.response) {
        // 서버가 4xx/5xx 응답을 반환
        console.error(
          "🔴 [SpacesPageStep5] API 실패 (response):",
          e.response.status,
          e.response.data
        );
        alert(
          `서버 오류가 발생했습니다. (status: ${e.response.status})\n잠시 후 다시 시도해주세요.`
        );
      } else if (e.request) {
        // 요청은 전송되었으나 응답이 없음
        console.error(
          "🔴 [SpacesPageStep5] API 실패 (no response):",
          e.request
        );
        alert("서버 응답이 없습니다. 네트워크를 확인해주세요.");
      } else {
        // 요청 설정 중 에러
        console.error("🔴 [SpacesPageStep5] API 설정 오류:", e.message);
        alert("요청 설정 중 오류가 발생했습니다.");
      }
      return;
    }

    // 5) (대체 경로) API 미사용일 때 테스트용 화면 이동하려면 아래 주석을 해제
    // navigate(ROUTE_PATH.MONITOR);
  };

  return (
    <div className="flex-1 flex flex-col items-stretch bg-neutral-50">
      <Header title="내 공간 등록하기" />

      <div className="w-full px-4 py-1 flex flex-col gap-3">
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
                setPrice(e.target.value === "" ? "" : Number(e.target.value))
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
          {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
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
  );
}
