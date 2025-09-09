// components/Header.tsx
import React from "react";

type Props = {
  title: string;
  left?: React.ReactNode; // 뒤로가기 버튼, 아이콘 등
  right?: React.ReactNode; // 설정 버튼, 닫기 버튼 등
};

export default function Header({ title, left, right }: Props) {
  return (
    <div className="w-full h-12 p-3 bg-white border-b border-zinc-300 inline-flex justify-between items-center">
      <div className="w-6 h-6 flex items-center justify-center">{left}</div>
      <div className="text-black text-base sm:text-lg font-semibold leading-6 sm:leading-7">
        {title}
      </div>
      <div className="w-6 h-6 flex items-center justify-center">{right}</div>
    </div>
  );
}
