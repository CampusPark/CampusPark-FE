import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, generatePath } from "react-router-dom";
import { ROUTE_PATH } from "@/routes/paths";
import SearchHeader from "@/pages/search/components/SearchHeader";
import SearchResults, {
  type ResultItem,
} from "@/pages/search/components/SearchResults";
import SearchEmpty from "@/pages/search/components/SearchEmpty";

const NAV_HEIGHT = 70;

/** 퍼블리싱 전용: 실제 검색 호출 없이 상태만 바뀌는 UI */
export default function SearchPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const initial = params.get("keyword") ?? "";
  const [keyword, setKeyword] = useState(initial);
  const [items, setItems] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  // 초기 keyword가 있으면 자동 검색(모션만)
  useEffect(() => {
    if (!initial) return;
    void submit(initial, { updateUrl: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (kw = keyword, opts?: { updateUrl?: boolean }) => {
    const q = kw.trim();
    if (!q) {
      setItems([]);
      setError(null);
      setParams({}, { replace: true });
      return;
    }

    const rid = ++requestIdRef.current;
    try {
      setLoading(true);
      setError(null);

      // ⬇️ 퍼블리싱용 더미 결과 (API 붙이면 이 부분만 교체)
      await new Promise((r) => setTimeout(r, 400));
      const demo: ResultItem[] = [
        {
          id: 1,
          name: "엘레강스 빌",
          address: "대구 북구 대학로 80",
          description: "시간대별 빈자리 공유",
          imageUrl: "",
          openingTime: "24시간",
          distanceM: 280,
        },
        {
          id: 2,
          name: "청운하이츠",
          address: "대구 북구 경대로 5길",
          description: "주민 주차장 공유",
          imageUrl: "",
          openingTime: "07:00 ~ 22:00",
          distanceM: 520,
        },
      ];
      if (rid !== requestIdRef.current) return;
      setItems(demo);

      if (opts?.updateUrl !== false) {
        setParams({ keyword: q }, { replace: false });
      }
    } catch {
      if (rid !== requestIdRef.current) return;
      setError("검색 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      if (rid === requestIdRef.current) setLoading(false);
    }
  };

  const goDetail = (id: string) => {
    navigate(generatePath(ROUTE_PATH.SPOT_DETAIL, { id }));
  };

  return (
    <div
      className="relative mx-auto min-h-dvh w-full max-w-[720px] bg-white
                 pb-[calc(70px+env(safe-area-inset-bottom,0px))]"
    >
      <SearchHeader
        value={keyword}
        onChange={setKeyword}
        onSubmit={() => submit()}
        onBack={() => navigate(-1)}
      />

      {loading && <Empty>검색 중…</Empty>}
      {!loading && error && <Empty>{error}</Empty>}

      {!loading && !error && keyword.trim().length === 0 && (
        <SearchEmpty message="검색어를 입력해보세요." navHeight={NAV_HEIGHT} />
      )}

      {!loading &&
        !error &&
        keyword.trim().length > 0 &&
        items.length === 0 && (
          <SearchEmpty
            message="일치하는 결과가 없어요."
            navHeight={NAV_HEIGHT}
          />
        )}

      {!loading && !error && items.length > 0 && (
        <SearchResults
          results={items}
          onSelect={(s) => goDetail(String(s.id))}
        />
      )}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid place-items-center px-4 py-10 text-[13px] text-neutral-500">
      {children}
    </div>
  );
}
