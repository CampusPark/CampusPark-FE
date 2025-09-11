import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ROUTE_PATH } from "@/routes/paths";
import VoiceMicSheet from "@/ai/VoiceMicSheet"; // 경로는 프로젝트에 맞게

/** 하단 네비게이션: 가운데 마이크 버튼(음성인식) 포함 */
export default function BottomNav() {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const [micOpen, setMicOpen] = useState(false);

  const hidden = micOpen; // 마이크 열려있으면 바텀바 숨김

  return (
    <>
      {/* 음성 시트 */}
      <VoiceMicSheet
        open={micOpen}
        onClose={() => setMicOpen(false)}
        onSubmitText={(text) => {
          console.log("[VOICE RESULT]", text);
          setMicOpen(false);
          // TODO: 여기서 검색/AI 추천 흐름으로 연결
        }}
      />

      {/* 고정 네비게이션 바 */}
      <nav
        className={[
          "fixed bottom-0 left-0 right-0 z-[50] mx-auto w-full max-w-[720px]",
          "border-t border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75",
          "px-6 pt-2 pb-[calc(env(safe-area-inset-bottom,0)+0.5rem)]",
          "transition-transform duration-300 ease-out will-change-transform",
          hidden ? "translate-y-full opacity-0" : "translate-y-0 opacity-100",
        ].join(" ")}
        aria-label="하단 네비게이션"
      >
        <div className="relative">
          <ul className="grid grid-cols-5 justify-items-center items-end text-center">
            <li className="flex w-20 flex-col items-center justify-center">
              <NavButton
                active={pathname.startsWith(ROUTE_PATH.HOME)}
                onClick={() => nav(ROUTE_PATH.HOME)}
                label="홈"
              >
                <HomeIcon className="h-7 w-7" />
              </NavButton>
            </li>

            <li className="flex w-20 flex-col items-center justify-center">
              <NavButton
                active={pathname.startsWith(ROUTE_PATH.RESERVATIONS)}
                onClick={() => nav(ROUTE_PATH.RESERVATIONS)}
                label="예약 내역"
              >
                <ListIcon className="h-7 w-7" />
              </NavButton>
            </li>

            {/* 가운데 마이크 (FAB) */}
            <li className="flex w-20 flex-col items-center justify-center">
              <li className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2">
                <button
                  type="button"
                  onClick={() => setMicOpen(true)}
                  className="pointer-events-auto grid h-14 w-14 place-items-center rounded-full bg-blue-500 text-white shadow-lg ring-4 ring-blue-100"
                  aria-label="음성 인식 시작"
                >
                  <span className="material-symbols-outlined text-3xl leading-none">
                    mic
                  </span>
                </button>
              </li>
            </li>

            <li className="flex w-20 flex-col items-center justify-center">
              <NavButton
                active={pathname.startsWith(ROUTE_PATH.REGISTER)}
                onClick={() => nav(ROUTE_PATH.REGISTER)}
                label="공간 등록"
              >
                <PlusIcon className="h-7 w-7" />
              </NavButton>
            </li>

            <li className="flex w-20 flex-col items-center justify-center">
              <NavButton
                active={pathname.startsWith(ROUTE_PATH.MYPAGE)}
                onClick={() => nav(ROUTE_PATH.MYPAGE)}
                label="마이 페이지"
              >
                <UserIcon className="h-7 w-7" />
              </NavButton>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

/** 네비 아이템 공통 버튼 */
function NavButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center outline-none"
      aria-current={active ? "page" : undefined}
      aria-label={label}
    >
      <div className={active ? "text-blue-600" : "text-neutral-400"}>
        {children}
      </div>
      <span
        className={`mt-0.5 text-[11px] font-bold leading-4 ${
          active ? "text-blue-600" : "text-neutral-400"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

/* ---- 아이콘 (Material Symbols 사용) ---- */
function HomeIcon({ className = "" }) {
  return <span className={`material-symbols-outlined ${className}`}>home</span>;
}
function ListIcon({ className = "" }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>
      calendar_month
    </span>
  );
}
function PlusIcon({ className = "" }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>add_circle</span>
  );
}
function UserIcon({ className = "" }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>
      account_circle
    </span>
  );
}
