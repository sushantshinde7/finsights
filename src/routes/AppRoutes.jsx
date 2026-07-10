import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "../layout/Layout";
import HomePage from "../pages/home/HomePage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import TransactionsPage from "../pages/transactions/TransactionsPage";
import InsightsPage from "../pages/insights/InsightsPage";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import SignupPage from "../pages/auth/SignupPage";
import NotFoundPage from "../pages/not-found/NotFoundPage";
import GuestRoute from "../components/auth/GuestRoute";
import { ROUTES } from "../routes/routes";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — outside Layout, no sidebar/navbar */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path={ROUTES.SIGNUP}
          element={
            <GuestRoute>
              <SignupPage />
            </GuestRoute>
          }
        />
        <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={
            <GuestRoute>
              <ForgotPasswordPage />
            </GuestRoute>
          }
        />

        {/* App pages — inside Layout (navbar + sidebar) */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
