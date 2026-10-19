export type HeaderAccountAction =
  | "admin-dashboard"
  | "edit-site-profile"
  | "edit-profile"
  | "logout"

export type HeaderAccountView =
  | { dialog: "pending"; role: null; actions: HeaderAccountAction[] }
  | { dialog: "login"; role: null; actions: HeaderAccountAction[] }
  | {
      dialog: "account"
      role: "admin"
      actions: HeaderAccountAction[]
    }
  | {
      dialog: "account"
      role: "regular"
      actions: HeaderAccountAction[]
    }

export function resolveHeaderAccountView(
  email: string | null,
  isAdmin: boolean,
  isAuthResolved = true,
): HeaderAccountView {
  if (!isAuthResolved) return { dialog: "pending", role: null, actions: [] }
  if (!email) return { dialog: "login", role: null, actions: [] }

  return isAdmin
    ? {
        dialog: "account",
        role: "admin",
        actions: ["admin-dashboard", "edit-site-profile", "logout"],
      }
    : {
        dialog: "account",
        role: "regular",
        actions: ["edit-profile", "logout"],
      }
}
