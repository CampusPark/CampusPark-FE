import { useEffect, useRef } from "react";

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const KEY = import.meta.env.VITE_KAKAO_MAP_KEY;
    if (!KEY || !mapRef.current) return;

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`load failed: ${src}`));
        document.head.appendChild(s);
      });

    const init = async () => {
      await loadScript(
        `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${KEY}`
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const kakao = (window as any)?.kakao;
      if (!kakao?.maps) return;

      kakao.maps.load(() => {
        const center = new kakao.maps.LatLng(35.8889, 128.6109); // 경북대
        const map = new kakao.maps.Map(mapRef.current, {
          center,
          level: 4,
        });

        new kakao.maps.Marker({ map, position: center });
      });
    };

    init();
  }, []);

  return <div ref={mapRef} className="h-[600px] w-full rounded-t-lg" />;
}
