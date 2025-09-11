import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/layout/BottomNav";
import ProgressBar from "@/components/ProgressBar";
import PrimaryButton from "@/components/PrimaryButton";
import ZipSearchInput from "@/components/ZipSearchInput";
import { ROUTE_PATH } from "@/routes/paths";

export default function SpacesPageStep1() {
  const navigate = useNavigate();
  const [address, setAddress] = React.useState({
    zonecode: "",
    roadAddress: "",
    detailAddress: "",
    extraAddress: "",
    jibunAddress: "",
  });
  const detailRef = React.useRef<HTMLInputElement>(null);

  const handleZipChange = (addr: { zonecode: string; roadAddress: string }) => {
    setAddress((prev) => ({
      ...prev,
      zonecode: addr.zonecode,
      roadAddress: addr.roadAddress,
    }));
    // 검색 완료 후 상세 주소로 포커스
    setTimeout(() => detailRef.current?.focus(), 0);
  };

  return (
    <div className="min-h-svh w-full bg-zinc-50">
      <div className="relative mx-auto min-h-svh w-full max-w-[420px] sm:max-w-[480px] md:max-w-[640px] flex flex-col items-stretch">
        {/* 스크롤 컨테이너 */}
        <div className="flex-1 bg-neutral-50 flex flex-col items-center gap-2 overflow-y-auto overscroll-y-contain">
          <Header title="내 공간 등록하기" />

          {/* 내용 래퍼: 하단 네비 높이만큼 패딩 추가 */}
          <div className="w-full px-3 py-1 flex flex-col justify-center items-start gap-3 pb-[calc(88px+env(safe-area-inset-bottom))]">
            {/* 진행바 */}
            <ProgressBar currentStep={1} />

            {/* 안내 문구 */}
            <div className="w-full p-1 inline-flex justify-start items-center gap-1">
              <div className="flex justify-start items-center gap-2.5">
                <div className="text-black text-base font-bold leading-7">
                  주차 공간 위치를 알려주세요
                </div>
              </div>
            </div>

            {/* 주소 입력 */}
            <div className="w-full p-1 flex flex-col justify-center items-start gap-2">
              {/* 라벨 */}
              <div className="inline-flex justify-start items-center gap-2.5">
                <div className="text-black text-sm font-semibold leading-none">
                  우편 번호를 입력해주세요
                </div>
              </div>

              {/* 우편번호 + 기본주소(한 행) */}
              <div className="w-full grid grid-cols-[140px_minmax(0,1fr)] gap-2">
                <ZipSearchInput
                  value={address.zonecode}
                  onChange={handleZipChange}
                />
                <input
                  aria-label="기본 주소"
                  readOnly
                  value={address.roadAddress}
                  placeholder="기본 주소(도로명)"
                  className="w-full h-8 px-3 bg-neutral-200 rounded-lg border border-neutral-400 focus:outline-none"
                />
              </div>

              {/* 상세 주소 라벨 */}
              <div className="inline-flex justify-start items-center gap-2.5 pt-3">
                <div className="text-black text-sm font-semibold leading-none">
                  상세 주소를 입력해주세요
                </div>
              </div>

              {/* 상세 주소(사용자 입력) */}
              <input
                ref={detailRef}
                aria-label="상세 주소"
                value={address.detailAddress}
                onChange={(e) =>
                  setAddress((prev) => ({
                    ...prev,
                    detailAddress: e.target.value,
                  }))
                }
                placeholder="상세 주소 (동·호, 층, 주차구획/진입방법 등)"
                required
                className="w-full h-8 px-2 rounded-lg border border-neutral-300 focus:outline-none"
              />
            </div>

            {/* 지도 미리보기 (더미) */}
            <div className="w-full h-48 p-2.5 bg-neutral-200 rounded-lg flex flex-col justify-center items-center gap-2.5">
              <div className="flex flex-col justify-center items-center gap-2.5">
                <img
                  src="/assets/map.svg"
                  alt="map icon"
                  className="w-12 h-12"
                />
              </div>
              <div className="inline-flex justify-center items-center gap-2.5">
                <div className="w-44 h-5 text-neutral-600 text-xs font-semibold leading-none">
                  주소를 입력하면 위치가 표시됩니다.
                </div>
              </div>
            </div>

            {/* 다음 버튼: sticky로 하단 고정 (스크롤 상단에 붙음) */}
            <div className="w-full sticky pb-6 bottom-[calc(72px+env(safe-area-inset-bottom))] bg-neutral-50/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-50/80 pt-2">
              <PrimaryButton
                onClick={() => navigate(ROUTE_PATH.REGISTER_STEP2)}
              >
                다음
              </PrimaryButton>
            </div>
          </div>

          {/* 하단 네비게이션 (고정 컴포넌트라 가정) */}
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
