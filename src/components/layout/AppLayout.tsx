import type { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="w-full min-h-dvh bg-white">
      <div className="mx-auto min-h-dvh max-w-[720px] p-0">{children}</div>
    </div>
  );
}
