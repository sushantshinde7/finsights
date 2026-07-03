import "./AuthPrompt.css";
import { useNavigate } from "react-router-dom";

export default function AuthPrompt({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-prompt" onClick={(e) => e.stopPropagation()}>
        <h3>Sign in required</h3>

        <p>Create an account to add, edit and manage your financial data.</p>

        <div className="auth-prompt-actions">
          <button className="btn-secondary" onClick={onClose}>
            Maybe Later
          </button>

          <button
            className="auth-prompt-btn primary"
            onClick={() => {
              onClose();
              navigate("/login");
            }}
          >
            Login
          </button>

          <button
            className="auth-prompt-btn"
            onClick={() => {
              onClose();
              navigate("/signup");
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
