import { useEffect, useRef, useState } from "react";
import type { STTAdapter, STTResultHandler } from "@/ai/sttAdapters";
import { WebSpeechSTT } from "@/ai/sttAdapters";

type Props = {
  /** 시트를 보여줄지 여부 */
  open?: boolean;
  /** 닫힐 때 호출 (BottomNav에서 micOpen=false로 바꿔줌) */
  onClose?: () => void;
  /** 최종 인식된 텍스트 전달 (선택) */
  onSubmitText?: (text: string) => void;
  /** 무음 종료 시간(ms). 기본 5000ms */
  silenceMs?: number;
  /** 커스텀 STT 주입 가능(테스트용) */
  sttImpl?: STTAdapter;
};

export default function VoiceMicSheet({
  open = true,
  onClose,
  onSubmitText,
  silenceMs = 5000,
  sttImpl,
}: Props) {
  const [interim, setInterim] = useState("");
  const [finalText, setFinalText] = useState("");
  const [listening, setListening] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const sttRef = useRef<STTAdapter | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 무음 타이머 리셋
  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      // 무음 종료
      stopSTT();
      setMsg("입력이 없어 음성 인식을 종료했어요.");
    }, silenceMs);
  };

  // STT 시작
  const startSTT = async () => {
    const stt = sttImpl ?? new WebSpeechSTT();
    sttRef.current = stt;

    const onResult: STTResultHandler = (finalStr, interimStr) => {
      if (finalStr.trim() || interimStr.trim()) {
        resetSilenceTimer(); // 말이 들리면 무음 타이머 리셋
      }
      if (finalStr) {
        // 누적형
        setFinalText((prev) => (prev ? `${prev} ${finalStr}` : finalStr));
      }
      setInterim(interimStr);
    };

    setMsg(null);
    setFinalText("");
    setInterim("");
    setListening(true);

    try {
      await stt.start(onResult);
      resetSilenceTimer();
    } catch {
      setMsg("이 브라우저에서는 음성 인식이 지원되지 않아요.");
      setListening(false);
    }
  };

  // STT 중지
  const stopSTT = async () => {
    setListening(false);
    try {
      await sttRef.current?.stop();
    } finally {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    }
  };

  // open 변경에 따라 STT 자동 시작/정리
  useEffect(() => {
    if (!open) return;

    // 열리면 자동 시작
    startSTT();

    // ESC/백드롭으로 닫기
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      stopSTT();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleCancel = async () => {
    await stopSTT();
    onClose?.();
  };

  const handleSubmit = async () => {
    await stopSTT();
    const text = (finalText || interim).trim();
    if (text) onSubmitText?.(text);
    onClose?.();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/40"
        onClick={handleCancel}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <section
        className="fixed inset-x-0 bottom-0 z-[61] mx-auto w-full max-w-[720px]
                   rounded-t-2xl bg-white shadow-[0_-6px_24px_rgba(0,0,0,0.18)]
                   pb-[calc(env(safe-area-inset-bottom,0)+16px)]"
        role="dialog"
        aria-modal="true"
        aria-label="음성 인식"
      >
        {/* Drag handle */}
        <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-neutral-200" />

        <header className="flex items-center justify-between px-5 py-3">
          <h2 className="text-lg font-extrabold">이렇게 말해보세요</h2>
          <button
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-neutral-100"
            onClick={handleCancel}
            aria-label="닫기"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>

        {/* 안내 문구/칩 */}
        <div className="px-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600">
            <span className="material-symbols-outlined text-base">
              tips_and_updates
            </span>
            <span>“경북대 북문 근처 주차장”</span>
          </div>
        </div>

        {/* 인식 텍스트 영역 */}
        <div className="px-5 py-4">
          <div className="min-h-[96px] rounded-xl border border-neutral-200 bg-neutral-50/70 p-3">
            {finalText && (
              <p className="whitespace-pre-wrap text-base leading-6 text-neutral-900">
                {finalText}
              </p>
            )}
            {interim && (
              <p className="mt-1 whitespace-pre-wrap text-base leading-6 text-neutral-500 italic">
                {interim}
              </p>
            )}
            {!finalText && !interim && (
              <p className="text-neutral-400">음성을 인식하는 중…</p>
            )}
          </div>

          {/* 상태/메시지 */}
          {msg && (
            <p className="mt-2 text-sm text-amber-600" role="status">
              {msg}
            </p>
          )}
        </div>

        {/* 마이크 애니메이션 + 버튼 */}
        <div className="flex flex-col items-center gap-3 px-5 pb-4">
          <MicAnimated listening={listening} />
          <p className="text-sm text-neutral-500">
            {listening ? "듣는 중…" : "일시정지됨"}
          </p>
        </div>

        {/* 취소 / 완료 */}
        <div className="flex items-center gap-3 px-5 pb-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 rounded-xl border border-neutral-300 bg-white py-3 font-semibold text-neutral-700"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 rounded-xl bg-blue-500 py-3 font-semibold text-white"
          >
            완료
          </button>
        </div>
      </section>
    </>
  );
}

/** 듣는 중 링 애니메이션 + 마이크 버튼 */
function MicAnimated({ listening }: { listening: boolean }) {
  return (
    <div className="relative grid place-items-center">
      {/* 파형 링 */}
      <span
        className={[
          "absolute h-24 w-24 rounded-full bg-blue-200/40",
          listening ? "animate-ping-slow" : "opacity-0",
        ].join(" ")}
      />
      <span
        className={[
          "absolute h-16 w-16 rounded-full bg-blue-200/60",
          listening ? "animate-ping-slower" : "opacity-0",
        ].join(" ")}
      />
      {/* 메인 버튼 */}
      <button
        type="button"
        className={[
          "grid h-16 w-16 place-items-center rounded-full text-white shadow-lg ring-4",
          listening
            ? "bg-blue-600 ring-blue-100"
            : "bg-neutral-400 ring-neutral-100",
        ].join(" ")}
        aria-label={listening ? "음성 인식 중" : "음성 인식 시작"}
      >
        <span className="material-symbols-outlined text-[32px] leading-none">
          mic
        </span>
      </button>
    </div>
  );
}
