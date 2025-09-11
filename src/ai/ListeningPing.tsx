// components/voice/ListeningPing.tsx
export default function ListeningPing({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center"
      aria-live="polite"
      aria-label="음성 인식 중"
    >
      <div className="relative">
        {/* 퍼지는 링 */}
        <span className="absolute inline-flex h-10 w-10 animate-ping rounded-full bg-blue-500/30"></span>
        {/* 마이크 아이콘 원 */}
        <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
          <span className="material-symbols-outlined text-[22px] leading-none">
            mic
          </span>
        </span>
      </div>
      <span className="ml-3 self-center rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white">
        듣는 중…
      </span>
    </div>
  );
}
