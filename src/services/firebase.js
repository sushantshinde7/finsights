import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app        = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

/* ── Sign up with email + password ─────────────────────────── */
export const signUpWithEmail = async (firstName, lastName, email, password) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  // attach display name immediately so user object has it from the start
  await updateProfile(credential.user, {
    displayName: `${firstName} ${lastName}`,
  });

  return credential.user;
};

/* ── Sign in with email + password ─────────────────────────── */
export const signInWithEmail = async (email, password) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

/* ── Google sign-in popup ───────────────────────────────────── */
export const signInWithGoogle = async () => {
  const credential = await signInWithPopup(auth, googleProvider);
  return credential.user;
};

/* ── Sign out ────────────────────────────────────────────────── */
export const logOut = async () => {
  await signOut(auth);
};

/* ── Forgot password ─────────────────────────────────────────── */
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

/* ── Auth state listener (used in AuthContext) ───────────────── */
export { onAuthStateChanged };