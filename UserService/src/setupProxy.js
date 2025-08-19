const { createProxyMiddleware } = require("http-proxy-middleware");

/**
 * PUBLIC_INTERFACE
 * CRA dev server proxy to forward API requests to the backend.
 *
 * Reads:
 * - USERSERVICE_API_PROXY_TARGET: Preferred backend base URL for proxy (e.g., http://localhost:8000)
 * - REACT_APP_USERSERVICE_API_URL: Fallback backend base URL if the above is not set
 *
 * Routes forwarded:
 * - /auth/**
 * - /users/**
 *
 * Usage:
 * - In development, keep REACT_APP_USERSERVICE_API_URL empty to use relative paths,
 *   and set USERSERVICE_API_PROXY_TARGET to your backend URL.
 * - In production builds, set REACT_APP_USERSERVICE_API_URL to the full API base URL.
 */
module.exports = function setupProxy(app) {
  const target =
    process.env.USERSERVICE_API_PROXY_TARGET || process.env.REACT_APP_USERSERVICE_API_URL;

  if (!target) {
    // Non-fatal: app can still run, but relative API calls may 404 without a backend.
    // eslint-disable-next-line no-console
    console.warn(
      "[setupProxy] No proxy target configured. Set USERSERVICE_API_PROXY_TARGET or REACT_APP_USERSERVICE_API_URL to enable API proxying in development."
    );
    return;
  }

  const options = {
    target,
    changeOrigin: true,
    secure: false,
    logLevel: "warn",
  };

  app.use(
    ["/auth", "/users"],
    createProxyMiddleware(options)
  );
};
