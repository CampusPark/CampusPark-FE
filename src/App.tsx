import AppLayout from "@/components/layout/AppLayout";
import AppRoutes from "@/routes/router";
import "./index.css"; // Tailwind ( @tailwind base/components/utilities )

function App() {
  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  );
}

export default App;
