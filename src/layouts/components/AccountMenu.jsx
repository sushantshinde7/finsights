import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../routes/routes";

import "./AccountMenu.css";

// Shows the Google profile photo when there is one, otherwise the first-name
// initial. Email/password accounts have no photo, and a photo URL can fail to
// load, so onError drops back to the initial instead of a broken image.
const Avatar = ({ photoURL, initial, large = false }) => {
  const [failed, setFailed] = useState(false);
  const showPhoto = photoURL && !failed;

  return (
    <span
      className={`account-avatar ${large ? "account-avatar--lg" : ""}`}
      aria-hidden="true"
    >
      {showPhoto ? (
        <img
          src={photoURL}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        (initial ?? <User size={large ? 18 : 14} />)
      )}
    </span>
  );
};

const AccountMenu = () => {
  const { firstName, displayName, email, photoURL, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);

  const initial = firstName ? firstName.charAt(0).toUpperCase() : null;

  // Close on outside press and on Escape (focus goes back to the trigger).
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="account-menu" ref={wrapperRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`account-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="account-panel"
        aria-label={firstName ? `Account menu for ${firstName}` : "Account menu"}
      >
        <Avatar photoURL={photoURL} initial={initial} />
        <span className="account-name">{firstName}</span>
        <ChevronDown size={14} className="account-chevron" aria-hidden="true" />
      </button>

      {open && (
        <div id="account-panel" className="account-panel">
          <div className="account-panel-header">
            <Avatar photoURL={photoURL} initial={initial} large />

            <div className="account-panel-info">
              <span className="account-panel-name" title={displayName ?? ""}>
                {displayName || firstName || "Account"}
              </span>
              {email && (
                <span className="account-panel-email" title={email}>
                  {email}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="account-logout"
            onClick={handleLogout}
          >
            <LogOut size={16} aria-hidden="true" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;