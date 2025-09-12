// routes/paths.ts
export const ROUTE_PATH = {
  ONBOARDING: "/", // 시작 화면
  HOME: "/home", // 지도/메인 페이지
  SEARCH: "/search", // 검색
  SPOT_DETAIL: "/spots/:id",
  SPOT_BOOKING: "/spots/booking", // 예약 (id는 state로 전달)

  RESERVATIONS: "/reservations", // 예약 내역
  REGISTER: "/register", // 등록 루트 (리다이렉트 용)
  REGISTER_STEP1: "/register/step-1",
  REGISTER_STEP2: "/register/step-2",
  REGISTER_STEP3: "/register/step-3",
  REGISTER_STEP4: "/register/step-4",
  REGISTER_STEP5: "/register/step-5",

  MYPAGE: "/mypage",
  MONITOR: "/owner/monitor",
};
