import { useCallback, useRef, useState } from "react";
import type { STTAdapter } from "@/ai/sttAdapters";
import { WebSpeechSTT } from "@/ai/sttAdapters";
import { speakKo } from "./tts";
import { parseChoice, parseTimeRange } from "./parsers";
import {
  searchSpotsByKeyword,
  fetchTimeSlots,
  createReservation,
} from "@/api/aiQuick.mock";

type Phase =
  | "IDLE"
  | "LISTEN_DEST"
  | "FETCH_LIST"
  | "SPEAK_LIST"
  | "LISTEN_PICK"
  | "FETCH_SLOTS"
  | "SPEAK_SLOTS"
  | "LISTEN_SLOT"
  | "BOOKING"
  | "DONE"
  | "ERROR";

const SILENCE_LIMIT_MS = 5000; // 5초 무음이면 종료

export function useAiQuickBooking(stt: STTAdapter = new WebSpeechSTT()) {
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [interim, setInterim] = useState("");
  const [finalText, setFinalText] = useState("");
  const [spots, setSpots] = useState<{ id: string; name: string }[]>([]);
  const [pick, setPick] = useState<number | null>(null);
  const [slots, setSlots] = useState<
    { label: string; start: string; end: string }[]
  >([]);
  const [pickedSlot, setPickedSlot] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sttRef = useRef<STTAdapter | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const choiceRef = useRef<number | null>(null);
  const destRef = useRef<string>("");

  // STT 종료
  const stop = useCallback(() => {
    try {
      sttRef.current?.stop();
    } finally {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      setPhase("IDLE");
      setInterim("");
      setFinalText("");
    }
  }, []);

  // 한 번만 듣고 결과 리턴
  const listenOnce = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      let aggFinal = "";
      const onResult = (final: string, it: string) => {
        if (final) aggFinal += final;
        setInterim(it);
        setFinalText(aggFinal);
      };
      stt
        .start(onResult)
        .then(() => {
          // 3.5초 동안 듣고 멈춤 (데모용)
          setTimeout(() => {
            stt
              .stop()
              .then(() => {
                resolve(aggFinal.trim() || interim.trim());
              })
              .catch(reject);
          }, 3500);
        })
        .catch(reject);
    });
  }, [stt, interim]);

  // 무음 타임아웃 감싼 래퍼
  const listenWithTimeout = useCallback(
    async (ms = SILENCE_LIMIT_MS) => {
      const timeout = new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error("SILENCE_TIMEOUT")), ms)
      );
      const text = (await Promise.race([listenOnce(), timeout])) as string;
      if (!text || !text.trim()) throw new Error("SILENCE_EMPTY");
      return text.trim();
    },
    [listenOnce]
  );

  // AI 추천 예약 프로세스
  const run = useCallback(async () => {
    try {
      setError(null);
      setInterim("");
      setFinalText("");
      setSpots([]);
      setPick(null);
      setSlots([]);
      setPickedSlot(null);

      // 1) 목적지 듣기
      setPhase("LISTEN_DEST");
      await speakKo("빠른 예약을 시작할게요. 목적지를 말씀해 주세요.");
      let dest: string;
      try {
        dest = await listenWithTimeout();
      } catch {
        setPhase("ERROR");
        await speakKo("입력이 없어 음성 인식을 종료합니다.");
        return;
      }
      destRef.current = dest;

      // 2) 검색
      setPhase("FETCH_LIST");
      const candidates = await searchSpotsByKeyword(destRef.current);
      setSpots(candidates);
      if (!candidates.length) {
        setPhase("ERROR");
        await speakKo(`${destRef.current} 근처에서 주차 공간을 찾지 못했어요.`);
        return;
      }

      // 3) 후보 낭독
      setPhase("SPEAK_LIST");
      const listText = candidates
        .slice(0, 3)
        .map((s, i) => `${i + 1}번 ${s.name}`)
        .join(", ");
      await speakKo(
        `${destRef.current} 근처 주차공간 ${candidates.length}개 찾았어요. ${listText}. 번호로 선택해 주세요.`
      );

      // 4) 번호 듣기
      setPhase("LISTEN_PICK");
      let saidPick: string;
      try {
        saidPick = await listenWithTimeout();
      } catch {
        setPhase("ERROR");
        await speakKo("입력이 없어 음성 인식을 종료합니다.");
        return;
      }
      const choice = parseChoice(saidPick) ?? 1;
      choiceRef.current = choice;
      setPick(choice);

      const spot = candidates[choice - 1] ?? candidates[0];

      // 5) 시간대 조회
      setPhase("FETCH_SLOTS");
      const ts = await fetchTimeSlots(spot.id);
      setSlots(ts);
      if (!ts.length) {
        setPhase("ERROR");
        await speakKo("해당 공간의 예약 가능한 시간이 없어요.");
        return;
      }

      // 6) 시간대 낭독
      setPhase("SPEAK_SLOTS");
      await speakKo(
        `가능 시간은 ${ts.map((s) => s.label).join(", ")} 입니다. 원하시는 시간대를 말해 주세요.`
      );

      // 7) 시간대 듣기
      setPhase("LISTEN_SLOT");
      let saidTime: string;
      try {
        saidTime = await listenWithTimeout();
      } catch {
        setPhase("ERROR");
        await speakKo("입력이 없어 음성 인식을 종료합니다.");
        return;
      }
      const parsed = parseTimeRange(saidTime);
      const resolved = parsed
        ? {
            start: `${String(parsed.startHour).padStart(2, "0")}:00`,
            end: `${String((parsed.startHour + parsed.hours) % 24).padStart(2, "0")}:00`,
          }
        : { start: ts[0].start, end: ts[0].end };
      setPickedSlot(resolved);

      // 8) 예약
      setPhase("BOOKING");
      await createReservation({
        spotId: spot.id,
        start: resolved.start,
        end: resolved.end,
      });

      // 9) 완료
      setPhase("DONE");
      await speakKo(
        `예약 완료! ${resolved.start}부터 ${resolved.end}까지 ${spot.name}에 예약되었어요.`
      );
    } catch (e: unknown) {
      setPhase("ERROR");
      const errorMessage =
        typeof e === "object" && e !== null && "message" in e
          ? (e as { message?: string }).message
          : "알 수 없는 오류";
      setError(errorMessage ?? "알 수 없는 오류");
      await speakKo("죄송해요. 예약 진행 중 오류가 발생했어요.");
    }
  }, [listenWithTimeout]);

  return {
    phase,
    interim,
    finalText,
    spots,
    pick,
    slots,
    pickedSlot,
    error,
    run,
    stop,
  };
}
