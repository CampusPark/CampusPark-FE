import { Routes, Route } from "react-router-dom";
// If the correct path is "@/routes/path", update as follows:
import { ROUTE_PATH } from "@/routes/paths";

import OnboardingPage from "@/pages/OnboardingPage";
import MonitorPage from "@/pages/owner/MonitorPage";

const Router = () => {
  return (
    <Routes>
      {/* 온보딩 (앱 진입 시 첫 화면) */}
      <Route path={ROUTE_PATH.MAIN} element={<MonitorPage />} />
      {/* 사용자 영역 */}

      {/* 오너 영역 */}
    </Routes>
  );
};

export default Router;
