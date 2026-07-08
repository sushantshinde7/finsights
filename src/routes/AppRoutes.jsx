import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "../layout/Layout";
import DashboardPage    from "../pages/dashboard/DashboardPage";
import TransactionsPage from "../pages/transactions/TransactionsPage";
import InsightsPage     from "../pages/insights/InsightsPage";
import LoginPage        from "../pages/auth/LoginPage";
import SignupPage       from "../pages/auth/SignupPage";
import NotFoundPage      from "../pages/not-found/NotFoundPage";
import GuestRoute       from "../components/auth/GuestRoute";
import { ROUTES } from "../routes/routes"

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth pages — outside Layout, no sidebar/navbar */}
        <Route path="/login" element={
          <GuestRoute><LoginPage /></GuestRoute>
        } />
        <Route path="/signup" element={
          <GuestRoute><SignupPage /></GuestRoute>
        } />

        {/* App pages — inside Layout (navbar + sidebar) */}
        <Route element={<Layout />}>
          <Route path="/"             element={<Navigate to={ROUTES.DASHBOARD}  replace />} />
          <Route path="/dashboard"    element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/insights"     element={<InsightsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;