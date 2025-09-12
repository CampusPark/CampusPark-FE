import { useNavigate } from "react-router-dom";

export default function OnboardingPage() {
  const nav = useNavigate();

  return (
    <div className="min-h-dvh w-full bg-zinc-50 grid place-items-center px-6">
      {/* 카드 래퍼 */}
      <div className="w-full max-w-sm text-center">
        {/* 타이틀 */}
        <h1 className="text-4xl font-extrabold text-blue-600">CampusPark</h1>
        <p className="mt-1 text-lg font-bold text-blue-500">캠퍼스팍</p>

        <p className="mt-4 text-sm font-semibold leading-5 text-neutral-400">
          대학가 주차 공유 플랫폼
          <br />빈 공간을 나누고, 주차난을 해결해요.
        </p>

        {/* 기능 리스트 */}
        <div className="mt-6 rounded-2xl border-2 border-blue-400 p-4 text-left space-y-3">
          <FeatureRow>유휴 주차 공간 공유</FeatureRow>
          <FeatureRow>AI 음성 인식 기반 검색</FeatureRow>
          <FeatureRow>쉽고 빠른 대여와 반납</FeatureRow>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => nav("/home")}
          className="mt-6 w-full rounded-xl bg-blue-500 py-3 text-white text-base font-bold leading-7 active:scale-[0.99]"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}

function FeatureRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-6 w-6 place-items-center rounded-full bg-blue-500">
        {/* 간단 아이콘 대체 */}
        <div className="h-2.5 w-2.5 rounded-full bg-white" />
      </div>
      <span className="text-blue-500 text-base font-bold leading-7">
        {children}
      </span>
    </div>
  );
}
