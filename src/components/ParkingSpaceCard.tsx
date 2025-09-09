import React from "react";

type ParkingSpaceCardProps = {
  name: string;
  location: string;
  points: number;
  remainingMinutes?: number;
  timeWindow?: string;
  thumbnailUrl?: string;
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
    <div
      className="
        w-full p-3 bg-white rounded-lg
        flex items-center gap-3
      "
    >
      {/* 썸네일: 고정 크기 + 가운데 정렬 */}
      <div
        className="
          relative w-24 h-28 flex-shrink-0 overflow-hidden rounded-lg bg-amber-100
        "
      >
        {thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={`${name} thumbnail`}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* 본문 */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* 상단: 이름 + 남은시간 */}
        <div className="flex justify-between items-center gap-2">
          <div className="truncate text-black text-base font-semibold leading-6">
            {name}
          </div>

          {typeof remainingMinutes === "number" && remainingMinutes >= 0 && (
            <div className="px-2 h-5 bg-green-100 rounded-full outline outline-1 outline-green-500 flex items-center">
              <span className="text-green-600 text-[11px] font-semibold leading-none">
                {remainingMinutes}분 남음
              </span>
            </div>
          )}
        </div>

        {/* 위치 */}
        <div className="flex items-center gap-1.5 text-neutral-600 text-xs">
          <img
            src="/assets/location.svg"
            alt="location icon"
            className="w-3 h-3"
          />
          <span className="truncate">{location}</span>
        </div>

        {/* 이용시간 */}
        {timeWindow && (
          <div className="flex items-center gap-1.5 text-neutral-600 text-xs">
            <img src="/assets/time.svg" alt="time icon" className="w-3 h-3" />
            <span className="truncate">{timeWindow}</span>
          </div>
        )}

        {/* 포인트 */}
        <div className="flex items-center gap-1.5">
          <img src="/assets/point.svg" alt="point icon" className="w-3 h-3" />
          <span className="text-blue-600 text-xs font-semibold">
            {formattedPoints}
          </span>
        </div>
      </div>
    </div>
  );
}
