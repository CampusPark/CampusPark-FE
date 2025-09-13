// SpacesPageStep1.tsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/layout/BottomNav";
import ProgressBar from "@/components/ProgressBar";
import PrimaryButton from "@/components/PrimaryButton";
import ZipSearchInput from "@/components/ZipSearchInput";
import { ROUTE_PATH } from "@/routes/paths";

export default function SpacesPageStep1() {
  const navigate = useNavigate();
  const [zonecode, setZonecode] = useState("");
  const [roadAddress, setRoadAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const detailRef = useRef<HTMLInputElement>(null);

  const handleZipChange = (addr: { zonecode: string; roadAddress: string }) => {
    setZonecode(addr.zonecode);
    setRoadAddress(addr.roadAddress);
    setTimeout(() => detailRef.current?.focus(), 0);
  };

  const handleNext = () => {
    const road = roadAddress.trim();
    const detail = detailAddress.trim();

    if (!road || !detail) {
      alert("주소를 모두 입력해주세요.");
      return;
    }

    // ✅ 우편번호 제외한 주소(API 전송용)
    const apiAddress = `${road} ${detail}`.trim();

    // 🔹 로컬 저장 정책
    localStorage.setItem("parking_zonecode", zonecode); // 보관용
    localStorage.setItem("parking_addressRoad", road); // 도로명
    localStorage.setItem("parking_addressDetail", detail); // 상세
    localStorage.setItem("parking_address", apiAddress); // API용(우편번호 제외)
    localStorage.setItem("parking_name", detail); // 기본 공간명 = 상세주소

    // (위/경도는 나중에 지오코딩 붙일 때 함께 저장)
    // localStorage.setItem("parking_lat", String(lat));
    // localStorage.setItem("parking_lng", String(lng));

    navigate(ROUTE_PATH.REGISTER_STEP2);
  };

  return (
    <div className="flex-1 flex flex-col items-stretch bg-neutral-50">
      <Header title="내 공간 등록하기" />
      <div className="w-full px-4 py-1 flex flex-col justify-center items-start gap-3 pb-[calc(88px+env(safe-area-inset-bottom))]">
        <ProgressBar currentStep={1} />

        <div className="w-full p-1 inline-flex justify-start items-center gap-2">
          <div className="flex justify-start items-center gap-2.5">
            <div className="text-black text-base font-bold leading-7">
              주차 공간 위치를 알려주세요
            </div>
          </div>
        </div>

        {/* 주소 입력 */}
        <div className="w-full p-1 flex flex-col justify-center items-start gap-2">
          <div className="inline-flex justify-start items-center gap-2.5">
            <div className="text-black text-sm font-semibold leading-none">
              우편 번호를 입력해주세요
            </div>
          </div>

          <div className="w-full grid grid-cols-[140px_minmax(0,1fr)] gap-2">
            <ZipSearchInput value={zonecode} onChange={handleZipChange} />
            <input
              aria-label="기본 주소"
              readOnly
              value={roadAddress}
              placeholder="기본 주소(도로명)"
              className="w-full h-8 px-3 bg-neutral-200 rounded-lg border border-neutral-400 focus:outline-none"
            />
          </div>

          <div className="inline-flex justify-start items-center gap-2.5 pt-3">
            <div className="text-black text-sm font-semibold leading-none">
              상세 주소를 입력해주세요
            </div>
          </div>

          <input
            ref={detailRef}
            aria-label="상세 주소"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            placeholder="빌라, 건물 이름 등 상세 주소"
            required
            className="w-full h-8 px-2 rounded-lg border border-neutral-300 focus:outline-none"
          />
        </div>

        <div className="w-full sticky pb-6 bottom-[calc(72px+env(safe-area-inset-bottom))] bg-neutral-50/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-50/80 pt-2">
          <PrimaryButton onClick={handleNext}>다음</PrimaryButton>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
