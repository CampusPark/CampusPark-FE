import React from "react";
// 전역 타입 선언
declare global {
  interface Window {
    daum?: any;
  }
}

//인풋 태그를 위한 props 정의
// 주소가 선택 되었을 때, 상위로 {zonecode, roadAddress}를 알려주는 콜백.
type Props = {
  value?: string;
  onChange?: (address: { zonecode: string; roadAddress: string }) => void;
};

export default function ZipSearchInput({ value = "", onChange }: Props) {
  // 로컬 상태 - 모달 열림 여부, 선택된 주소 텍스트
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(value);

  React.useEffect(() => {
    setText(value);
  }, [value]);

  // 카카오 스크립트 로더
  const ensureDaumScript = React.useCallback(() => {
    if (window.daum?.Postcode) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      const el = document.createElement("script");
      el.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      el.onload = () => resolve();
      el.onerror = reject;
      document.head.appendChild(el);
    });
  }, []);

  // 모달 열면 Postcode 임베드
  //   oncomplete에서 주소 선택시 처리
  React.useEffect(() => {
    if (!open) return;
    let postcode: any;

    ensureDaumScript().then(() => {
      const container = document.getElementById("postcode-container");
      if (!container) return;

      postcode = new window.daum.Postcode({
        oncomplete: (data: any) => {
          const addr = {
            zonecode: data.zonecode,
            roadAddress: data.roadAddress,
          };
          setText(addr.zonecode); // ✅ 여기! '우편번호만' 필드에 표시
          onChange?.(addr); // 부모에 zonecode/roadAddress 전달
          setOpen(false);
        },
        onclose: () => setOpen(false),
        animation: true,
      });

      postcode.embed(container, {
        width: "100%",
        height: "100%",
        // 필요하면 기본 검색어:
        // q: "경북대",
        // autoClose: false,
      }); // 컨테이너 스크롤 맞추기
      const wrap = document.getElementById("postcode-wrap");
      if (wrap) wrap.scrollTop = 0;
    });

    return () => {
      // 임베드 해제는 라이브러리 내부에서 처리되므로 별도 정리 불필요
    };
  }, [open, ensureDaumScript, onChange]);

  return (
    <>
      {/* 입력 필드 */}
      {/* readOnly로 클릭하면 모달 오픈 */}
      <input
        type="text"
        readOnly
        placeholder="우편번호" // ✅ 문구 정리
        inputMode="numeric" // (선택) 모바일 숫자 키패드
        pattern="\d{5}" // (선택) 한국 우편번호 5자리
        value={text}
        onClick={() => setOpen(true)}
        className="self-stretch h-8 px-2 bg-neutral-200 rounded-lg border border-neutral-400 focus:outline-none cursor-pointer"
      />

      {/* 모달 */}
      {open && (
        <div
          id="postcode-wrap"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* 반투명 배경 */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          {/* 카드 */}
          <div className="relative z-10 w-[92vw] max-w-[480px] h-[70vh] bg-white rounded-xl shadow-lg border border-neutral-200 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-3 h-10 border-b">
              <span className="text-sm font-medium">우편번호 검색</span>
              <button
                className="px-2 py-1 text-sm text-neutral-600 hover:text-black"
                onClick={() => setOpen(false)}
              >
                닫기
              </button>
            </div>
            {/* 카카오 검색 UI */}
            <div id="postcode-container" className="flex-1 overflow-auto" />
          </div>
        </div>
      )}
    </>
  );
}
