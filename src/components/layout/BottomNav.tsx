import { useLocation, useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "@/routes/paths";

const items = [
  { label: "홈", path: ROUTE_PATH.HOME, icon: HomeIcon },
  { label: "예약 내역", path: ROUTE_PATH.RESERVATIONS, icon: ListIcon },
  { label: "공간 등록", path: ROUTE_PATH.REGISTER, icon: PlusIcon },
  { label: "마이 페이지", path: ROUTE_PATH.MYPAGE, icon: UserIcon },
];

/** 필요한 페이지에서 직접 렌더링해서 사용하세요. */
export default function BottomNav() {
  const { pathname } = useLocation();
  const nav = useNavigate();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-[720px]
             border-t border-neutral-200 bg-white/95 backdrop-blur
             supports-[backdrop-filter]:bg-white/75 px-4 sm:px-8 md:px-16 py-2
             pb-[calc(env(safe-area-inset-bottom,0)+0.5rem)]"
      aria-label="하단 네비게이션"
    >
      <ul className="flex items-center justify-between gap-1">
        {items.map(({ label, path, icon: Icon }) => {
          const active = pathname.startsWith(path);
          return (
            <li
              key={path}
              className="flex flex-1 basis-1/5 min-w-[56px] flex-col items-center justify-center"
            >
              <button
                type="button"
                onClick={() => nav(path)}
                className="flex flex-col items-center justify-center outline-none"
                aria-current={active ? "page" : undefined}
                aria-label={label}
              >
                <Icon
                  className={`h-8 w-8 ${active ? "text-blue-600" : "text-neutral-400"}`}
                />
                <span
                  className={`mt-0.5 text-[13px] font-bold leading-4 ${active ? "text-blue-600" : "text-neutral-400"}`}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** 콘텐츠가 네비게이션에 가리지 않도록 여백 확보용 스페이서 */
export function BottomNavSpacer() {
  return <div className="h-16" />; // 필요하면 높이 조정
}

/* ---- 간단 아이콘 ---- */
function HomeIcon({ className = "" }) {
  return (
    <span className={`material-symbols-outlined text-[28px] ${className}`}>
      home
    </span>
  );
}
function ListIcon({ className = "" }) {
  return (
    <span className={`material-symbols-outlined text-[28px] ${className}`}>
      calendar_month
    </span>
  );
}

function PlusIcon({ className = "" }) {
  return (
    <span className={`material-symbols-outlined text-[28px] ${className}`}>
      add_circle
    </span>
  );
}
function UserIcon({ className = "" }) {
  return (
    <span className={`material-symbols-outlined text-[28px] ${className}`}>
      account_circle
    </span>
  );
}
