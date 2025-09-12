import React from "react";
import { useNavigate } from "react-router-dom";
import ParkingSpaceCard from "@/components/ParkingSpaceCard";
import PrimaryButton from "@/components/PrimaryButton";
import Header from "@/components/Header";
import BottomNav from "@/components/layout/BottomNav";
import { ROUTE_PATH } from "@/routes/paths";

type LocalSubmission = {
  id: string;
  createdAt: string;
  payload: {
    address: string;
    name?: string; // Step1 저장값 (없으면 카드에서 기본값 사용)
    latitude: number;
    longitude: number;
    availableStartTime: string; // "YYYY-MM-DDTHH:00:00"
    availableEndTime: string; // "YYYY-MM-DDTHH:00:00"
    price: number;
    availableCount: number;
    photos?: string[]; // Step2 저장값
    thumbnailUrl?: string; // Step2에서 선택/자동지정 값(없으면 photos[0] 사용)
  };
};

function toHHmm(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function buildCardProps(p: LocalSubmission["payload"]) {
  const name =
    p.address?.split(" ").slice(0, 2).join(" ")?.concat(" 주차공간") ||
    "내 주차공간";
  const location = p.address || "주소 미입력";
  const points = Number.isFinite(p.price) ? p.price : 0;
  const timeWindow =
    p.availableStartTime && p.availableEndTime
      ? `${toHHmm(p.availableStartTime)} ~ ${toHHmm(p.availableEndTime)}`
      : "시간 미설정";

  const photos = p.photos ?? [];
  const thumbnailUrl = p.thumbnailUrl || photos[0] || "";

  return { name, location, points, timeWindow, photos, thumbnailUrl };
}

export default function MonitorPage() {
  const navigate = useNavigate();

  const submissions = React.useMemo<LocalSubmission[]>(() => {
    try {
      const raw = localStorage.getItem("parking_submissions");
      const arr = raw ? (JSON.parse(raw) as LocalSubmission[]) : [];
      // 최신순
      return arr.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch {
      return [];
    }
  }, []);

  const hasData = submissions.length > 0;

  return (
    <div className="flex-1 flex flex-col items-stretch bg-neutral-50">
      <Header title="내 공간 등록하기" />

      <div className="w-full px-4 sm:px-4 py-1 flex flex-col justify-center items-start gap-3 overflow-hidden">
        <div className="w-full inline-flex justify-start items-center gap-2.5 overflow-hidden">
          <div className="flex justify-start items-center gap-2.5 overflow-hidden">
            <div className="text-black pt-3 text-base sm:text-lg font-semibold leading-6 sm:leading-7">
              내 주차공간 관리
            </div>
          </div>
        </div>

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

      <div className="w-full pt-2 px-3 sm:px-4 pb-4">
        <PrimaryButton onClick={() => navigate(ROUTE_PATH.REGISTER_STEP1)}>
          내 주차공간 추가하기
        </PrimaryButton>
      </div>

      <BottomNav />
    </div>
  );
}
