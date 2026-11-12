import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

export const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file'
];

const provider = new GoogleAuthProvider();
SCOPES.forEach(scope => provider.addScope(scope));
provider.setCustomParameters({
  prompt: 'select_account'
});

const TOKEN_STORAGE_KEY = 'mmtb_google_oauth_token_v1';
let isSigningIn = false;
let cachedAccessToken: string | null = null;
let currentUser: User | null = null;

// Initialize cached token from sessionStorage
try {
  cachedAccessToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
} catch {}

/**
 * Initialize Firebase Auth listener and handle redirect results
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  // Check if returning from signInWithRedirect (especially useful for GitHub Pages and mobile)
  getRedirectResult(auth)
    .then(result => {
      if (result) {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          cachedAccessToken = credential.accessToken;
          try {
            sessionStorage.setItem(TOKEN_STORAGE_KEY, credential.accessToken);
          } catch {}
        }
        currentUser = result.user;
        if (onAuthSuccess) {
          onAuthSuccess(result.user, cachedAccessToken);
        }
      }
    })
    .catch(err => {
      console.warn("Redirect natijasini olişda:", err);
    });

  return onAuthStateChanged(auth, async (user: User | null) => {
    currentUser = user;
    if (user) {
      const token = cachedAccessToken || sessionStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        cachedAccessToken = token;
      }
      if (onAuthSuccess) {
        onAuthSuccess(user, cachedAccessToken);
      }
    } else {
      cachedAccessToken = null;
      try {
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      } catch {}
      if (onAuthFailure) {
        onAuthFailure();
      }
    }
  });
};

/**
 * Standard Popup Sign-In with fallback & friendly errors for GitHub Pages
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Google hisobidan kiriş tokeni olinmadi");
    }

    cachedAccessToken = credential.accessToken;
    try {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, credential.accessToken);
    } catch {}
    currentUser = result.user;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Google kirişda xatolik:", error);

    // Provide friendly diagnostic guidance for GitHub Pages
    if (error.code === 'auth/unauthorized-domain') {
      const currentHost = window.location.hostname;
      error.customExplanation =
        `GitHub Pages domeni (${currentHost}) Firebase loyihasida ruxsat berilgan domenlar röyxatiga qöşilişi lozim.`;
      error.domainToAdd = currentHost;
      error.projectId = firebaseConfig.projectId;
    } else if (error.code === 'auth/popup-blocked') {
      error.customExplanation =
        "Brauzer oçiluvçi oynani (popup) blokladi. Iltimos, oçiluvçi oynalarga ruxsat bering yoki sahifani yönaltiriş (redirect) tugmasidan foydalaning.";
    }

    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Redirect-based Sign-In (alternative if popups are blocked on GitHub Pages or mobile)
 */
export const googleSignInRedirect = async (): Promise<void> => {
  try {
    await signInWithRedirect(auth, provider);
  } catch (error: any) {
    if (error.code === 'auth/unauthorized-domain') {
      error.customExplanation =
        `GitHub Pages domeni (${window.location.hostname}) Firebase loyihasida ruxsat berilgan domenlar röyxatiga qöşilişi lozim.`;
    }
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (cachedAccessToken) return cachedAccessToken;
  try {
    const stored = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) {
      cachedAccessToken = stored;
      return stored;
    }
  } catch {}
  return null;
};

export const getCurrentUser = (): User | null => {
  return currentUser || auth.currentUser;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  currentUser = null;
  try {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {}
};
