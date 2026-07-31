import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../routes/routes";
import "./AuthPages.css";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();

  const [email, setEmail]           = useState("");
  const [error, setError]           = useState("");
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);

  const validate = () => {
    if (!email.trim())                              return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email address";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(firebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--forgot">
      <aside className="auth-branding auth-branding--forgot">
        <div className="auth-branding-content">
          {/* Logotype, not a heading — the card's <h1> is the page's real heading */}
          <p className="auth-brand">Finsights</p>

          <h2>Reset your password.</h2>

          <p>
            Enter the email linked to your account and we'll send you
            a secure link to choose a new password.
          </p>
        </div>
      </aside>

      <main className="auth-card auth-card--forgot">
        {submitted ? (

          /* ── Success state ───────────────────────────────── */
          <div className="auth-success">
            <div className="auth-success-icon" aria-hidden="true">✉</div>
            <h1 className="auth-title">Check your inbox</h1>
            <p className="auth-subtitle">
              We sent a password reset link to{" "}
              <strong>{email}</strong>.
              <br />
              Check your spam folder if you don't see it within a minute.
            </p>
            <Link to={ROUTES.LOGIN} className="auth-btn-primary auth-btn-block">
              Back to sign in
            </Link>
          </div>

        ) : (

          /* ── Form state ──────────────────────────────────── */
          <>
            <div className="auth-header">
              <h1 className="auth-title">Forgot password?</h1>
              <p className="auth-subtitle">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            {error && (
              <div className="auth-server-error" role="alert">{error}</div>
            )}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="auth-field">
                <label htmlFor="email" className="auth-label">Email</label>
                <input
                  id="email"
                  className={`auth-input ${error ? "auth-input--error" : ""}`}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <button
                className="auth-btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>

              <div className="auth-card-footnote">
                The reset link expires after 1 hour for your security.
              </div>
            </form>

            <p className="auth-switch">
              Remembered it?{" "}
              <Link to={ROUTES.LOGIN} className="auth-link">
                Back to sign in
              </Link>
            </p>
          </>

        )}
      </main>
    </div>
  );
}

function firebaseError(code) {
  const map = {
    "auth/invalid-email":          "Invalid email address.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/too-many-requests":      "Too many attempts. Try again later.",
  };
  return map[code] || "Something went wrong. Please try again.";
}