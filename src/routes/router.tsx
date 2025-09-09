import { Routes, Route } from "react-router-dom";
import { ROUTE_PATH } from "@/routes/paths";

import OnboardingPage from "@/pages/OnboardingPage";
import HomePage from "@/pages/HomePage";
// 추후 생성될 페이지 더미
const ReservationsPage = () => <div>예약 내역 페이지</div>;
const RegisterPage = () => <div>공간 등록 페이지</div>;
const MyPage = () => <div>마이 페이지</div>;

export default function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTE_PATH.ONBOARDING} element={<OnboardingPage />} />
      <Route path={ROUTE_PATH.HOME} element={<HomePage />} />
      <Route path={ROUTE_PATH.RESERVATIONS} element={<ReservationsPage />} />
      <Route path={ROUTE_PATH.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTE_PATH.MYPAGE} element={<MyPage />} />
    </Routes>
  );
}
