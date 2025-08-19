import axios from "axios";
import { getAuth, setAuth, clearAuth } from "../utils/storage";

// Normalize base URL (remove trailing slashes) for safe path joining.
// If not provided, keep empty string so CRA dev proxy can handle relative paths.
const RAW_BASE_URL = (process.env.REACT_APP_USERSERVICE_API_URL || "").trim();
const BASE_URL = RAW_BASE_URL ? RAW_BASE_URL.replace(/\/+$/, "") : "";

/**
 * Safely join a base URL and a path, avoiding double slashes.
 * If base is empty, ensures the path starts with a single leading slash.
 */
function joinUrl(base, path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

/**
 - PUBLIC_INTERFACE
 - Create a configured axios instance with auth headers and error handling.
 - This instance adds Authorization headers when an access_token is stored.
*/
export const api = axios.create({
  // Use relative baseURL when BASE_URL is empty so CRA setupProxy can forward requests in dev.
  baseURL: BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization header from storage
api.interceptors.request.use((config) => {
  const { access_token } = getAuth();
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

// Attempt refresh on 401 responses (if refresh token exists)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const { refresh_token } = getAuth();
      if (refresh_token) {
        try {
          // Use global axios (not the instance) to avoid interceptor recursion.
          const res = await axios.post(joinUrl(BASE_URL, "/auth/refresh"), {
            refresh_token,
          });
          const { access_token: newAccess, refresh_token: newRefresh, user } = res.data || {};
          if (newAccess) {
            setAuth({ access_token: newAccess, refresh_token: newRefresh || refresh_token, user });
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${newAccess}`;
            return api(original);
          }
        } catch {
          // fall through to logout on refresh failure
        }
      }
      clearAuth();
    }
    return Promise.reject(error);
  }
);

/**
 * Map FastAPI endpoints used by the frontend.
 * These functions only prepare requests; backend must implement endpoints accordingly.
 */

// PUBLIC_INTERFACE
export async function registerUser(payload) {
  /**
   Register a user via email/password or mobile/password.
   payload: { email?, mobile?, password, name? }
   Returns: { user, access_token, refresh_token }
  */
  const res = await api.post("/auth/register", payload);
  return res.data;
}

// PUBLIC_INTERFACE
export async function loginWithEmail({ email, password }) {
  /** Login with email and password. */
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

// PUBLIC_INTERFACE
export async function startMobileOtpLogin({ mobile }) {
  /** Start OTP login by sending an OTP to a mobile number. */
  const res = await api.post("/auth/mobile/start", { mobile });
  return res.data;
}

// PUBLIC_INTERFACE
export async function verifyMobileOtp({ mobile, otp }) {
  /** Verify OTP and obtain tokens. */
  const res = await api.post("/auth/mobile/verify", { mobile, otp });
  return res.data;
}

// PUBLIC_INTERFACE
export function getSocialLoginUrl(provider) {
  /**
   Returns a URL to redirect the user for social login (e.g., Google, GitHub).
   The backend is expected to handle OAuth redirects and callback.
  */
  const siteUrl = process.env.REACT_APP_SITE_URL || window.location.origin;
  // e.g., backend should use this redirect URL to send back the auth code
  const redirect = encodeURIComponent(`${siteUrl}/auth/callback/${provider}`);
  const loginPath = `/auth/social/${provider}/login`;
  return `${joinUrl(BASE_URL, loginPath)}?redirect_uri=${redirect}`;
}

// PUBLIC_INTERFACE
export async function completeSocialLogin({ provider, code, state }) {
  /**
   Complete OAuth flow by exchanging the code for tokens.
   Returns: { user, access_token, refresh_token }
  */
  const res = await api.post(`/auth/social/${provider}/callback`, { code, state });
  return res.data;
}

// PUBLIC_INTERFACE
export async function requestPasswordReset({ email }) {
  /** Request a password reset link to be emailed to the user. */
  const siteUrl = process.env.REACT_APP_SITE_URL || window.location.origin;
  const res = await api.post("/auth/password/forgot", {
    email,
    redirect_url: `${siteUrl}/password/reset`,
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function resetPassword({ token, new_password }) {
  /** Reset a user's password with a valid token. */
  const res = await api.post("/auth/password/reset", { token, new_password });
  return res.data;
}

// PUBLIC_INTERFACE
export async function fetchProfile() {
  /** Retrieve the current user's profile. */
  const res = await api.get("/users/me");
  return res.data;
}

// PUBLIC_INTERFACE
export async function updateProfile(payload) {
  /** Update the current user's profile fields. */
  const res = await api.put("/users/me", payload);
  return res.data;
}

// PUBLIC_INTERFACE
export async function logoutApi() {
  /** Invalidate refresh tokens server-side (optional depending on backend). */
  try {
    await api.post("/auth/logout");
  } catch {
    // ignore if backend doesn't implement this
  }
}
