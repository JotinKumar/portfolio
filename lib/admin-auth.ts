const configuredAdminEmail =
  process.env.ADMIN_EMAIL ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@jotin.in";

export const ADMIN_EMAIL = configuredAdminEmail.toLowerCase();

export function isAdminEmail(email?: string | null): boolean {
  return Boolean(email) && email!.toLowerCase() === ADMIN_EMAIL;
}
