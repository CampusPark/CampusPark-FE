import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Profile } from "@/hooks/useProfile";

type Props = {
  openActions: string[]; // ["setup-profile", "edit-profile"]
  value: Profile;
  onSave: (patch: Partial<Profile>) => void;
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
  const fileRef = useRef<HTMLInputElement | null>(null);

  if (!open) return null;

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
                  {/* 배경 이미지 (전체 덮기) */}
                  <img
                    src={preview}
                    alt="preview"
                    className="absolute inset-0 w-full h-full object-cover blur-sm"
                  />

                  {/* 반투명 오버레이 + 중앙 버튼 컨테이너 */}
                  <div className="absolute inset-0 grid place-items-center">
                    <button
                      type="button"
                      className="h-6 px-3 rounded bg-neutral-200 text-[10px] font-semibold
                       text-neutral-700 hover:bg-neutral-300"
                      onClick={() => setPreview(null)}
                    >
                      제거
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  className="h-6 px-2 rounded bg-white text-[10px] font-semibold
                   text-blue-700 border border-blue-700 hover:bg-blue-200"
                  onClick={() => fileRef.current?.click()}
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
              className="h-10 rounded border border-neutral-300 px-3 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            className="h-9 px-4 rounded bg-neutral-200 hover:bg-neutral-300"
            onClick={() => setParams({})}
          >
            취소
          </button>
          <button
            className="h-9 px-4 rounded bg-blue-600 text-white hover:bg-blue-500"
            onClick={() => {
              onSave({
                nickname: nickname.trim() || null,
                avatarUrl: preview,
                mannerTemp: value.mannerTemp ?? 100, // 👈 초기값 100
              });
              setParams({});
            }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
