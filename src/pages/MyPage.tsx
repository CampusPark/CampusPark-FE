// src/pages/MyPage.tsx
import React, { useRef, useEffect, useState } from "react";
import ProfileEditorModal from "@/components/ProfileEditorModal";
import type { Profile } from "@/hooks/useProfile";
import { createUser } from "@/services/user";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/layout/BottomNav";
import { ROUTE_PATH } from "@/routes/paths";
import { useProfile } from "@/hooks/useProfile";
import { ProfileCard } from "@/components/ProfileCard";
import { ProfileEmptyCard } from "@/components/ProfileEmptyCard";

export default function MyPage() {
  const nav = useNavigate();

  // ✅ 단일 출처: useProfile 훅만 사용
  const { profile, updateProfile, isComplete } = useProfile();

  // 로딩/에러(optional)
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 요청 취소용
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => {
    return () => {
      abortRef.current?.abort(); // 언마운트 시 요청 취소
    };
  }, []);

  // ✅ 모달 저장 → 서버 생성(axios) → 전역 프로필 갱신
  const handleSave = async (patch: Partial<Profile>) => {
    setSaving(true);
    setError(null);

    // username 결정: 새 닉네임 우선, 없으면 기존 닉네임, 최후의 수단은 타임스탬프
    const username =
      (patch.nickname ?? profile.nickname ?? "")?.trim() ||
      `user_${Date.now()}`;

    const payload = {
      username,
      role: "ROLE_CUSTOMER" as const,
      point: 0,
      trust_score: 36.5, // 초기 신뢰점수(백엔드 예시)
    };

    try {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const created = await createUser(payload, abortRef.current.signal);
      console.log("유저 생성 성공:", created);

      // mannerTemp 초기값 보장(최초 생성 시 100)
      const next: Partial<Profile> = {
        nickname: patch.nickname ?? profile.nickname ?? null,
        avatarUrl: patch.avatarUrl ?? profile.avatarUrl ?? null,
        mannerTemp: patch.mannerTemp ?? profile.mannerTemp ?? 100, // 👈 최초 생성 시 기본값 100
      };

      // 서버 생성 성공 후 전역 프로필 갱신
      updateProfile(next);
    } catch (err: any) {
      if (err?.name === "CanceledError" || err?.name === "AbortError") {
        console.warn("요청이 취소되었습니다.");
        return;
      }
      console.error("유저 생성 실패:", err);
      setError("유저 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
      throw err; // 👈 모달이 에러를 인식하게 전파 (중요)
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-stretch bg-neutral-50">
      {/* Header */}
      <Header title="마이 페이지" />

      <div className="w-full px-4 pt-2 flex flex-col gap-3 pb-[calc(88px+env(safe-area-inset-bottom))]">
        {/* Profile card */}
        {isComplete ? <ProfileCard profile={profile} /> : <ProfileEmptyCard />}

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
                className="h-10 px-4 rounded-3xl bg-blue-500 hover:bg-blue-400 text-white text-base font-semibold transition-colors disabled:opacity-60"
                onClick={() => nav(`${ROUTE_PATH.MYPAGE}?action=charge`)}
                disabled={saving}
              >
                충전
              </button>
              <button
                type="button"
                className="h-10 px-4 rounded-3xl bg-blue-500 hover:bg-blue-400 text-white text-base font-semibold transition-colors disabled:opacity-60"
                onClick={() => nav(`${ROUTE_PATH.MYPAGE}?action=withdraw`)}
                disabled={saving}
              >
                환급
              </button>
            </div>
          </div>
        </div>

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
          onClick={() => nav(ROUTE_PATH.MONITOR, { state: { from: "mypage" } })}
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

        {error && (
          <p className="text-sm text-red-600 px-1" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Bottom Nav */}
      <BottomNav />

      {/* ✅ 모달 저장 시 axios 호출되도록 handleSave 연결 */}
      <ProfileEditorModal
        openActions={["setup-profile", "edit-profile"]}
        value={profile}
        onSave={handleSave}
      />
    </div>
  );
}

/** 공통 카드 버튼 */
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
  leftIcon: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full bg-white rounded-xl shadow-[0_0_8.2px_0_rgba(0,0,0,0.10)] px-4 py-6
                   flex items-center gap-4 hover:bg-neutral-50 transition-colors ${className}`}
    >
      <div className="size-14 rounded-full bg-blue-100 grid place-items-center shrink-0">
        {leftIcon}
      </div>
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
