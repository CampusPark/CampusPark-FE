import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSpotDetail, type SpotDetailDTO } from "@/api/spots"; // 아래 4) 참고
import BottomNav from "@/components/layout/BottomNav";
//import { ROUTE_PATH } from "@/routes/paths";

/** 하단바 높이(스페이서용) */
const NAV_HEIGHT = 70;

export default function SpotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [data, setData] = useState<SpotDetailDTO | null>(null);
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const fb = { lat: 35.8889, lng: 128.6109 };
    if (!navigator.geolocation) return setOrigin(fb);
    navigator.geolocation.getCurrentPosition(
      (p) => setOrigin({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setOrigin(fb),
      { enableHighAccuracy: true, maximumAge: 10_000 }
    );
  }, []);

  useEffect(() => {
    if (!id) {
      setErr("잘못된 경로입니다.");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchSpotDetail(id)
      .then((d: SpotDetailDTO) => setData(d))
      .catch(() => setErr("상세 정보를 불러오지 못했어요."))
      .finally((): void => setLoading(false));
  }, [id]);

  const distance = useMemo(() => {
    if (!data || !origin) return null;
    const R = 6371000;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(data.latitude - origin.lat);
    const dLng = toRad(data.longitude - origin.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(origin.lat)) *
        Math.cos(toRad(data.latitude)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }, [data, origin]);

  const fmtDist =
    distance == null
      ? ""
      : distance < 1000
        ? `${distance}m`
        : `${(distance / 1000).toFixed(1)}km`;

  if (loading) {
    return (
      <div className="mx-auto min-h-dvh w-full max-w-[720px] bg-white p-4">
        로딩 중…
      </div>
    );
  }
  if (err || !data) {
    return (
      <div className="mx-auto min-h-dvh w-full max-w-[720px] bg-white p-4">
        {err ?? "상세 정보를 불러오지 못했어요."}
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[720px] bg-white px-4 pb-[calc(env(safe-area-inset-bottom,0)+70px)]">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 -mx-4 mb-3 flex items-center gap-2 bg-white/90 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={() => nav(-1)}
          aria-label="뒤로"
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-zinc-100"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-extrabold">{data.name}</h1>
      </header>

      {/* 히어로 이미지 */}
      <div className="mb-3 h-44 w-full overflow-hidden rounded-xl bg-zinc-100">
        <img
          src={data.imageUrl ?? "https://placehold.co/720x200?text=Spot"}
          alt={data.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* 메타 정보 */}
      <div className="mb-3 flex items-center gap-4 text-sm text-zinc-800">
        {fmtDist && (
          <span className="inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-base">
              pin_drop
            </span>
            {fmtDist}
          </span>
        )}
        {data.openingTime && <span>{data.openingTime}</span>}
      </div>

      {/* 가격/주소 */}
      <section className="mb-4">
        <div className="mb-1 text-2xl font-bold text-blue-600">
          {data.pricePoint.toLocaleString()}P
          <span className="ml-1 align-middle text-sm font-semibold text-zinc-500">
            /시간
          </span>
        </div>
        <div className="text-zinc-700">{data.address}</div>
      </section>

      {/* 설명 */}
      {data.description && (
        <section className="mb-4">
          <h2 className="mb-2 text-base font-bold">설명</h2>
          <p className="whitespace-pre-wrap text-[15px] leading-6 text-zinc-800">
            {data.description}
          </p>
        </section>
      )}

      {/* 예약 버튼(목업) */}
      <button
        type="button"
        onClick={() => alert("예약 플로우 연결 예정")}
        className="mb-4 h-11 w-full rounded-2xl bg-blue-600 font-bold text-white"
      >
        예약하기
      </button>

      {/* 바텀 스페이서 */}
      <div style={{ height: NAV_HEIGHT }} />
      <BottomNav />
    </div>
  );
}
