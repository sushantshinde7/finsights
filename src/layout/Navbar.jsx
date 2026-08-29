import "./Navbar.css";
import { Moon, Sun, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, firstName, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button
          className={`hamburger-btn ${sidebarOpen ? "active" : ""}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Sidebar"
        >
          <span />
          <span />
          <span />
        </button>

        <h2>Finsights</h2>
      </div>

      <div className="navbar-right">
        {isAuthenticated ? (
          <div className="nav-user">
            <User size={15} />
            <span className="nav-user-name">{firstName}</span>
          </div>
        ) : (
          <>
            <button className="nav-auth-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button
              className="nav-auth-btn primary"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </>
        )}

        <button
          className={`theme-toggle ${theme}`}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <Sun className="theme-icon sun-icon" size={18} />
          <Moon className="theme-icon moon-icon" size={18} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
