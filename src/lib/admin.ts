export const ADMIN_EMAIL = "juank.gagliano@gmail.com";

export function isAdminEmail(email: string | null | undefined) {
  return (email ?? "").trim().toLowerCase() === ADMIN_EMAIL;
}
