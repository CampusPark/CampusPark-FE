// src/components/map/KakaoMap.tsx
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export type MapMarker = {
  id: number | string;
  lat: number;
  lng: number;
  title?: string;
};

type Props = {
  center?: { lat: number; lng: number };
  level?: number; // 줌 레벨(작을수록 더 확대)
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
};

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
  import.meta.env.VITE_KAKAO_MAP_APPKEY
}&autoload=false`;

async function loadKakaoSDK(): Promise<void> {
  // 이미 로드되어 있으면 바로 load 콜백만 호출
  if (window.kakao && window.kakao.maps) {
    return new Promise((resolve) => window.kakao.maps.load(resolve));
  }

  // 스크립트 중복 삽입 방지
  const exists = Array.from(document.scripts).some((s) =>
    s.src.includes("/v2/maps/sdk.js")
  );
  if (!exists) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = KAKAO_SDK_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Kakao Maps SDK"));
      document.head.appendChild(script);
    });
  }

  // SDK가 로드되면 maps.load로 초기화
  await new Promise<void>((resolve) => window.kakao.maps.load(resolve));
}

export default function KakaoMap({
  center = { lat: 37.5665, lng: 126.978 }, // 서울 시청
  level = 5,
  markers = [],
  onMarkerClick,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const kakaoMarkersRef = useRef<any[]>([]);
  const [ready, setReady] = useState(false);

  // 1) SDK 로드 + 지도 초기화(최초 1회)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await loadKakaoSDK();
        if (cancelled || !mapRef.current) return;

        // 지도 생성
        mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level,
        });

        setReady(true);
      } catch (err) {
        console.error("[KakaoMap] SDK 로드 실패:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) center/level 변경 반영 + 마커 갱신
  useEffect(() => {
    if (!ready || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // 중심/레벨 반영
    map.setCenter(new window.kakao.maps.LatLng(center.lat, center.lng));
    map.setLevel(level);

    // 기존 마커 제거
    kakaoMarkersRef.current.forEach((m) => m.setMap(null));
    kakaoMarkersRef.current = [];

    // 새 마커 추가
    markers.forEach((m) => {
      const marker = new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(m.lat, m.lng),
        title: m.title ?? "",
      });

      if (onMarkerClick) {
        window.kakao.maps.event.addListener(marker, "click", () =>
          onMarkerClick(m)
        );
      }

      kakaoMarkersRef.current.push(marker);
    });
  }, [ready, center, level, markers, onMarkerClick]);

  return <div ref={mapRef} className="h-[600px] w-full rounded-lg" />;
}
