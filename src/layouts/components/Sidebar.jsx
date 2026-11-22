import { NavLink } from "react-router-dom";
import { Home, LayoutDashboard, ArrowLeftRight, BarChart3 } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../routes/routes";
import { version } from "../../../package.json";

import "./Sidebar.css";

const navItems = [
  { path: ROUTES.HOME, label: "Home", icon: <Home size={18} /> },
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
  { path: ROUTES.INSIGHTS, label: "Insights", icon: <BarChart3 size={18} /> },
];

const Sidebar = ({ closeSidebar }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="sidebar-inner">
      <nav className="nav-group" aria-label="Primary">
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

      <div className="sidebar-footer">
        <div className="sidebar-footer-divider" />

        <p className="sidebar-footer-app">
          <span className="sidebar-footer-name">Finsights</span>
          <span className="sidebar-footer-version">v{version}</span>
        </p>

        {isAuthenticated && (
          <p className="sidebar-footer-note">Saved in this browser</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;