import { useEffect, useRef, useState } from "react";
import type { STTAdapter, STTResultHandler } from "@/ai/sttAdapters";
import { WebSpeechSTT } from "@/ai/sttAdapters";
import {
  sttFetchNearbyList,
  sttFetchDetail,
  sttReserveByText,
  getUserId,
} from "@/api/stt";
import type {
  STTListItem,
  STTDetailResponse,
  STTReserveResponse,
} from "@/api/stt";

/** ===== props ===== */
type Props = {
  open?: boolean;
  onClose?: () => void;
  onSubmitText?: (text: string) => void;
  silenceMs?: number;
  sttImpl?: STTAdapter;
};

/** 단계 FSM */
type Phase = "address" | "choice" | "time" | "idle";

/** “첫번째/둘째/3번째 …” 추출 */
function parseOrdinal(text: string): number | null {
  const t = text.replace(/\s/g, "");
  const map: Record<string, number> = {
    첫번째: 1,
    첫째: 1,
    한번째: 1,
    두번째: 2,
    둘째: 2,
    세번째: 3,
    셋째: 3,
    네번째: 4,
    넷째: 4,
    다섯번째: 5,
    다섯째: 5,
    여섯번째: 6,
    여섯째: 6,
    일곱번째: 7,
    일곱째: 7,
    여덟번째: 8,
    여덟째: 8,
    아홉번째: 9,
    아홉째: 9,
    열번째: 10,
    열째: 10,
  };
  for (const k of Object.keys(map)) if (t.includes(k)) return map[k];
  const m = t.match(/(\d+)\s*번째/);
  if (m) return Number(m[1]);
  const onlyNum = t.match(/^\d+$/);
  if (onlyNum) return Number(onlyNum[0]);
  return null;
}

/** 주소/시간 대략 분리 */
const splitAddressAndTime = (s: string) => {
  const segs = s
    .split(/[,，\n]|그리고|그다음에|그 다음에/)
    .map((v) => v.trim())
    .filter(Boolean);
  if (segs.length >= 2)
    return { addrText: segs[0], timeText: segs.slice(1).join(" ") };
  return { addrText: s.trim(), timeText: "" };
};

export default function VoiceMicSheet({
  open = true,
  onClose,
  silenceMs = 2200, // 무음 감지 조금 더 민감하게
  sttImpl,
}: Props) {
  // UI state
  type Step = "list" | "detail" | "done" | "idle";
  const [step, setStep] = useState<Step>("idle");
  const [msg, setMsg] = useState<string | null>(null);
  const [listening, setListening] = useState(false);

  // 실시간 텍스트
  const [interim, setInterim] = useState("");
  const [finalText, setFinalText] = useState("");

  // API 데이터
  const [listLoading, setListLoading] = useState(false);
  const [listData, setListData] = useState<STTListItem[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<STTDetailResponse["data"] | null>(null);
  const [reserveText, setReserveText] = useState("");
  const [reserveLoading, setReserveLoading] = useState(false);
  const [reserveResult, setReserveResult] = useState<STTReserveResponse | null>(
    null
  );

  // STT control
  const sttRef = useRef<STTAdapter | null>(null);
  const latestRef = useRef<string>(""); // 가장 최신 텍스트
  const phaseRef = useRef<Phase>("idle"); // 현재 단계
  const busyRef = useRef(false); // 단계 전환 중 재시작 방지
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** 무음 타이머 리셋 */
  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(handleSilence, silenceMs);
  };

  /** STT 시작 (phase 지정) */
  const startSTT = async (phase: Phase) => {
    if (busyRef.current) return;
    // 이미 듣는 중이면 재시작 금지
    if ((sttRef.current as any)?._listening) return;

    phaseRef.current = phase;
    const stt = sttImpl ?? new WebSpeechSTT();
    (stt as any)._listening = true; // 재진입 방지 플래그 (어댑터가 없으면 간단히 표시)
    sttRef.current = stt;

    // 초기화
    setMsg(null);
    setInterim("");
    setFinalText("");
    latestRef.current = "";

    const onResult: STTResultHandler = (finalStr, interimStr) => {
      const combined = `${finalStr ? finalStr + " " : ""}${interimStr}`.trim();
      latestRef.current = combined;
      if (finalStr) setFinalText((v) => (v ? `${v} ${finalStr}` : finalStr));
      setInterim(interimStr);
      if (combined) resetSilenceTimer();
    };

    try {
      await stt.start(onResult);
      setListening(true);
      resetSilenceTimer();
    } catch (e) {
      console.warn("STT start error:", e);
      setMsg("이 브라우저에서는 음성 인식이 지원되지 않아요.");
      setListening(false);
      (stt as any)._listening = false;
    }
  };
  const restartTimerRef = useRef<number | null>(null);
  const safeRestart = (phase: Phase, delay = 160) => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    // onend가 완전히 끝난 다음 다시 start 하도록 한 텀 둠
    restartTimerRef.current = window.setTimeout(() => {
      startSTT(phase);
    }, delay);
  };

  /** STT 정지 (onend까지 대기) */
  const stopSTT = async () => {
    setListening(false);
    try {
      await sttRef.current?.stop();
    } finally {
      (sttRef.current as any)._listening = false;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    }
  };
  const safeRestartListening = async (phase: Phase, delay = 220) => {
    await stopSTT(); // onend까지 대기
    await new Promise((r) => setTimeout(r, delay)); // 브라우저 경합 방지
    await startSTT(phase);
  };

  /** 무음 → 현재 phase에 맞는 동작 수행 */
  const handleSilence = async () => {
    if (busyRef.current) return;
    busyRef.current = true;

    const text = latestRef.current.trim();
    await stopSTT();

    try {
      switch (phaseRef.current) {
        case "address": {
          if (!text) {
            busyRef.current = false;
            return;
          }

          const { addrText, timeText } = splitAddressAndTime(text);
          if (timeText) setReserveText(timeText);

          // 사용자가 한 문장에 "세번째"를 같이 말했는지 감지
          const nthInline = parseOrdinal(text);

          console.log("[STT] auto → list, address:", addrText);
          await fetchList(addrText);

          if (nthInline != null) {
            console.log("[STT] inline ordinal detected:", nthInline);
            await fetchDetail(nthInline);
            // 바로 시간 듣기로 넘어가기
            safeRestart("time");
          } else {
            // 리스트만 보여준 뒤 '첫번째/세번째'를 받음
            safeRestart("choice");
          }
          break;
        }
        case "choice": {
          const nth = parseOrdinal(text);
          console.log("[STT] auto → detail, raw:", text, "→", nth);
          if (nth == null) {
            setMsg("몇 번째인지 다시 말씀해 주세요. 예) 첫번째, 세번째");
            safeRestart("choice");
            break;
          }
          await fetchDetail(nth);
          // 상세 뜬 다음 바로 시간 받기
          safeRestart("time");
          break;
        }
        case "time": {
          if (!text) {
            setMsg("예약 시간을 말씀해 주세요. 예) 오후 1시부터 3시까지");
            await startSTT("time");
            break;
          }
          setReserveText(text);
          console.log("[STT] auto → reserve, text:", text);
          await doReserve(text);
          phaseRef.current = "idle";
          break;
        }
        default:
          break;
      }
    } finally {
      busyRef.current = false;
    }
  };

  /** API: 리스트 */
  /** API: 리스트 */
  const fetchList = async (addressText: string) => {
    setStep("idle");
    setListLoading(true);
    setMsg(null);
    try {
      const res = await sttFetchNearbyList({
        userId: getUserId(),
        address: addressText,
      });
      console.log(
        "[API] GET /stt/list",
        { address: addressText, userId: getUserId() },
        res
      );

      const items = res.data ?? [];
      setListData(items);
      setStep("list");

      // ✅ 결과에 따라 "선택"을 받기 위한 안전 재청취
      if (items.length > 0) {
        await safeRestartListening("choice", 220);
      } else {
        setMsg("결과가 없어요. 다른 주소로 말씀해 주세요.");
        await safeRestartListening("address", 220);
      }
    } catch (e: any) {
      setMsg(e.message || "리스트를 불러오지 못했습니다.");
      await safeRestartListening("address", 350); // 에러 시 주소부터 다시
    } finally {
      setListLoading(false);
    }
  };

  /** API: 상세 */
  const fetchDetail = async (nth: number) => {
    setDetailLoading(true);
    setMsg(null);
    try {
      const res = await sttFetchDetail({
        userId: getUserId(),
        text: `${nth}번째`,
      });
      console.log(
        "[API] POST /stt/detail",
        { userId: getUserId(), text: `${nth}번째` },
        res
      );

      setDetail(res.data);
      setStep("detail");

      const firstSlot = res.data.availableTimeSlots?.[0];
      if (firstSlot && !reserveText) {
        const hhmm = (iso: string) => iso.slice(11, 16);
        setReserveText(
          `${hhmm(firstSlot.startTime)}부터 ${hhmm(firstSlot.endTime)}까지`
        );
      }

      // ✅ 시간 받기 위한 안전 재청취
      await safeRestartListening("time", 220);
    } catch (e: any) {
      setMsg(
        e.message ||
          "상세 정보를 불러오지 못했습니다. 다시 선택을 말씀해 주세요."
      );
      await safeRestartListening("choice", 300);
    } finally {
      setDetailLoading(false);
    }
  };

  /** API: 예약 */
  const doReserve = async (text?: string) => {
    if (!detail?.parkingSpace?.id) {
      setMsg("선택된 주차공간이 없습니다.");
      return;
    }
    const reqText = (text ?? reserveText).trim();
    if (!reqText) {
      setMsg("예약 시간을 말씀해 주세요.");
      return;
    }

    setReserveLoading(true);
    setMsg(null);
    try {
      const res = await sttReserveByText({
        userId: getUserId(),
        parkingSpaceId: detail.parkingSpace.id,
        text: reqText,
      });
      console.log(
        "[API] POST /stt/reserve",
        {
          userId: getUserId(),
          parkingSpaceId: detail.parkingSpace.id,
          text: reqText,
        },
        res
      );
      setReserveResult(res);
      setStep("done");
      setMsg("예약이 완료되었습니다.");
    } catch (e: any) {
      setMsg(e.message || "예약에 실패했습니다.");
    } finally {
      setReserveLoading(false);
    }
  };

  /** open → 주소 단계부터 자동 청취 시작 */
  useEffect(() => {
    if (!open) return;
    setListData([]);
    setDetail(null);
    setReserveResult(null);
    phaseRef.current = "address";
    startSTT("address");

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleCancel();
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
        <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-neutral-200" />

        <header className="flex items-center justify-between px-5 py-3">
          <h2 className="text-lg font-extrabold">음성으로 빠른 예약</h2>
          <button
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-neutral-100"
            onClick={handleCancel}
            aria-label="닫기"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>

        {/* 인식 텍스트 */}
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
              <p className="text-neutral-400">
                {phaseRef.current === "address" &&
                  (listening ? "주소를 말씀해 주세요…" : "대기 중")}
                {phaseRef.current === "choice" &&
                  (listening ? "몇 번째 공간을 선택할까요?" : "대기 중")}
                {phaseRef.current === "time" &&
                  (listening ? "예약 시간을 말씀해 주세요…" : "대기 중")}
              </p>
            )}
          </div>
          {msg && (
            <p className="mt-2 text-sm text-amber-600" role="status">
              {msg}
            </p>
          )}
        </div>

        {/* 듣는 중 애니메이션 */}
        <div className="flex flex-col items-center gap-3 px-5 pb-3">
          <MicAnimated listening={listening} />
          <p className="text-sm text-neutral-500">
            {listening ? "듣는 중…" : "일시정지됨"}
          </p>
        </div>

        {/* 리스트 */}
        {step === "list" && (
          <div className="px-5 pb-4">
            <h3 className="mb-2 text-base font-bold">근처 주차 공간</h3>
            {listLoading && (
              <p className="text-sm text-neutral-500">불러오는 중…</p>
            )}
            {!listLoading && listData.length === 0 && (
              <p className="text-sm text-neutral-500">검색 결과가 없습니다.</p>
            )}
            <ul className="max-h-64 overflow-auto divide-y divide-neutral-200 rounded-lg border">
              {listData.map((item, idx) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {item.address}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {item.availableStartTime.slice(11, 16)} ~{" "}
                      {item.availableEndTime.slice(11, 16)} ·{" "}
                      {item.price.toLocaleString()}P/h · {item.availableCount}대
                    </p>
                  </div>
                  {/* 수동 선택(백업) */}
                  <button
                    type="button"
                    className="ml-2 rounded-lg border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50"
                    onClick={async () => {
                      await fetchDetail(idx + 1);
                    }}
                  >
                    {idx + 1}번째
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-neutral-500">
              “첫번째 / 세번째 …”라고 말씀하면 자동 선택돼요.
            </p>
          </div>
        )}

        {/* 상세 + 시간 */}
        {step === "detail" && detail && (
          <div className="px-5 pb-4">
            <h3 className="mb-2 text-base font-bold">선택한 공간</h3>
            {detailLoading ? (
              <p className="text-sm text-neutral-500">불러오는 중…</p>
            ) : (
              <div className="rounded-lg border p-3">
                <p className="text-sm font-semibold">
                  {detail.parkingSpace.address}
                </p>
                <p className="mt-1 text-xs text-neutral-600">
                  가능 시간: {detail.parkingSpace.availableStartTime} ~{" "}
                  {detail.parkingSpace.availableEndTime}
                </p>

                {!!detail.availableTimeSlots?.length && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-neutral-700">
                      추천 시간대
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {detail.availableTimeSlots.map((s, i) => {
                        const hhmm = (iso: string) => iso.slice(11, 16);
                        const label = `${hhmm(s.startTime)}~${hhmm(s.endTime)}`;
                        return (
                          <button
                            key={i}
                            type="button"
                            className="rounded-full border border-neutral-300 px-3 py-1 text-xs hover:bg-neutral-50"
                            onClick={() =>
                              setReserveText(
                                `${hhmm(s.startTime)}부터 ${hhmm(s.endTime)}까지`
                              )
                            }
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-3">
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    예약 시간(자연어)
                  </label>
                  <input
                    value={reserveText}
                    onChange={(e) => setReserveText(e.target.value)}
                    placeholder="예) 오후 12시부터 오후 3시까지"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="flex-1 rounded-xl border border-neutral-300 bg-white py-2 text-sm font-semibold"
                    onClick={async () => {
                      await stopSTT();
                      setStep("list");
                      await startSTT("choice");
                    }}
                    disabled={detailLoading}
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-xl bg-blue-500 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    onClick={() => doReserve()}
                    disabled={detailLoading || !reserveText.trim()}
                  >
                    {reserveLoading ? "예약 중…" : "이 시간으로 예약"}
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-neutral-500">
                  말씀하신 후 잠시 멈추면 자동으로 예약해요.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 완료 */}
        {step === "done" && reserveResult && (
          <div className="px-5 pb-5">
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-bold text-green-700">
                예약이 완료되었습니다.
              </p>
              <p className="mt-1 text-xs text-green-700">
                예약번호 #{reserveResult.data.id} · {reserveResult.data.status}
              </p>
            </div>
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-xl border border-neutral-300 bg-white py-3 font-semibold"
                onClick={async () => {
                  setStep("list");
                  await startSTT("choice");
                }}
              >
                계속 예약
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-blue-500 py-3 font-semibold text-white"
                onClick={handleCancel}
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

/** 듣는 중 애니메이션 */
function MicAnimated({ listening }: { listening: boolean }) {
  return (
    <div className="relative grid place-items-center">
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
