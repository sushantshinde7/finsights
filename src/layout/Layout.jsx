import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./Layout.css";

const Layout = ({ children, setPage, activePage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Prevent body scroll when drawer open */
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  /* ESC key closes sidebar */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className="layout">
      <Navbar sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen} 
      />

      <div className="layout-body">
        {sidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <Sidebar
            setPage={(page) => {
              setPage(page);
              setSidebarOpen(false);
            }}
            activePage={activePage}
          />
        </aside>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
