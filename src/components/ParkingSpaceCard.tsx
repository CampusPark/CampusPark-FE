import React from "react";

type ParkingSpaceCardProps = {
  name: string; // 빌라/공간 이름
  location: string; // 위치 라벨 (예: 북문 근처)
  points: number; // 포인트 (숫자, 예: 2500)
  remainingMinutes?: number; // 선택: 남은 시간(분)
  timeWindow?: string; // 선택: 이용 가능 시간대 (예: "09:00 ~ 11:00")
  thumbnailUrl?: string; // 선택: 썸네일 이미지
};

export default function ParkingSpaceCard({
  name,
  location,
  points,
  remainingMinutes,
  timeWindow,
  thumbnailUrl,
}: ParkingSpaceCardProps) {
  const formattedPoints = `${points.toLocaleString("ko-KR")}P`;

  return (
    <div className="w-95 p-2.5 bg-white rounded-lg inline-flex justify-start items-start gap-1 overflow-hidden">
      {/* 썸네일 */}
      <div className="w-24 h-28 relative overflow-hidden rounded-lg bg-amber-100">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={`${name} thumbnail`}
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>

      {/* 본문 */}
      <div className="w-60 p-1 inline-flex flex-col justify-center items-start overflow-hidden">
        {/* 상단: 이름 + 남은시간 배지(선택) */}
        <div className="pl-1 self-stretch inline-flex justify-between items-center overflow-hidden">
          <div className="max-w-[70%] truncate text-black text-base font-semibold font-['Pretendard'] leading-7">
            {name}
          </div>

          {typeof remainingMinutes === "number" && remainingMinutes >= 0 && (
            <div className="h-4 px-1 py-2 bg-green-100 rounded-xl outline outline-1 outline-offset-[-1px] outline-green-500 flex items-center overflow-hidden">
              <div className="text-green-500 text-[10px] font-semibold font-['Pretendard'] leading-none">
                {remainingMinutes}분 남음
              </div>
            </div>
          )}
        </div>

        {/* 위치 */}
        <div className="w-56 p-1 inline-flex justify-start items-center gap-1 overflow-hidden">
          {/* 아이콘 */}
          <div className="w-3 h-3 flex justify-center items-center overflow-hidden">
            <img
              src="/assets/location.svg"
              alt="location icon"
              className="w-3 h-3"
            />
          </div>
          {/* 글자 */}
          <div className="flex items-center overflow-hidden">
            <div className="text-neutral-600 text-xs font-medium font-['Pretendard'] leading-5">
              {location}
            </div>
          </div>
        </div>

        {/* 이용시간(선택) */}
        {timeWindow && (
          <div className="w-56 p-1 inline-flex justify-start items-center gap-1 overflow-hidden">
            {/* 아이콘 */}
            <div className="w-3 h-3 flex justify-center items-center overflow-hidden">
              <img src="/assets/time.svg" alt="time icon" className="w-3 h-3" />
            </div>
            {/* 글자 */}
            <div className="w-24 flex items-center overflow-hidden">
              <div className="text-neutral-600 text-xs font-medium font-['Pretendard'] leading-5">
                {timeWindow}
              </div>
            </div>
          </div>
        )}

        {/* 포인트 */}
        <div className="w-56 p-1 inline-flex justify-start items-center gap-1 overflow-hidden">
          <div className="w-3 h-3 flex justify-center items-center overflow-hidden">
            <img
              src="/assets/point.svg"
              alt="point icon"
              className="w-3 h-3"
            />{" "}
          </div>
          <div className="h-4 flex items-center overflow-hidden">
            <div className="text-blue-500 text-xs font-semibold font-['Pretendard'] leading-none">
              {formattedPoints}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
