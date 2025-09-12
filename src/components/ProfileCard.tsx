import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "@/routes/paths";
import type { Profile } from "@/hooks/useProfile";

export function ProfileCard({ profile }: { profile: Profile }) {
  const nav = useNavigate();

  return (
    <div className="w-full bg-white rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-3">
      {/* avatar */}
      <div className="flex items-center gap-3">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt="avatar"
            className="size-20 sm:size-24 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="size-20 sm:size-24 rounded-full bg-slate-200 shrink-0" />
        )}
      </div>

      {/* name + temp */}
      <div className="hidden sm:flex flex-col justify-center flex-1 min-w-0">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-semibold truncate">
            {profile.nickname ?? "사용자"}
          </span>
          <span className="text-sm font-semibold text-neutral-600">님</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <img
            src="/assets/mypage_temperature.svg"
            alt="temperatureIcon"
            className="w-5 h-5"
          />
          <span className="text-amber-500 text-lg font-bold leading-none">
            {profile.mannerTemp}°C
          </span>
          <span className="text-neutral-600 text-sm font-semibold leading-none">
            매너 온도
          </span>
        </div>
      </div>

      {/* settings button */}
      <button
        type="button"
        aria-label="프로필 설정"
        className="ml-auto self-start sm:self-auto p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors"
        onClick={() => nav(`${ROUTE_PATH.MYPAGE}?action=edit-profile`)}
      >
        <img
          src="/assets/mypage_edit.svg"
          alt="edit icon"
          className="w-5 h-5"
        />
      </button>
    </div>
  );
}
