import { BrowserRouter } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Router from "@/routes/router"; // <Routes>를 return하는 컴포넌트

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Router />
      </AppLayout>
    </BrowserRouter>
  );
}
