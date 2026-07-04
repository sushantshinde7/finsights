import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AuthPages.css";

const RULES = [
  { id: "length", label: "8+ characters", test: (p) => p.length >= 8 },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    test: (p) => /[a-z]/.test(p),
  },
  { id: "number", label: "One number", test: (p) => /[0-9]/.test(p) },
];

export default function SignupPage() {
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setServerError("");
  };

  const passedRules = RULES.filter((r) => r.test(form.password));
  const allRulesMet = passedRules.length === RULES.length;

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";

    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email address";

    if (!form.password) e.password = "Password is required";
    else if (!allRulesMet) e.password = "Password doesn't meet requirements";

    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.password !== form.confirm)
      e.confirm = "Passwords do not match";

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
      await signup(form.firstName, form.lastName, form.email, form.password);
      navigate("/dashboard");
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
      navigate("/dashboard");
    } catch (err) {
      setServerError(firebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-branding">
        <div className="auth-branding-content">
          <h1>Finsights</h1>

          <h2>Take control of your finances.</h2>

          <p>
            Track expenses, manage budgets, and understand where your money goes
            with clear insights.
          </p>

          <ul className="auth-features">
            <li>✓ Expense Tracking</li>
            <li>✓ Budget Planning</li>
            <li>✓ Financial Analytics</li>
            <li>✓ Secure Cloud Storage</li>
          </ul>
          
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Start tracking your finances today</p>
        </div>

        {serverError && (
          <div className="auth-server-error" role="alert">
            {serverError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label">First name</label>
              <input
                className={`auth-input ${errors.firstName ? "auth-input--error" : ""}`}
                type="text"
                placeholder="Sushant"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                autoComplete="given-name"
                autoFocus
              />
              {errors.firstName && (
                <span className="auth-error">{errors.firstName}</span>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label">Last name</label>
              <input
                className={`auth-input ${errors.lastName ? "auth-input--error" : ""}`}
                type="text"
                placeholder="Shinde"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                autoComplete="family-name"
              />
              {errors.lastName && (
                <span className="auth-error">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className={`auth-input ${errors.email ? "auth-input--error" : ""}`}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              autoComplete="email"
            />
            {errors.email && <span className="auth-error">{errors.email}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              className={`auth-input ${errors.password ? "auth-input--error" : ""}`}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              onFocus={() => setPwFocused(true)}
              onBlur={() => setPwFocused(false)}
              autoComplete="new-password"
            />
            {errors.password && (
              <span className="auth-error">{errors.password}</span>
            )}

            {/* Live password rules — show while focused or password has value */}
            {(pwFocused || form.password) && (
              <ul className="pw-rules">
                {RULES.map((rule) => {
                  const passed = rule.test(form.password);
                  return (
                    <li
                      key={rule.id}
                      className={`pw-rule ${passed ? "pw-rule--pass" : ""}`}
                    >
                      <span className="pw-rule-icon" aria-hidden="true">
                        {passed ? "✓" : "○"}
                      </span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="auth-field">
            <label className="auth-label">Confirm password</label>
            <input
              className={`auth-input ${errors.confirm ? "auth-input--error" : ""}`}
              type="password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={(e) => update("confirm", e.target.value)}
              autoComplete="new-password"
            />
            {errors.confirm && (
              <span className="auth-error">{errors.confirm}</span>
            )}
          </div>

          <button className="auth-btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          className="auth-btn-google"
          onClick={handleGoogle}
          disabled={loading}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
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
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Invalid email address.",
    "auth/weak-password": "Password is too weak.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
  };
  return map[code] || "Something went wrong. Please try again.";
}
