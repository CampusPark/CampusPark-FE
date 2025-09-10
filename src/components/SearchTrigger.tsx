type Props = { onClick: () => void; className?: string };

export default function SearchTrigger({ onClick, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="검색 페이지 열기"
      className={`flex w-full max-w-full items-center justify-between gap-2
                  rounded-3xl bg-white px-4 py-2 shadow-md
                  cursor-text text-sm text-neutral-500
                  ${className}`}
    >
      <span className="truncate">매장 검색하기</span>
      <span className="material-symbols-outlined text-neutral-400 text-[20px]">
        search
      </span>
    </button>
  );
}
