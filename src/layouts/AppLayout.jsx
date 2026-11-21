import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { ROUTES } from "../routes/routes";

import "./AppLayout.css";

const MOBILE_QUERY = "(max-width: 768px)"; // same breakpoint as AppLayout.css

const PAGE_TITLES = {
  [ROUTES.HOME]: "Finsights · Personal Finance, Simplified",
  [ROUTES.DASHBOARD]: "Dashboard · Finsights",
  [ROUTES.TRANSACTIONS]: "Transactions · Finsights",
  [ROUTES.INSIGHTS]: "Insights · Finsights",
};

const Layout = () => {
  const { pathname } = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches,
  );

  const toggleRef = useRef(null); // hamburger button (owned by Navbar)
  const sidebarRef = useRef(null);
  const mainRef = useRef(null);

  const scrollPositions = useRef(new Map()); // pathname -> last scrollTop
  const scrollKey = useRef(pathname); // page the scroll events belong to
  const prevPathname = useRef(pathname);
  const wasOpen = useRef(false);

  const sidebarHidden = isMobile && !sidebarOpen; // closed drawer: out of tab order + a11y tree
  const mainInert = isMobile && sidebarOpen; // open drawer: page behind it is not interactive

  /* ---------- body scroll lock while the drawer is open ---------- */
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

  /* ---------- Escape closes the drawer ---------- */
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

  /* ---------- breakpoint tracking ---------- */
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);

    const onChange = (e) => {
      setIsMobile(e.matches);
      // Back to desktop: the drawer no longer exists, so reset its state.
      if (!e.matches) setSidebarOpen(false);
    };

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* ---------- drawer focus: into the drawer on open, back to the hamburger on close ---------- */
  useEffect(() => {
    const wasOpenBefore = wasOpen.current;
    wasOpen.current = sidebarOpen;

    if (!isMobile) return;

    if (sidebarOpen) {
      sidebarRef.current?.querySelector("a")?.focus({ preventScroll: true });
    } else if (wasOpenBefore) {
      toggleRef.current?.focus({ preventScroll: true });
    }
  }, [sidebarOpen, isMobile]);

  /* ---------- each page remembers its own scroll position ---------- */
  useLayoutEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const target = scrollPositions.current.get(pathname) ?? 0;
    scrollKey.current = pathname;
    main.scrollTop = target;

    // Charts can finish sizing a frame late; if the first attempt was
    // clamped by a shorter page, try once more.
    const raf = requestAnimationFrame(() => {
      if (Math.abs(main.scrollTop - target) > 1) main.scrollTop = target;
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  const handleMainScroll = (e) => {
    scrollPositions.current.set(scrollKey.current, e.currentTarget.scrollTop);
  };

  /* ---------- after navigating, move focus to the new page ---------- */
  // Declared after the drawer-focus effect on purpose: when a sidebar link is
  // clicked both run in the same commit and the page should win.
  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  /* ---------- page titles ---------- */
  useEffect(() => {
    document.title = PAGE_TITLES[pathname] ?? "Finsights";

    return () => {
      document.title = "Finsights";
    };
  }, [pathname]);

  return (
    <div className="layout">
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to main content
      </a>

      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        toggleRef={toggleRef}
      />

      <div className="layout-body">
        {sidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          id="app-sidebar"
          ref={sidebarRef}
          className={`sidebar ${sidebarOpen ? "open" : ""}`}
          inert={sidebarHidden}
        >
          <Sidebar closeSidebar={() => setSidebarOpen(false)} />
        </div>

        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="main-content"
          inert={mainInert}
          onScroll={handleMainScroll}
        >
          <div className="main-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;