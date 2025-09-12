import React, { useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/layout/BottomNav";
import ProgressBar from "@/components/ProgressBar";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { ROUTE_PATH } from "@/routes/paths";

type UploadResponse = { urls: string[] };

export default function SpacesPageStep2() {
  const navigate = useNavigate();

  // 4칸 고정 업로드 슬롯
  // 상태 관리
  // 업로드 칸에 들어간 파일 상태, 업로드 진행중 여부
  const [files, setFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [isUploading, setIsUploading] = useState(false);

  // 파일 선택 & 입력 요소
  const inputs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // 썸네일 미리보기
  const previews = useMemo(
    () => files.map((f) => (f ? URL.createObjectURL(f) : null)),
    [files]
  );

  // 버튼을 클릭하면 input[type="file"] 요소를 클릭
  const onPick = (idx: number) => inputs[idx].current?.click();

  const onChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;

    // 간단 검증 (이미지 + 최대 10MB)
    if (!f.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있어요.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      alert("파일 용량은 최대 10MB까지 가능합니다.");
      return;
    }

    setFiles((prev) => {
      const next = [...prev];
      next[idx] = f;
      return next;
    });
    // 같은 파일 다시 선택 시 onChange가 안 먹을 수 있어서 값 리셋
    e.currentTarget.value = "";
  };

  const onRemove = (idx: number) => {
    setFiles((prev) => {
      const next = [...prev];
      next[idx] = null;
      return next;
    });
  };

  // 실제 업로드 함수(백엔드 엔드포인트에 맞게 수정하세요)
  // 실제 업로드 함수
  const uploadImages = async (selected: File[]): Promise<UploadResponse> => {
    const objectUrls = selected.map((f) => URL.createObjectURL(f));

    // ✅ 하나의 키로만 저장
    localStorage.setItem("parking_photos", JSON.stringify(objectUrls));

    return { urls: objectUrls };
  };

  const onNext = async () => {
    const selected = files.filter((f): f is File => !!f);
    if (selected.length === 0) {
      alert("최소 1장의 사진을 업로드해주세요.");
      return;
    }
    try {
      setIsUploading(true);
      await uploadImages(selected); // 여기서 이미 localStorage에 저장됨

      // 그냥 다음 Step으로 이동
      navigate(ROUTE_PATH.REGISTER_STEP3);
    } catch (e) {
      console.error(e);
      alert("이미지 업로드에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-svh w-full bg-zinc-50">
      <div className="relative mx-auto min-h-svh w-full max-w-[420px] sm:max-w-[480px] md:max-w-[640px] flex flex-col items-stretch overflow-hidden">
        <div className="flex-1 bg-neutral-50 flex flex-col items-center gap-2">
          <Header title="내 공간 등록하기" />
          <div className="w-full px-3 py-1 flex flex-col justify-center items-start gap-3 overflow-hidden">
            {/* 진행바 */}
            <ProgressBar currentStep={2} />

            {/* 안내 문구 */}
            <div className="w-full p-1 inline-flex justify-start items-center gap-2.5 overflow-hidden">
              <div className="flex justify-start items-center gap-2.5 overflow-hidden">
                <div className="justify-center text-black text-base font-bold leading-7">
                  주차 공간 사진을 업로드 해주세요
                </div>
              </div>
            </div>

            {/* 업로드 그리드 */}
            <div className="w-full px-3">
              <div className="grid grid-cols-2 gap-3">
                {files.map((f, idx) => (
                  <div
                    key={idx}
                    className="h-32 bg-neutral-200 rounded-lg outline outline-1 outline-neutral-400 flex flex-col items-center justify-center gap-2 relative overflow-hidden"
                  >
                    {previews[idx] ? (
                      <>
                        <img
                          src={previews[idx] as string}
                          alt={`preview-${idx}`}
                          className="absolute inset-0 w-full h-full object-cover"
                          onClick={() => onPick(idx)}
                        />
                        <div className="absolute bottom-1 left-1 right-1 flex gap-2">
                          <button
                            type="button"
                            onClick={() => onPick(idx)}
                            className="flex-1 px-2 py-1 text-[11px] rounded bg-white border border-blue-700"
                          >
                            교체
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemove(idx)}
                            className="flex-1 px-2 py-1 text-[11px] text-white rounded bg-blue-500 border border-blue-700"
                          >
                            삭제
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onPick(idx)}
                        className="flex flex-col items-center justify-center gap-1"
                      >
                        <img
                          src="/assets/image.svg"
                          alt="image icon"
                          className="w-6 h-6"
                        />
                        <span className="text-neutral-700 text-[10px] font-semibold">
                          사진 추가
                        </span>
                      </button>
                    )}
                    <input
                      ref={inputs[idx]}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onChange(idx, e)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 버튼 */}
            <div className="w-full px-3 pb-2 flex items-center gap-3">
              <SecondaryButton
                fullWidth={false}
                className="flex-1"
                onClick={() => navigate(ROUTE_PATH.REGISTER_STEP1)}
                disabled={isUploading}
              >
                이전
              </SecondaryButton>

              <PrimaryButton
                fullWidth={false}
                className="flex-1"
                onClick={onNext}
                disabled={isUploading}
              >
                {isUploading ? "업로드 중..." : "다음"}
              </PrimaryButton>
            </div>

            {/* 하단 네비게이션 */}
            <BottomNav />
          </div>
        </div>
      </div>
    </div>
  );
}
