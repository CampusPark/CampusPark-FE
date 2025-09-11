export type STTResultHandler = (finalText: string, interimText: string) => void;

export interface STTAdapter {
  start: (onResult: STTResultHandler) => Promise<void>;
  stop: () => Promise<void>;
}

/* ===== Web Speech API 최소 타입 정의 (로컬) ===== */
type SpeechRecognitionConstructor = new () => SpeechRecognition;

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
    | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error?: string; // 브라우저 구현마다 상이하므로 optional
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

/** window에서 SpeechRecognition 생성자를 안전하게 얻기 */
function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  const w = window as unknown as {
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.webkitSpeechRecognition ?? w.SpeechRecognition ?? null;
}

/* ===== 브라우저 내장 Web Speech API 기반 STT ===== */
export class WebSpeechSTT implements STTAdapter {
  private recognition: SpeechRecognition | null = null;

  async start(onResult: STTResultHandler): Promise<void> {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      throw new Error("이 브라우저는 Web Speech API를 지원하지 않습니다.");
    }

    this.recognition = new Ctor();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = "ko-KR";

    this.recognition.onresult = (e: SpeechRecognitionEvent) => {
      let finalText = "";
      let interimText = "";

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        const alt = result[0]; // 첫 번째 대안을 사용
        if (result.isFinal) {
          finalText += alt.transcript;
        } else {
          interimText += alt.transcript;
        }
      }

      onResult(finalText, interimText);
    };

    this.recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      // 타입 안정성 유지하면서 로그만 출력
      // (브라우저별로 error 필드 유무가 달라 optional)
      // 필요 시 사용자 메시지 처리 추가
      // eslint-disable-next-line no-console
      console.warn("STT error:", e.error ?? "(no message)");
    };

    this.recognition.start();
  }

  async stop(): Promise<void> {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } finally {
        this.recognition = null;
      }
    }
  }
}
