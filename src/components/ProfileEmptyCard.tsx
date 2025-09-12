import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "@/routes/paths";

export function ProfileEmptyCard() {
  const nav = useNavigate();

  return (
    <div className="w-full bg-white rounded-xl px-3 py-5 flex flex-col sm:flex-row sm:items-center gap-3">
      {/* avatar placeholder */}
      <div className="flex items-center gap-3">
        <img
          src="/assets/mypage_profile.svg"
          alt="profile icon"
          className="w-20 h-20"
        />
      </div>

      {/* 안내 메시지 */}
      <div className="hidden sm:flex flex-col justify-center flex-1 min-w-0">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-medium text-neutral-600">
            프로필을 설정하세요
          </span>
        </div>
      </div>

      {/* 설정 버튼 */}
      <button
        type="button"
        aria-label="프로필 설정"
        className="ml-auto self-start sm:self-auto p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors"
        onClick={() => nav(`${ROUTE_PATH.MYPAGE}?action=setup-profile`)}
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
