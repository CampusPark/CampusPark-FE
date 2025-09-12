import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/layout/BottomNav";
import { ROUTE_PATH } from "@/routes/paths";
import { useProfile } from "@/hooks/useProfile";
import { ProfileCard } from "@/components/ProfileCard";
import { ProfileEmptyCard } from "@/components/ProfileEmptyCard";
import ProfileEditorModal from "@/components/ProfileEditorModal";

export default function MyPage() {
  const nav = useNavigate();
  const { profile, updateProfile, isComplete } = useProfile();

  return (
    <div className="min-h-svh w-full bg-zinc-50">
      {/* responsive container */}
      <div className="relative mx-auto min-h-svh w-full max-w-[420px] sm:max-w-[480px] md:max-w-[640px] flex flex-col overflow-hidden">
        <div className="flex-1 bg-neutral-50 flex flex-col items-stretch gap-2">
          {/* Header */}
          <Header title="마이 페이지" />

          <div className="w-full px-3 pt-2 flex flex-col gap-3 pb-[calc(88px+env(safe-area-inset-bottom))]">
            {/* Profile card */}
            {isComplete ? (
              <ProfileCard profile={profile} />
            ) : (
              <ProfileEmptyCard />
            )}

            {/* Points card */}
            <div className="w-full bg-blue-600 rounded-xl px-4 py-7 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/mypage_coin.svg"
                  alt="point icon"
                  className="w-4 h-4"
                />
                <span className="text-white text-lg font-medium leading-tight">
                  보유 포인트
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex-1 min-w-[160px]">
                  <span className="block text-white text-4xl font-bold leading-tight">
                    45,000P
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="h-10 px-4 rounded-3xl bg-blue-500 hover:bg-blue-400 text-white text-base font-semibold transition-colors"
                    onClick={() => nav(`${ROUTE_PATH.MYPAGE}?action=charge`)}
                  >
                    충전
                  </button>
                  <button
                    type="button"
                    className="h-10 px-4 rounded-3xl bg-blue-500 hover:bg-blue-400 text-white text-base font-semibold transition-colors"
                    onClick={() => nav(`${ROUTE_PATH.MYPAGE}?action=withdraw`)}
                  >
                    환급
                  </button>
                </div>
              </div>
            </div>

            {/* Card 버튼 공통 스타일 */}
            <CardButton
              title="예약 내역"
              subtitle="나의 주차 예약 현황"
              onClick={() => nav(ROUTE_PATH.RESERVATIONS)}
              leftIcon={
                <img
                  src="/assets/mypage_calendar.svg"
                  alt="reservation icon"
                  className="w-6 h-6"
                />
              }
            />
            <CardButton
              title="내 주차공간 관리"
              subtitle="등록한 공간 관리"
              onClick={() => nav(ROUTE_PATH.MONITOR)}
              leftIcon={
                <img
                  src="/assets/mypage_car.svg"
                  alt="parking space icon"
                  className="w-7 h-7"
                />
              }
            />
            <CardButton
              title="고객센터"
              subtitle="문의사항 및 도움말"
              onClick={() => nav(`${ROUTE_PATH.MYPAGE}?tab=help`)}
              className="mb-12"
              leftIcon={
                <img
                  src="/assets/mypage_call.svg"
                  alt="help icon"
                  className="w-6 h-6"
                />
              }
            />
          </div>

          {/* Bottom Nav */}
          <BottomNav />
        </div>
      </div>
      <ProfileEditorModal
        openActions={["setup-profile", "edit-profile"]}
        value={profile}
        onSave={updateProfile}
      />
    </div>
  );
}

/** 공통 카드 버튼: 가로/세로 auto-layout + 반응형 폭 */
function CardButton({
  title,
  subtitle,
  onClick,
  leftIcon,
  className = "",
}: {
  title: string;
  subtitle: string;
  onClick: () => void;
  leftIcon: React.ReactNode; // 👈 아이콘을 외부에서 주입
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full bg-white rounded-xl shadow-[0_0_8.2px_0_rgba(0,0,0,0.10)] px-4 py-6
                   flex items-center gap-4 hover:bg-neutral-50 transition-colors ${className}`}
    >
      {/* left icon */}
      <div className="size-14 rounded-full bg-blue-100 grid place-items-center shrink-0">
        {leftIcon}
      </div>

      {/* text area */}
      <div className="flex-1 min-w-0">
        <div className="text-left gap-1 flex flex-col">
          <div className="text-black text-xl font-semibold leading-tight truncate">
            {title}
          </div>
          <div className="text-neutral-500 text-base font-medium leading-tight truncate">
            {subtitle}
          </div>
        </div>
      </div>

      {/* chevron */}
      <div className="shrink-0">
        <img
          src="/assets/mypage_shevron.svg"
          alt="chevron icon"
          className="w-3 h-3"
        />
      </div>
    </button>
  );
}
