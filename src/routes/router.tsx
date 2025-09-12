import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTE_PATH } from "@/routes/paths";

import OnboardingPage from "@/pages/OnboardingPage";
import MonitorPage from "@/pages/owner/MonitorPage";
import SpacesPageStep1 from "@/pages/owner/SpacesPageStep1";
import SpacesPageStep2 from "@/pages/owner/SpacesPageStep2";
import SpacesPageStep3 from "@/pages/owner/SpacesPageStep3";
import SpacesPageStep4 from "@/pages/owner/SpacesPageStep4";
import SpacesPageStep5 from "@/pages/owner/SpacesPageStep5";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/search/SearchPage";
import SpotDetailPage from "@/pages/SpotDetailPage";
import MyPage from "@/pages/MyPage";

const ReservationsPage = () => <div>예약 내역 페이지</div>;

export default function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTE_PATH.ONBOARDING} element={<OnboardingPage />} />
      <Route path={ROUTE_PATH.HOME} element={<HomePage />} />
      <Route path={ROUTE_PATH.SEARCH} element={<SearchPage />} />
      <Route path={ROUTE_PATH.SPOT_DETAIL} element={<SpotDetailPage />} />

      <Route path={ROUTE_PATH.RESERVATIONS} element={<ReservationsPage />} />

      {/* /register로 들어오면 step-1로 안내 */}
      <Route
        path={ROUTE_PATH.REGISTER}
        element={<Navigate to={ROUTE_PATH.REGISTER_STEP1} replace />}
      />
      <Route path={ROUTE_PATH.REGISTER_STEP1} element={<SpacesPageStep1 />} />
      <Route path={ROUTE_PATH.REGISTER_STEP2} element={<SpacesPageStep2 />} />
      <Route path={ROUTE_PATH.REGISTER_STEP3} element={<SpacesPageStep3 />} />
      <Route path={ROUTE_PATH.REGISTER_STEP4} element={<SpacesPageStep4 />} />
      <Route path={ROUTE_PATH.REGISTER_STEP5} element={<SpacesPageStep5 />} />

      <Route path={ROUTE_PATH.MONITOR} element={<MonitorPage />} />

      <Route path={ROUTE_PATH.MYPAGE} element={<MyPage />} />

      {/* (선택) 없는 경로 404 처리 */}
      {/* <Route path="*" element={<Navigate to={ROUTE_PATH.ONBOARDING} replace />} /> */}
    </Routes>
  );
}
