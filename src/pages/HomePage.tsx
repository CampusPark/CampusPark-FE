// src/pages/HomePage.tsx
import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/layout/BottomNav";
import KakaoMap from "@/components/KakaoMap"; // 현 컴포넌트 유지
import SearchTrigger from "@/components/SearchTrigger";
import { useNavigate, Link, generatePath } from "react-router-dom";
import { ROUTE_PATH } from "@/routes/paths";
import { fetchNearbyParkingSpaces } from "@/api/parking";
import type { NearbySpace } from "@/api/parking";
import type { MapMarker } from "@/components/KakaoMap"; // <- type-only import

const KNU_CENTER = { lat: 35.8906, lng: 128.612 }; // 경북대학교 근처

export default function HomePage() {
  const nav = useNavigate();
  const [center, setCenter] = useState(KNU_CENTER);
  const [spaces, setSpaces] = useState<NearbySpace[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 마커 변환
  const markers: MapMarker[] = useMemo(
    () =>
      spaces.map((s) => ({
        id: s.id,
        lat: s.latitude,
        lng: s.longitude,
        title: s.name,
      })),
    [spaces]
  );

  // 첫 진입 시 경북대 좌표로 주변 조회
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await fetchNearbyParkingSpaces({
          latitude: center.lat,
          longitude: center.lng,
          // radiusKm: 2, // 서버에서 지원한다면 사용
        });
        setSpaces(data.data ?? []);
      } catch (e: any) {
        console.error(e);
        setErr(e?.message ?? "주변 공간을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [center.lat, center.lng]);

  return (
    <div className="relative min-h-dvh w-full bg-zinc-50 pb-24">
      <div className="relative">
        {/* 지도 */}
        <KakaoMap
          center={center}
          level={4}
          markers={markers}
          onMarkerClick={(m) => {
            // 마커 클릭 시 상세로 이동
            const to = generatePath(ROUTE_PATH.SPOT_DETAIL, {
              id: String(m.id),
            });
            nav(to);
          }}
        />

        {/* 지도 위 오버레이(검색) */}
        <div className="pointer-events-none absolute inset-x-0 top-5 z-20 flex justify-center px-4">
          <SearchTrigger
            onClick={() => nav("/search")}
            className="pointer-events-auto w-5/6 max-w-[720px]"
          />
        </div>
      </div>

      {/* 리스트/상태 */}
      <section className="relative -mt-2 w-full rounded-t-md px-2 sm:px-3 py-3">
        <h2 className="mx-auto mt-6 mb-2 w-full max-w-[700px] px-1 text-[16px] sm:text-[18px] font-bold text-black">
          근처 주차 공간
        </h2>

        {loading && (
          <p className="mx-auto w-full max-w-[700px] px-1 text-sm text-neutral-600">
            불러오는 중…
          </p>
        )}
        {err && (
          <p className="mx-auto w-full max-w-[700px] px-1 text-sm text-red-600">
            {err}
          </p>
        )}

        {!loading && !err && (
          <div className="mx-auto w-full max-w-[700px] grid gap-3 px-1">
            {spaces.map((s) => (
              <SpotCard
                key={s.id}
                space={s}
                onFocusOnMap={() =>
                  setCenter({ lat: s.latitude, lng: s.longitude })
                }
              />
            ))}
            {spaces.length === 0 && (
              <p className="px-1 text-sm text-neutral-500">
                주변에 표시할 공간이 없습니다.
              </p>
            )}
          </div>
        )}
      </section>

      <BottomNav />
    </div>
  );
}

function SpotCard({
  space,
  onFocusOnMap,
}: {
  space: NearbySpace;
  onFocusOnMap: () => void;
}) {
  const to = generatePath(ROUTE_PATH.SPOT_DETAIL, { id: String(space.id) });

  return (
    <div
      className={[
        "flex w-full max-w-[680px] items-center gap-2 rounded-lg bg-white",
        "p-2 sm:p-3 mx-auto",
        "shadow-sm hover:shadow-md transition-shadow",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
      ].join(" ")}
    >
      {/* 썸네일 */}
      <div className="overflow-hidden rounded-lg bg-orange-50 flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24">
        {space.thumbnailUrl ? (
          <img
            src={space.thumbnailUrl}
            alt={`${space.name} 썸네일`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>

      {/* 텍스트 영역 */}
      <div className="flex min-w-0 flex-col items-start justify-center gap-1 p-1">
        <p className="truncate text-base sm:text-[18px] md:text-[20px] font-semibold leading-6 sm:leading-7 text-black">
          {space.name}
        </p>

        <div className="flex items-center gap-2 text-xs text-neutral-600">
          <span>{space.address}</span>
          {typeof space.distanceKm === "number" && (
            <span className="text-neutral-400">
              · {space.distanceKm.toFixed(1)}km
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-sm font-bold leading-5 sm:leading-6 text-blue-500">
            {space.price.toLocaleString()}P
          </span>
          <span className="text-xs font-semibold leading-5 sm:leading-6 text-neutral-600">
            / 시간
          </span>
          <span className="ml-2 text-xs font-medium text-gray-500">
            {space.availableStartTime} ~ {space.availableEndTime} ·{" "}
            {space.availableCount}대
          </span>
        </div>

        <div className="mt-1 flex gap-2">
          <button
            type="button"
            onClick={onFocusOnMap}
            className="rounded-lg border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-50"
            aria-label="지도에서 보기"
          >
            지도에서 보기
          </button>
          <Link
            to={to}
            className="rounded-lg bg-blue-500 px-2 py-1 text-xs font-semibold text-white hover:opacity-90"
            aria-label="상세 보기"
          >
            상세 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
