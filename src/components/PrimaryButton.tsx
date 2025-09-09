// components/PrimaryButton.tsx
import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export default function PrimaryButton({ children, onClick, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full h-12 sm:h-14 px-3 py-2 
        bg-blue-500 rounded-xl flex justify-center items-center gap-2.5 overflow-hidden
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600 active:bg-blue-700"}
      `}
    >
      <span className="text-white text-base sm:text-lg font-bold leading-6 sm:leading-7">
        {children}
      </span>
    </button>
  );
}
