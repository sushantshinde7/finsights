import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { EASE } from "../../lib/motion";
import "./AuthPrompt.css";

// Copy per action. `perk` replaces the third bullet.
const COPY = {
  add: {
    title: "Save your transactions",
    message:
      "You're using guest mode. Create a free account to add transactions and keep them safe across devices.",
    perk: "Your entries stay saved to your account",
  },
  edit: {
    title: "Manage your transactions",
    message:
      "You're using guest mode. Sign in to edit transactions and keep your records accurate.",
    perk: "Fix mistakes and keep records accurate",
  },
  delete: {
    title: "Manage your transactions",
    message:
      "You're using guest mode. Sign in to delete transactions from your records.",
    perk: "Remove entries with a quick undo",
  },
  import: {
    title: "Import your data",
    message:
      "You're using guest mode. Create a free account to import a CSV and store it securely.",
    perk: "Import CSV files and keep them stored",
  },
  export: {
    title: "Export your data",
    message:
      "You're using guest mode. Sign in to export your transactions as a CSV anytime.",
    perk: "Download your data as CSV anytime",
  },
  default: {
    title: "Save and manage your finances",
    message:
      "You're using guest mode. Create a free account to add, edit, delete, and securely store your transactions across devices.",
    perk: "Manage your transactions in one place",
  },
};

export default function AuthPrompt({ onClose, action = "default" }) {
  const navigate = useNavigate();
  const { title, message, perk } = COPY[action] ?? COPY.default;

  return (
    <motion.div
      className="auth-prompt-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-prompt-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="auth-prompt"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22, ease: EASE }}
      >
        <button
          className="auth-prompt-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          ✕
        </button>
        <div className="auth-prompt-icon">🔒</div>

        <h3 id="auth-prompt-title" className="auth-prompt-title">
          {title}
        </h3>

        <p className="auth-prompt-description">{message}</p>

        <ul className="auth-prompt-features">
          <li>✓ Save transactions securely</li>
          <li>✓ Access your data anywhere</li>
          <li>✓ {perk}</li>
        </ul>

        <div className="auth-prompt-actions">
          <button
            className="auth-prompt-btn auth-prompt-btn--ghost"
            onClick={onClose}
          >
            Maybe later
          </button>

          <button
            className="auth-prompt-btn auth-prompt-btn--secondary"
            onClick={() => {
              onClose();
              navigate("/login");
            }}
          >
            Sign In
          </button>

          <button
            className="auth-prompt-btn auth-prompt-btn--primary"
            onClick={() => {
              onClose();
              navigate("/signup");
            }}
          >
            Create Account
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}