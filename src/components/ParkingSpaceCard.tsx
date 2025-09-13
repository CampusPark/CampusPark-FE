import React from "react";

type ParkingSpaceCardProps = {
  name: string;
  location: string;
  points: number;
  remainingMinutes?: number;
  /** 표시용: "09:00 ~ 18:00" 또는 "09:00:00 ~ 18:00:00" 등 */
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

  // 안전 보정된 포인트 숫자
  const safePoints = React.useMemo(() => {
    const n = Number(points);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }, [points]);

  // "HH:mm:ss" | "H:m" -> "HH:mm" 안전 변환 (공백/여분 콜론 허용)
  const toHM = React.useCallback((raw?: string) => {
    if (!raw) return "";
    const s = raw.trim();
    const seg = s.split(":").map((v) => v.trim());
    if (seg.length < 2) return "";
    const [h, m] = seg;
    const hh = /^\d+$/.test(h) ? String(h).padStart(2, "0") : "";
    const mm = /^\d+$/.test(m) ? String(m).padStart(2, "0") : "";
    return hh && mm ? `${hh}:${mm}` : "";
  }, []);

  // 전달된 timeWindow를 관대하게 정규화
  const readableTimeWindow = React.useMemo(() => {
    if (!timeWindow) return "";
    const raw = timeWindow.replace(/\s+/g, " ").trim(); // 공백 정규화
    if (raw.includes("~")) {
      const [sRaw = "", eRaw = ""] = raw.split("~").map((s) => s.trim());
      const s = toHM(sRaw) || sRaw;
      const e = toHM(eRaw) || eRaw;
      return s && e ? `${s} ~ ${e}` : raw;
    }
    const only = toHM(raw);
    return only || raw;
  }, [timeWindow, toHM]);

  const fallbackThumb = React.useMemo(
    () => (thumbnailUrl && thumbnailUrl.trim()) || photos[0] || "",
    [thumbnailUrl, photos]
  );

  // 썸네일 소스가 바뀌면 에러 상태 초기화
  React.useEffect(() => {
    setImgError(false);
  }, [fallbackThumb]);

  const showThumb = !!fallbackThumb && !imgError;
  const photoCount = photos.length;

  const formattedPoints = `${safePoints.toLocaleString("ko-KR")}P`;

  const cardClass = [
    "w-full p-3 bg-white rounded-lg flex items-center gap-3",
    onClick
      ? "cursor-pointer hover:bg-neutral-50 active:opacity-95 transition-colors"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
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
      data-testid="parking-space-card"
    >
      {/* 썸네일 */}
      <div className="relative w-24 h-28 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
        {showThumb ? (
          <img
            src={fallbackThumb}
            alt={`${name} thumbnail`}
            className="w-full h-full object-cover"
            loading="lazy"
            draggable={false}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/assets/image.svg"
              alt="이미지 없음"
              className="w-6 h-6 opacity-60"
              draggable={false}
            />
          </div>
        )}

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
            <div
              className="px-2 h-5 bg-green-100 rounded-full outline outline-1 outline-green-500 flex items-center"
              aria-label={`이용 가능 시간 ${remainingMinutes}분 남음`}
              title={`${remainingMinutes}분 남음`}
            >
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
            alt=""
            aria-hidden="true"
            className="w-3 h-3"
            draggable={false}
          />
          <span className="truncate">{location}</span>
        </div>

        {/* 이용시간 */}
        {readableTimeWindow && (
          <div className="flex items-center gap-1.5 text-neutral-600 text-xs">
            <img
              src="/assets/time.svg"
              alt=""
              aria-hidden="true"
              className="w-3 h-3"
              draggable={false}
            />
            <span className="truncate">{readableTimeWindow}</span>
          </div>
        )}

        {/* 포인트 */}
        <div className="flex items-center gap-1.5">
          <img
            src="/assets/point.svg"
            alt=""
            aria-hidden="true"
            className="w-3 h-3"
            draggable={false}
          />
          <span className="text-blue-600 text-xs font-semibold">
            {formattedPoints}
          </span>
        </div>
      </div>
    </div>
  );
}
