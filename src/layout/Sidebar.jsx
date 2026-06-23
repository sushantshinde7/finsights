import { NavLink } from "react-router-dom";

import "./Sidebar.css";

import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
} from "lucide-react";

const Sidebar = ({ closeSidebar }) => {
  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      path: "/transactions",
      label: "Transactions",
      icon: <ArrowLeftRight size={18} />,
    },
    {
      path: "/insights",
      label: "Insights",
      icon: <BarChart3 size={18} />,
    },
  ];

  return (
    <div className="sidebar-inner">
      <nav
        className="nav-group"
        aria-label="Sidebar Navigation"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <hr />
        <p>Finance Dashboard v1.0</p>
      </div>
    </div>
  );
};

export default Sidebar;