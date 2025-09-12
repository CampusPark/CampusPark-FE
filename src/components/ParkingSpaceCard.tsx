import React from "react";

type ParkingSpaceCardProps = {
  name: string;
  location: string;
  points: number;
  remainingMinutes?: number;
  timeWindow?: string;
  /** 썸네일 URL (없으면 photos[0] 시도) */
  thumbnailUrl?: string;
  /** 사진 목록 (object URL 또는 실제 URL) */
  photos?: string[];
  /** 카드 클릭 동작 (선택) */
  onClick?: () => void;
};

export default function ParkingSpaceCard({
  name,
  location,
  points,
  remainingMinutes,
  timeWindow,
  thumbnailUrl,
  photos = [],
  onClick,
}: ParkingSpaceCardProps) {
  const [imgError, setImgError] = React.useState(false);

  const fallbackThumb = React.useMemo(
    () => thumbnailUrl || photos[0] || "",
    [thumbnailUrl, photos]
  );
  const showThumb = !!fallbackThumb && !imgError;
  const photoCount = photos.length;
  const formattedPoints = `${(Number.isFinite(points) ? points : 0).toLocaleString("ko-KR")}P`;

  const cardClass = [
    "w-full p-3 bg-white rounded-lg flex items-center gap-3",
    onClick
      ? "cursor-pointer hover:bg-neutral-50 active:opacity-95 transition-colors"
      : "",
  ].join(" ");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={cardClass}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`${name} 카드`}
    >
      {/* 썸네일: 고정 크기 + 가운데 정렬 */}
      <div className="relative w-24 h-28 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
        {showThumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fallbackThumb}
            alt={`${name} thumbnail`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {/* 기본 플레이스홀더 아이콘 */}
            {/* 필요하면 /assets/image.svg로 교체 */}
            <img
              src="/assets/image.svg"
              alt="이미지 없음"
              className="w-6 h-6 opacity-60"
            />
          </div>
        )}

        {/* 사진 개수 배지 (2장 이상일 때만) */}
        {photoCount > 1 && (
          <div className="absolute bottom-1 right-1 px-1.5 h-5 rounded-full bg-black/60 backdrop-blur text-white text-[10px] font-semibold flex items-center">
            {photoCount}장
          </div>
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
