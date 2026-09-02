import { useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { ROUTES } from "../../routes/routes";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fadeUp, staggerContainer, EASE } from "../../lib/motion";
import "./AuthPages.css";

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setServerError("");
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setServerError(firebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setServerError(firebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="auth-page auth-page--login">
        <aside className="auth-branding auth-branding--login">
          <motion.div
            className="auth-branding-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.1)}
          >
            {/* Logotype, not a heading — the card's <h1> is the page's real heading */}
            <motion.p className="auth-brand" variants={fadeUp}>
              Finsights
            </motion.p>

            <motion.h2 variants={fadeUp}>Welcome back.</motion.h2>

            <motion.p variants={fadeUp}>
              Continue tracking expenses, monitoring budgets, and understanding
              your financial habits.
            </motion.p>
          </motion.div>
        </aside>

        <motion.main
          className="auth-card auth-card--login"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
        >
          <div className="auth-header">
            <h1 className="auth-title">Sign in</h1>
            <p className="auth-subtitle">Enter your details to continue.</p>
          </div>

          <AnimatePresence>
            {serverError && (
              <motion.div
                key="server-error"
                className="auth-server-error"
                role="alert"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="email" className="auth-label">
                Email
              </label>
              <input
                id="email"
                className={`auth-input ${errors.email ? "auth-input--error" : ""}`}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                autoComplete="email"
                autoFocus
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.span
                    key="err-email"
                    id="email-error"
                    className="auth-error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    Invalid email
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="password" className="auth-label">
                  Password
                </label>
                <Link to={ROUTES.FORGOT_PASSWORD} className="auth-forgot">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                className={`auth-input ${errors.password ? "auth-input--error" : ""}`}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                autoComplete="current-password"
              />
              <AnimatePresence>
                {errors.password && (
                  <motion.span
                    key="err-password"
                    className="auth-error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    {errors.password}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <button className="auth-btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <div className="auth-card-footnote">
              Secure authentication powered by Firebase.
            </div>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            className="auth-btn-google"
            onClick={handleGoogle}
            disabled={loading}
            type="button"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to={ROUTES.SIGNUP} className="auth-link">
              Sign up
            </Link>
          </p>
        </motion.main>
      </div>
    </MotionConfig>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

function firebaseError(code) {
  const map = {
    "auth/invalid-credential": "Invalid email or password.",
    "auth/user-not-found": "Invalid email or password.",
    "auth/wrong-password": "Invalid email or password.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
  };
  return map[code] || "Something went wrong. Please try again.";
}