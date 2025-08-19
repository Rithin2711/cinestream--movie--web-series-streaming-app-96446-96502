const NAMESPACE = "cinestream.userservice";

/**
 * Safely parse JSON from a string.
 * @param {string} value
 * @returns {any|null}
 */
function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/**
 * Build a namespaced key to avoid collisions across apps.
 * @param {string} key
 * @returns {string}
 */
function ns(key) {
  return `${NAMESPACE}.${key}`;
}

// PUBLIC_INTERFACE
export function setItem(key, value) {
  /** Store a value in localStorage under a namespaced key. */
  if (value === undefined) return;
  const toStore = typeof value === "string" ? value : JSON.stringify(value);
  localStorage.setItem(ns(key), toStore);
}

// PUBLIC_INTERFACE
export function getItem(key) {
  /** Retrieve a value from localStorage and attempt JSON parsing. */
  const raw = localStorage.getItem(ns(key));
  if (raw == null) return null;
  const parsed = safeParse(raw);
  return parsed !== null ? parsed : raw;
}

// PUBLIC_INTERFACE
export function removeItem(key) {
  /** Remove a namespaced item from localStorage. */
  localStorage.removeItem(ns(key));
}

// PUBLIC_INTERFACE
export function clearAuth() {
  /** Clears auth-related items. */
  removeItem("access_token");
  removeItem("refresh_token");
  removeItem("user");
}

// PUBLIC_INTERFACE
export function setAuth({ access_token, refresh_token, user }) {
  /** Save auth tokens and user object. */
  if (access_token) setItem("access_token", access_token);
  if (refresh_token) setItem("refresh_token", refresh_token);
  if (user) setItem("user", user);
}

// PUBLIC_INTERFACE
export function getAuth() {
  /** Retrieve auth tokens and user object if present. */
  return {
    access_token: getItem("access_token"),
    refresh_token: getItem("refresh_token"),
    user: getItem("user"),
  };
}
