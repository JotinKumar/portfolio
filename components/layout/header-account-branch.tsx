import type { ReactNode } from "react"

import type { HeaderAccountView } from "@/lib/header-account-state"

export function HeaderAccountBranch({
  view,
  login,
  account,
}: {
  view: HeaderAccountView
  login: ReactNode
  account: ReactNode
}) {
  if (view.dialog === "pending") return null
  return view.dialog === "login" ? login : account
}
