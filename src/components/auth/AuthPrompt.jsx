import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { EASE } from "../../lib/motion";
import "./AuthPrompt.css";

export default function AuthPrompt({ onClose }) {
  const navigate = useNavigate();

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
          Save and manage your finances
        </h3>

        <p className="auth-prompt-description">
          You're currently using guest mode. Create a free account to add, edit,
          delete, and securely store your transactions across devices.
        </p>

        <ul className="auth-prompt-features">
          <li>✓ Save transactions securely</li>
          <li>✓ Access your data anywhere</li>
          <li>✓ Track budgets and spending</li>
          <li>✓ Unlock future insights and analytics</li>
        </ul>

        <div className="auth-prompt-actions">
          <button
            className="auth-prompt-btn auth-prompt-btn--ghost"
            onClick={onClose}
          >
            Continue as Guest
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