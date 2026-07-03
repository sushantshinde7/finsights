import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Prevents logged-in users from seeing /login or /signup
export default function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}