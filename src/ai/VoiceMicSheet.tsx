import { useEffect, useRef, useState } from "react";
import type { STTAdapter, STTResultHandler } from "@/ai/sttAdapters";
import { WebSpeechSTT } from "@/ai/sttAdapters";

/** ===== props: 기존과 동일 ===== */
type Props = {
  open?: boolean;
  onClose?: () => void;
  onSubmitText?: (text: string) => void;
  silenceMs?: number;
  sttImpl?: STTAdapter;
};

/** ===== 백엔드 설정 ===== */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const USER_ID = 1; // 로그인 연동 전 임시

/** 공통 fetch helper */
async function api<T>(
  path: string,
  options: RequestInit & { query?: Record<string, string | number> } = {}
): Promise<T> {
  const url = new URL(path, API_BASE_URL || window.location.origin);
  if (options.query) {
    Object.entries(options.query).forEach(([k, v]) =>
      url.searchParams.set(k, String(v))
    );
  }
  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`);
  }
  return res.json() as Promise<T>;
}

/** 응답 타입 (명세 기반) */
type STTListItem = {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
  availableStartTime: string;
  availableEndTime: string;
  price: number;
  status: boolean;
  availableCount: number;
};
type STTListResponse = {
  success: boolean;
  data: STTListItem[];
  timestamp: string;
};

type STTDetailResponse = {
  success: boolean;
  data: {
    parkingSpace: {
      id: number;
      address: string;
      latitude: number;
      longitude: number;
      availableStartTime: string; // "HH:mm:ss"
      availableEndTime: string; // "HH:mm:ss"
      price: number;
      status: boolean;
      availableCount: number;
    };
    availableTimeSlots: Array<{ startTime: string; endTime: string }>;
  };
  timestamp: string;
};

type STTReserveResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
    userId: number;
    parkingSpaceId: number;
    startTime: string;
    endTime: string;
    status: string; // RESERVED
  };
  timestamp: string;
};

/** 유틸: 첫 문장(주소 후보), 두번째 문장(시간 후보) 나누기 */
const splitAddressAndTime = (t: string) => {
  const segs = t
    .split(/[,，\n]|그리고|그 다음에|그다음에/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (segs.length >= 2)
    return { addrText: segs[0], timeText: segs.slice(1).join(" ") };
  return { addrText: t, timeText: "" };
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

  // 3단계 진행 상태
  type Step = "idle" | "list" | "detail" | "reserve" | "done";
  const [step, setStep] = useState<Step>("idle");

  // list / 선택 상태
  const [listLoading, setListLoading] = useState(false);
  const [listData, setListData] = useState<STTListItem[]>([]);
  const [_, setSelectedIndex] = useState<number | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<STTDetailResponse["data"] | null>(null);

  // 예약 입력(자연어)
  const [reserveText, setReserveText] = useState("");
  const [reserveLoading, setReserveLoading] = useState(false);
  const [reserveResult, setReserveResult] = useState<STTReserveResponse | null>(
    null
  );

  const sttRef = useRef<STTAdapter | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      stopSTT();
      setMsg("입력이 없어 음성 인식을 종료했어요.");
    }, silenceMs);
  };

  const startSTT = async () => {
    const stt = sttImpl ?? new WebSpeechSTT();
    sttRef.current = stt;
    const onResult: STTResultHandler = (finalStr, interimStr) => {
      if (finalStr.trim() || interimStr.trim()) resetSilenceTimer();
      if (finalStr)
        setFinalText((prev) => (prev ? `${prev} ${finalStr}` : finalStr));
      setInterim(interimStr);
    };
    setMsg(null);
    setFinalText("");
    setInterim("");
    setListening(true);
    setStep("idle");
    setListData([]);
    setSelectedIndex(null);
    setDetail(null);
    setReserveText("");
    setReserveResult(null);

    try {
      await stt.start(onResult);
      resetSilenceTimer();
    } catch {
      setMsg("이 브라우저에서는 음성 인식이 지원되지 않아요.");
      setListening(false);
    }
  };

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

  useEffect(() => {
    if (!open) return;
    startSTT();
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

  /** Step1: 리스트 조회 */
  const fetchList = async (addressText: string) => {
    if (!API_BASE_URL) {
      setMsg("API 주소가 설정되지 않았습니다. (.env의 VITE_API_BASE_URL 확인)");
      return;
    }
    setListLoading(true);
    setMsg(null);
    try {
      // 서버 명세가 GET + Body라 비표준. 서버가 허용한다면 GET으로, 일반적으론 POST를 권장.
      // 여기서는 POST로 호출 (서버가 꼭 GET만 받으면 method를 GET으로 바꾸고 서버 설정 확인 필요)
      const res = await api<STTListResponse>("/stt/list", {
        method: "GET",
        body: JSON.stringify({ address: addressText }),
      });
      setListData(res.data ?? []);
      setStep("list");
    } catch (e: any) {
      setMsg(e.message || "리스트를 불러오지 못했습니다.");
    } finally {
      setListLoading(false);
    }
  };

  /** Step2: 상세 (몇 번째) */
  const fetchDetail = async (nth: number) => {
    setDetailLoading(true);
    setMsg(null);
    try {
      const res = await api<STTDetailResponse>("/stt/detail", {
        method: "POST",
        query: { userId: USER_ID },
        body: JSON.stringify({ text: `${nth}번째` }),
      });
      setDetail(res.data);
      setStep("detail");

      // 음성에 시간이 없었다면 추천 슬롯으로 프리필
      const firstSlot = res.data.availableTimeSlots?.[0];
      if (firstSlot && !reserveText) {
        const hhmm = (iso: string) => iso.slice(11, 16);
        setReserveText(
          `${hhmm(firstSlot.startTime)}부터 ${hhmm(firstSlot.endTime)}까지`
        );
      }
    } catch (e: any) {
      setMsg(e.message || "상세 정보를 불러오지 못했습니다.");
    } finally {
      setDetailLoading(false);
    }
  };

  /** Step3: 예약 (자연어 text) */
  const doReserve = async () => {
    if (!detail?.parkingSpace?.id) {
      setMsg("선택된 주차공간이 없습니다.");
      return;
    }
    if (!reserveText.trim()) {
      setMsg("예약 시간을 말하거나 입력해주세요.");
      return;
    }
    setReserveLoading(true);
    setMsg(null);
    try {
      const res = await api<STTReserveResponse>("/stt/reserve", {
        method: "POST",
        query: { userId: USER_ID, parkingSpaceId: detail.parkingSpace.id },
        body: JSON.stringify({ text: reserveText.trim() }),
      });
      setReserveResult(res);
      setStep("done");
      setMsg("예약이 완료되었습니다.");
    } catch (e: any) {
      setMsg(e.message || "예약에 실패했습니다.");
    } finally {
      setReserveLoading(false);
    }
  };

  /** 완료 버튼(음성 수집 종료) → 1) 리스트 → 2) 상세(선택) → 3) 예약 */
  const handleSubmit = async () => {
    await stopSTT();
    const text = (finalText || interim).trim();
    if (!text) {
      setMsg("음성 내용을 확인할 수 없어요.");
      return;
    }
    onSubmitText?.(text);

    // 1) 주소/시간 분리 시도
    const { addrText, timeText } = splitAddressAndTime(text);
    if (timeText) setReserveText(timeText);

    // 먼저 리스트 호출
    await fetchList(addrText);
  };

  /** 리스트 아이템 선택 시 */
  const handleSelectIndex = (i: number) => {
    setSelectedIndex(i);
    const nth = i + 1;
    fetchDetail(nth);
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
            <span>“경북대 북문 근처 주차장, 3번째 / 오후 1시부터 3시까지”</span>
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
              <p className="text-neutral-400">
                {listening ? "음성을 인식하는 중…" : "대기 중"}
              </p>
            )}
          </div>

          {msg && (
            <p className="mt-2 text-sm text-amber-600" role="status">
              {msg}
            </p>
          )}
        </div>

        {/* 마이크 애니메이션 + 버튼 (듣는 동안만 표시) */}
        {step === "idle" && (
          <div className="flex flex-col items-center gap-3 px-5 pb-4">
            <MicAnimated listening={listening} />
            <p className="text-sm text-neutral-500">
              {listening ? "듣는 중…" : "일시정지됨"}
            </p>
          </div>
        )}

        {/* 액션: 완료(듣기 종료 & Step1 시작) */}
        {step === "idle" && (
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
        )}

        {/* Step1: 리스트 표시 */}
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
                  <button
                    type="button"
                    className="ml-2 rounded-lg border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50"
                    onClick={() => handleSelectIndex(idx)}
                  >
                    {idx + 1}번째 선택
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Step2: 상세 표시 + 시간 텍스트 입력 */}
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
                    onClick={() => setStep("list")}
                    disabled={detailLoading}
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-xl bg-blue-500 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    onClick={doReserve}
                    disabled={detailLoading || !reserveText.trim()}
                  >
                    {reserveLoading ? "예약 중…" : "이 시간으로 예약"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step3: 완료 */}
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
                onClick={() => {
                  setStep("list"); // 계속 예약하기 원하면 리스트로
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

/** 마이크 애니메이션 (그대로) */
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
