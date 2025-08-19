import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  registerUser,
  loginWithEmail,
  startMobileOtpLogin,
  verifyMobileOtp,
  completeSocialLogin,
  requestPasswordReset,
  resetPassword,
  fetchProfile,
  updateProfile,
  logoutApi,
} from "../api/client";
import { getAuth, setAuth, clearAuth } from "../utils/storage";

export const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AuthProvider wraps the app and provides auth state and actions.
 * Exposes:
 *  - user, loading, error
 *  - loginEmail, startOtpLogin, verifyOtp, register, refreshProfile
 *  - requestPwdReset, resetPwd, logout, updateUserProfile
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(getAuth().user || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize auth state from storage
  useEffect(() => {
    const { user: existingUser } = getAuth();
    if (existingUser) setUser(existingUser);
  }, []);

  const setSession = useCallback(({ user, access_token, refresh_token }) => {
    if (access_token || refresh_token || user) {
      setAuth({ user, access_token, refresh_token });
      if (user) setUser(user);
    }
  }, []);

  // PUBLIC_INTERFACE
  const register = useCallback(async (payload) => {
    /** Register a new user. Returns user object. */
    setLoading(true);
    setError(null);
    try {
      const data = await registerUser(payload);
      setSession(data);
      return data?.user;
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [setSession]);

  // PUBLIC_INTERFACE
  const loginEmail = useCallback(async ({ email, password }) => {
    /** Login using email and password. */
    setLoading(true);
    setError(null);
    try {
      const data = await loginWithEmail({ email, password });
      setSession(data);
      return data?.user;
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [setSession]);

  // PUBLIC_INTERFACE
  const startOtpLogin = useCallback(async ({ mobile }) => {
    /** Start OTP login by sending code to mobile. */
    setLoading(true);
    setError(null);
    try {
      const data = await startMobileOtpLogin({ mobile });
      return data;
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // PUBLIC_INTERFACE
  const verifyOtp = useCallback(async ({ mobile, otp }) => {
    /** Verify OTP login and set session. */
    setLoading(true);
    setError(null);
    try {
      const data = await verifyMobileOtp({ mobile, otp });
      setSession(data);
      return data?.user;
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [setSession]);

  // PUBLIC_INTERFACE
  const handleSocialCallback = useCallback(async ({ provider, code, state }) => {
    /** Complete social login and set session. */
    setLoading(true);
    setError(null);
    try {
      const data = await completeSocialLogin({ provider, code, state });
      setSession(data);
      return data?.user;
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [setSession]);

  // PUBLIC_INTERFACE
  const requestPwdReset = useCallback(async ({ email }) => {
    /** Request password reset link. */
    setLoading(true);
    setError(null);
    try {
      return await requestPasswordReset({ email });
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // PUBLIC_INTERFACE
  const resetPwd = useCallback(async ({ token, new_password }) => {
    /** Reset password using token. */
    setLoading(true);
    setError(null);
    try {
      return await resetPassword({ token, new_password });
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // PUBLIC_INTERFACE
  const refreshProfile = useCallback(async () => {
    /** Fetch the latest profile and update session. */
    setLoading(true);
    setError(null);
    try {
      const profile = await fetchProfile();
      setSession({ user: profile });
      return profile;
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [setSession]);

  // PUBLIC_INTERFACE
  const updateUserProfile = useCallback(async (payload) => {
    /** Update profile and refresh. */
    setLoading(true);
    setError(null);
    try {
      const updated = await updateProfile(payload);
      setSession({ user: updated });
      return updated;
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [setSession]);

  // PUBLIC_INTERFACE
  const logout = useCallback(async () => {
    /** Logout user and clear session. */
    try {
      await logoutApi();
    } catch {
      // ignore network/logout errors
    } finally {
      clearAuth();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      register,
      loginEmail,
      startOtpLogin,
      verifyOtp,
      handleSocialCallback,
      requestPwdReset,
      resetPwd,
      refreshProfile,
      updateUserProfile,
      logout,
    }),
    [
      user,
      loading,
      error,
      register,
      loginEmail,
      startOtpLogin,
      verifyOtp,
      handleSocialCallback,
      requestPwdReset,
      resetPwd,
      refreshProfile,
      updateUserProfile,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
