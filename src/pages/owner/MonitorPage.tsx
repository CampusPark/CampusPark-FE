import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ParkingSpaceCard from "@/components/ParkingSpaceCard";
import PrimaryButton from "@/components/PrimaryButton";
import Header from "@/components/Header";
import BottomNav from "@/components/layout/BottomNav";
import { ROUTE_PATH } from "@/routes/paths";

type LocalSubmission = {
  id: string;
  createdAt: string;
  payload: {
    /** 그대로 사용 */
    name?: string; // 카드 이름(없으면 기본값)
    address: string; // 위치
    price: number; // 포인트(가격)
    available_hours?: string; // "평일 09:00 - 18:00" 등, 그대로 출력
    /** 레거시 호환(과거 단계 저장값) */
    availableStartTime?: string; // "YYYY-MM-DDTHH:00:00"
    availableEndTime?: string; // "YYYY-MM-DDTHH:00:00"
    /** 기타 */
    latitude: number;
    longitude: number;
    availableCount: number;
    photos?: string[];
    thumbnailUrl?: string;
  };
};

// payload의 필드명을 그대로 카드 props로 매핑
function buildCardProps(p: LocalSubmission["payload"]) {
  return {
    name: p.name ?? "내 주차공간",
    location: p.address ?? "주소 미입력",
    points: Number.isFinite(p.price) ? p.price : 0,
    timeWindow: p.available_hours ?? "시간 미설정",
    photos: p.photos ?? [],
    thumbnailUrl: p.thumbnailUrl || p.photos?.[0] || "",
  };
}

export default function MonitorPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const isFromMyPage =
    location.state?.from === "mypage" ||
    params.get("from") === "mypage" ||
    location.pathname.startsWith(ROUTE_PATH.MYPAGE);

  const submissions = React.useMemo<LocalSubmission[]>(() => {
    try {
      const raw = localStorage.getItem("parking_submissions");
      const arr = raw ? (JSON.parse(raw) as LocalSubmission[]) : [];
      return arr.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch {
      return [];
    }
  }, []);

  const hasData = submissions.length > 0;
  const hasBottomNav = !isFromMyPage;

  return (
    // ✅ 페이지 전체가 스크롤되도록: min-h-dvh + 필요시 바닥 패딩
    <div
      className={[
        "relative mx-auto min-h-dvh w-full max-w-[720px] bg-neutral-50",
        hasBottomNav ? "pb-[92px]" : "pb-0", // BottomNav 높이만큼 여백
      ].join(" ")}
    >
      {isFromMyPage ? (
        <Header
          title="내 주차 공간 관리"
          left={
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="뒤로 가기"
              className="w-6 h-6 inline-flex items-center justify-center"
            >
              <img
                src="/assets/goBackButtonImg.svg"
                alt=""
                className="w-6 h-6"
              />
            </button>
          }
        />
      ) : (
        <Header title="내 공간 등록하기" />
      )}

      {/* ✅ overflow-hidden 제거 */}
      <div className="w-full px-4 py-1 flex flex-col items-start gap-3">
        {!isFromMyPage && (
          // ✅ 여기서도 overflow-hidden 제거
          <div className="w-full inline-flex items-center">
            <div className="pt-3 text-black text-base sm:text-lg font-semibold leading-6 sm:leading-7">
              내 주차공간 관리
            </div>
          </div>
        )}

        {/* 저장된 주차공간 목록 */}
        {hasData ? (
          <div className="w-full flex flex-col gap-3">
            {submissions.map((item) => {
              const props = buildCardProps(item.payload);
              return (
                <ParkingSpaceCard
                  key={item.id}
                  name={props.name}
                  location={props.location}
                  points={props.points}
                  timeWindow={props.timeWindow}
                  thumbnailUrl={props.thumbnailUrl}
                  photos={props.photos}
                  // onClick={() => navigate(`${ROUTE_PATH.DETAIL}/${item.id}`)}
                />
              );
            })}
          </div>
        ) : (
          <div className="w-full p-4 rounded-lg border border-dashed border-neutral-300 bg-white">
            <p className="text-sm text-neutral-700 font-medium">
              아직 등록된 주차공간이 없습니다.
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              “내 주차공간 추가하기”를 눌러 새 공간을 등록해 보세요.
            </p>
          </div>
        )}
      </div>

      {/* 제출 후 CTA 영역 (이건 고정 아님, 페이지 스크롤에 포함) */}
      <div className="w-full pt-2 px-3 sm:px-4 pb-4">
        <PrimaryButton onClick={() => navigate(ROUTE_PATH.REGISTER_STEP1)}>
          내 주차공간 추가하기
        </PrimaryButton>
      </div>

      {hasBottomNav && <BottomNav />}
    </div>
  );
}
