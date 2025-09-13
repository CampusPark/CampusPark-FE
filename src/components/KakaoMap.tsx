// src/components/map/KakaoMap.tsx
import { useEffect, useRef } from "react";

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
  level?: number; // 줌레벨(낮을수록 확대)
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
};

export default function KakaoMap({
  center = { lat: 37.5665, lng: 126.978 },
  level = 5,
  markers = [],
  onMarkerClick,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapRef = useRef<any>(null);
  const kakaoMarkersRef = useRef<any[]>([]);

  // Kakao SDK 로드
  useEffect(() => {
    const load = async () => {
      if (!window.kakao || !window.kakao.maps) {
        await new Promise<void>((resolve) => {
          const script = document.querySelector<HTMLScriptElement>(
            'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
          );
          const start = () => {
            window.kakao.maps.load(resolve);
          };
          if (script) {
            script.addEventListener("load", start, { once: true });
          } else {
            // (보통 index.html에서 넣어두니 여긴 안탄다)
            const s = document.createElement("script");
            s.src =
              "https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=" +
              import.meta.env.VITE_KAKAO_JS_KEY;
            s.defer = true;
            s.addEventListener("load", start, { once: true });
            document.head.appendChild(s);
          }
        });
      }
    };
    load();
  }, []);

  // 지도 생성 & 갱신
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps || !mapRef.current) return;

    // 지도 없으면 생성
    if (!kakaoMapRef.current) {
      kakaoMapRef.current = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level,
      });
    } else {
      // center/level 반영
      kakaoMapRef.current.setCenter(
        new window.kakao.maps.LatLng(center.lat, center.lng)
      );
      kakaoMapRef.current.setLevel(level);
    }

    // 기존 마커 제거
    kakaoMarkersRef.current.forEach((m) => m.setMap(null));
    kakaoMarkersRef.current = [];

    // 새 마커 렌더링
    markers.forEach((m) => {
      const marker = new window.kakao.maps.Marker({
        map: kakaoMapRef.current,
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
  }, [center, level, markers, onMarkerClick]);

  return <div ref={mapRef} className="h-[360px] w-full rounded-lg" />;
}
