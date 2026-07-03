import { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  logOut,
  resetPassword,
  onAuthStateChanged,
} from "../services/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // Firebase user object or null
  const [loading, setLoading] = useState(true);   // true while Firebase checks session

  /* ── Listen for auth state changes ─────────────────────────
     This fires once on app load (restores session automatically)
     and again whenever user signs in or out.
  ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // null if signed out, user object if signed in
      setLoading(false);
    });

    return unsubscribe; // cleanup listener on unmount
  }, []);

  /* ── Auth actions ───────────────────────────────────────────── */
  const signup = async (firstName, lastName, email, password) => {
    const firebaseUser = await signUpWithEmail(firstName, lastName, email, password);
    setUser(firebaseUser);
    return firebaseUser;
  };

  const login = async (email, password) => {
    const firebaseUser = await signInWithEmail(email, password);
    setUser(firebaseUser);
    return firebaseUser;
  };

  const loginWithGoogle = async () => {
    const firebaseUser = await signInWithGoogle();
    setUser(firebaseUser);
    return firebaseUser;
  };

  const logout = async () => {
    await logOut();
    setUser(null);
  };

  const forgotPassword = async (email) => {
    await resetPassword(email);
  };

  /* ── Derived values ─────────────────────────────────────────── */
  const value = {
    user,
    loading,

    isAuthenticated: user !== null,
    isGuest:         user === null,

    // convenient shortcuts
    displayName: user?.displayName  || null,
    firstName:   user?.displayName?.split(" ")[0] || null,
    email:       user?.email        || null,
    photoURL:    user?.photoURL     || null,

    // actions
    signup,
    login,
    loginWithGoogle,
    logout,
    forgotPassword,
  };

  /* ── Don't render children until Firebase resolves session ─── */
  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontSize: "14px",
        color: "var(--color-text-secondary)",
      }}>
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}