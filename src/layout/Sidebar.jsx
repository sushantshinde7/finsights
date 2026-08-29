import { NavLink } from "react-router-dom";
import { ROUTES } from "../routes/routes";

import "./Sidebar.css";

import {
  Home,
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ closeSidebar }) => {
  const navItems = [
    {
      path: ROUTES.HOME,
      label: "Home",
      icon: <Home size={18} />,
    },
    {
      path: ROUTES.DASHBOARD,
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      path: ROUTES.TRANSACTIONS,
      label: "Transactions",
      icon: <ArrowLeftRight size={18} />,
    },
    {
      path: ROUTES.INSIGHTS,
      label: "Insights",
      icon: <BarChart3 size={18} />,
    },
  ];

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="sidebar-inner">
      <nav className="nav-group" aria-label="Sidebar Navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-account">
        <button className="nav-item logout-item" onClick={handleLogout}>
          <span className="nav-icon">
            <LogOut size={18} />
          </span>

          <span>Logout</span>
        </button>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer-divider" />
        <p>
          <span>Finsights</span>
          <span className="footer-separator">·</span>
          <span>v1.0.0</span>
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
