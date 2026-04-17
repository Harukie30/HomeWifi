/**
 * Admin session cookie — shared by middleware (Edge) and server auth.
 * Keep values in sync everywhere they are referenced.
 */
export const ADMIN_SESSION_COOKIE = "admin_session";

/**
 * Session marker stored in cookie.
 * Use ADMIN_SESSION_TOKEN in env for production.
 */
export function getAdminSessionValue(): string {
  const configured = process.env.ADMIN_SESSION_TOKEN?.trim();
  if (configured) return configured;
  return "dev-admin-session";
}
