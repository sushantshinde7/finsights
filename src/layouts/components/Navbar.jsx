import "./Navbar.css";
import { LogIn, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../routes/routes";

import AccountMenu from "./AccountMenu";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button
          className={`hamburger-btn ${sidebarOpen ? "active" : ""}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Sidebar"
          aria-expanded={sidebarOpen}
          aria-controls="app-sidebar"
        >
          <span />
          <span />
          <span />
        </button>

        <Link
          to={ROUTES.HOME}
          className="navbar-brand"
          aria-label="Finsights home"
          onClick={() => setSidebarOpen(false)}
        >
          <h2>Finsights</h2>
        </Link>
      </div>

      <div className="navbar-right">
        {isAuthenticated ? (
          <AccountMenu />
        ) : (
          <Link to={ROUTES.LOGIN} className="nav-login-btn">
            <span className="nav-login-icon" aria-hidden="true">
              <LogIn size={16} />
            </span>
            <span className="nav-login-label">Login</span>
          </Link>
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
