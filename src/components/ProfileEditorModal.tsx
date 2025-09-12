import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Profile } from "@/hooks/useProfile";

type Props = {
  openActions: string[]; // ["setup-profile", "edit-profile"]
  value: Profile;
  onSave: (patch: Partial<Profile>) => void | Promise<void>; // 👈 비동기도 허용
};

export default function ProfileEditorModal({
  openActions,
  value,
  onSave,
}: Props) {
  const [params, setParams] = useSearchParams();
  const action = params.get("action");
  const open = action ? openActions.includes(action) : false;

  const [nickname, setNickname] = useState(value.nickname ?? "");
  const [preview, setPreview] = useState<string | null>(
    value.avatarUrl ?? null
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // 모달이 열릴 때마다 value로 폼 초기화
  useEffect(() => {
    if (open) {
      setNickname(value.nickname ?? "");
      setPreview(value.avatarUrl ?? null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // blob URL 누수 방지
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (!open) return null;

  const handleSubmit = async () => {
    setError(null);

    // 간단한 유효성 검사 (닉네임은 선택 입력이지만 공백만은 허용 X)
    const trimmed = nickname.trim();
    const patch: Partial<Profile> = {
      nickname: trimmed || null,
      avatarUrl: preview, // 현재는 미리보기 URL(파일 업로드는 부모에서 처리 권장)
      mannerTemp: value.mannerTemp ?? 100, // 최초 생성 시 100 보장
    };

    try {
      setSaving(true);
      // onSave가 동기/비동기 모두 자연스럽게 처리
      await Promise.resolve(onSave(patch));
      // 성공 시에만 닫기
      setParams({});
    } catch (e: any) {
      // 부모(onSave)에서 에러 throw 시 여기서 사용자에게 보여줌
      setError(
        e?.message || "저장 중 문제가 발생했어요. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 p-1 bg-black/40 grid place-items-center z-50">
      <div className="w-[90vw] max-w-md rounded-xl bg-white p-4">
        <h2 className="text-lg font-semibold">프로필 설정</h2>

        <div className="mt-4 flex pl-2 flex-row gap-2">
          {/* 프로필 이미지 + 버튼 */}
          <div className="relative flex items-center gap-3">
            <div className="relative size-20 rounded-full overflow-hidden bg-neutral-200 grid place-items-center">
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="preview"
                    className="absolute inset-0 w-full h-full object-cover blur-sm"
                  />
                  <div className="absolute inset-0 grid place-items-center">
                    <button
                      type="button"
                      className="h-6 px-3 rounded bg-neutral-200 text-[10px] font-semibold text-neutral-700 hover:bg-neutral-300 disabled:opacity-60"
                      onClick={() => setPreview(null)}
                      disabled={saving}
                    >
                      제거
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  className="h-6 px-2 rounded bg-white text-[10px] font-semibold text-blue-700 border border-blue-700 hover:bg-blue-200 disabled:opacity-60"
                  onClick={() => fileRef.current?.click()}
                  disabled={saving}
                >
                  사진 추가
                </button>
              )}
            </div>

            {/* 파일 입력은 숨김 */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = URL.createObjectURL(f);
                setPreview((prev) => {
                  if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
                  return url;
                });
              }}
            />
          </div>

          {/* 닉네임 입력 */}
          <div className="w-full flex flex-col justify-center p-1 gap-1">
            <label className="text-sm font-medium pl-1">닉네임</label>
            <input
              className="h-10 rounded border border-neutral-300 px-3 outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-neutral-100"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              disabled={saving}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !saving) handleSubmit();
              }}
            />
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p className="mt-3 text-sm text-red-600 px-1" role="alert">
            {error}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            className="h-9 px-4 rounded bg-neutral-200 hover:bg-neutral-300 disabled:opacity-60"
            onClick={() => setParams({})}
            disabled={saving}
          >
            취소
          </button>
          <button
            className="h-9 px-4 rounded bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-60"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
