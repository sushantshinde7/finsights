import "./Sidebar.css";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
} from "lucide-react";

const Sidebar = ({ setPage, activePage }) => {
  const navItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      key: "transactions",
      label: "Transactions",
      icon: <ArrowLeftRight size={18} />,
    },
    {
      key: "insights",
      label: "Insights",
      icon: <BarChart3 size={18} />,
    },
  ];

  return (
    <div className="sidebar-inner">
      <nav className="nav-group" aria-label="Sidebar Navigation">
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`nav-item ${activePage === item.key ? "active" : ""}`}
            onClick={() => setPage(item.key)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
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