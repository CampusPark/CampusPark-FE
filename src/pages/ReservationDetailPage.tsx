import { useLocation, useNavigate } from "react-router-dom";

type InUseState = {
  spotName: string; // 예: "엘레강스빌"
  locationLabel?: string; // 예: "북문 근처"
  startTime: string; // "09:00"
  endTime: string; // "11:00"
  pricePerHour?: number; // 2500
  remainingMinutes?: number; // 45
  providerName?: string; // "김대학"
  providerTemp?: number; // 85
  aiDescription?: string; // 공간 설명 문구
  imageUrl?: string; // 상단 썸네일(옵션)
};

export default function ReservationDetailPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const {
    spotName = "주차공간",
    locationLabel = "북문 근처",
    startTime = "09:00",
    endTime = "11:00",
    pricePerHour = 2500,
    remainingMinutes = 45,
    providerName = "김대학",
    providerTemp = 85,
    aiDescription = "쪽문 근처에 위치한 주차 공간입니다. CCTV가 설치되어 있어 안전하며, 주차 공간이 넓고 쾌적합니다. 하지만 이중 주차가 될 가능성이 있으니 시간 여유가 없다면 추천하지 않아요!",
    imageUrl,
  } = (state ?? {}) as InUseState;

  return (
    <div className="mx-auto grid min-h-dvh w-full max-w-[720px] grid-rows-[auto_1fr_auto] bg-white">
      {/* 상단 헤더 */}
      <header className="flex h-[51px] items-center justify-between border-b border-zinc-300 px-3">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => nav(-1)}
          className="grid h-6 w-6 place-items-center"
        >
          <span className="material-symbols-outlined text-[20px]">
            arrow_back
          </span>
        </button>
        <h1 className="text-[18px] font-semibold leading-7 text-black">
          이용 중인 주차공간 상세
        </h1>
        <div className="h-6 w-6" />
      </header>

      {/* 본문 */}
      <main className="flex flex-col items-center gap-2 bg-zinc-50 p-2">
        {/* 상단 이미지/지도 자리 */}
        <div className="h-[270px] max-w-[720px] w-full bg-slate-500">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={spotName}
              className="h-full w-full rounded-md object-cover"
            />
          ) : null}
        </div>

        {/* 현재 이용중 카드 */}
        <section className="flex max-w-[700px] w-full gap-2 rounded-lg bg-white p-2">
          <div className="h-[120px] w-[130px] rounded-md bg-amber-100" />
          <div className="flex w-full flex-col px-1">
            {/* 타이틀 + 남은시간 뱃지 */}
            <div className="flex items-center justify-between w-full max-w-[600px]">
              <div className="truncate text-[16px] font-semibold text-black">
                {spotName}
              </div>
              <div className="rounded-2xl border border-green-500 bg-green-100 px-1 py-0.5">
                <span className="block px-1 text-[10px] font-semibold text-green-500">
                  {remainingMinutes}분 남음
                </span>
              </div>
            </div>

            {/* 위치 */}
            <div className="flex items-center gap-1 p-1">
              <span className="material-symbols-outlined text-[14px] text-neutral-600">
                location_on
              </span>
              <span className="text-[12px] font-medium leading-7 text-neutral-600">
                {locationLabel}
              </span>
            </div>

            {/* 시간 */}
            <div className="flex items-center gap-1 p-1">
              <span className="material-symbols-outlined text-[14px] text-neutral-600">
                schedule
              </span>
              <span className="text-[12px] font-medium leading-7 text-neutral-600">
                {startTime} ~ {endTime}
              </span>
            </div>

            {/* 포인트(시간당) */}
            <div className="flex items-center gap-1 p-1">
              <span className="material-symbols-outlined text-[14px] text-neutral-600">
                payments
              </span>
              <span className="text-[12px] font-semibold leading-[14px] text-blue-500">
                {pricePerHour.toLocaleString()}P
              </span>
            </div>
          </div>
        </section>

        {/* 제공자/매너온도 */}
        <section className="flex max-w-[700px] w-full items-center gap-2 rounded-md bg-neutral-100 p-1">
          <div className="flex flex-col p-1">
            <div className="p-1 text-[12px] font-semibold text-black">
              {providerName}
            </div>
            <div className="p-1 text-[10px] font-medium text-neutral-500">
              공간 제공자
            </div>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1 p-1">
            <div className="grid h-4 w-4 place-items-center">
              <span className="inline-block h-3 w-3 rounded-[2px] bg-amber-400" />
            </div>
            <div className="text-[10px] font-semibold leading-4 text-amber-500">
              {providerTemp}°C
            </div>
            <div className="text-[10px] font-semibold leading-4 text-gray-500">
              매너 온도
            </div>
          </div>
        </section>

        {/* 공간 설명 (AI) */}
        <section className="flex max-w-[700px] w-full flex-col gap-2 px-[10px] py-1">
          <div className="text-[12px] font-semibold text-neutral-600">
            공간 설명
          </div>
          <div className="rounded border border-blue-600 p-2">
            <p className="text-[12px] leading-4 text-blue-600">
              {aiDescription}
            </p>
          </div>
        </section>
      </main>

      {/* 하단 고정 버튼 */}
      <div className="sticky bottom-0 left-0 right-0 mx-auto w-full max-w-[720px] px-2 pb-3 pt-2 bg-zinc-50">
        <button
          type="button"
          onClick={() => {
            // TODO: 출차 처리 로직(반납 API) 연결
            nav(-1);
          }}
          className="h-[53px] w-[calc(100%-16px)] translate-x-[8px] rounded-xl bg-blue-500 text-[18px] font-bold text-white"
        >
          출차하기
        </button>
      </div>
    </div>
  );
}
