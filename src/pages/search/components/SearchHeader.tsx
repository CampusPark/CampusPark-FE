type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export default function SearchHeader({
  value,
  onChange,
  onSubmit,
  onBack,
}: Props) {
  return (
    <header className="sticky top-3 z-30 bg-white/95 px-3 pb-2 pt-2 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="뒤로"
          onClick={onBack}
          className="grid h-9 w-9 place-items-center rounded-full text-neutral-600 hover:bg-neutral-100"
        >
          <span className="material-symbols-outlined text-[22px]">
            arrow_back
          </span>
        </button>

        <form
          className="flex flex-1 items-center gap-2 rounded-3xl bg-neutral-100 px-3 py-2"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <span className="material-symbols-outlined text-[20px] text-neutral-400">
            search
          </span>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="목적지 또는 주소 검색"
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-neutral-400"
          />
          {value && (
            <button
              type="button"
              aria-label="지우기"
              onClick={() => onChange("")}
              className="grid h-6 w-6 place-items-center rounded-full text-neutral-400 hover:bg-neutral-200"
            >
              <span className="material-symbols-outlined text-[18px]">
                close
              </span>
            </button>
          )}
        </form>
      </div>
    </header>
  );
}
