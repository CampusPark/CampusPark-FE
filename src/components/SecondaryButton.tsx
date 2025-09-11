// components/SecondaryButton.tsx
import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
};

export default function SecondaryButton({
  children,
  onClick,
  disabled,
  className = "",
  fullWidth = true,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${fullWidth ? "w-full" : ""} h-12 sm:h-14 px-3
        bg-white text-blue-600 rounded-xl outline outline-1 outline-blue-500
        font-bold flex items-center justify-center
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50 active:bg-blue-100"}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
