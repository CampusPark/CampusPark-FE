export type ResultItem = {
  id: number | string;
  name: string;
  address: string;
  description?: string;
  imageUrl?: string;
  openingTime?: string;
  distanceM?: number | null;
};

export default function SearchResults({
  results,
  onSelect,
}: {
  results: ResultItem[];
  onSelect: (item: ResultItem) => void;
}) {
  return (
    <ul className="space-y-2 px-3 pb-6 pt-2">
      {results.map((r) => (
        <li
          key={r.id}
          className="flex cursor-pointer gap-3 rounded-xl bg-white p-3 shadow-[0_0_8px_rgba(0,0,0,0.12)]"
          onClick={() => onSelect(r)}
        >
          <div className="h-16 w-20 flex-shrink-0 rounded-lg bg-neutral-100" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[16px] font-semibold">{r.name}</div>
            <div className="truncate text-[12px] text-neutral-500">
              {r.address}
            </div>
            {r.description && (
              <div className="truncate text-[12px] text-neutral-400">
                {r.description}
              </div>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
              {r.openingTime && <span>⏰ {r.openingTime}</span>}
              {typeof r.distanceM === "number" && <span>• {r.distanceM}m</span>}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
