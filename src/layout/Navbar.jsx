import { useEffect, useState } from "react";
import "./Navbar.css";
import { Moon, Sun } from "lucide-react";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

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

        <h2>Finance Insights</h2>
      </div>

      <div className="navbar-right">
        <button className="nav-auth-btn">Login</button>

        <button className="nav-auth-btn primary">Sign Up</button>

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
