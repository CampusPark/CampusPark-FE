import type { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh w-full bg-zinc-50">
      {/* 중앙 정렬 + 최대폭 고정 */}
      <div className="mx-auto min-h-dvh max-w-[720px] flex items-center justify-center shadow-lg">
        {children}
      </div>
    </div>
  );
}
