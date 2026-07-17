export type TrustedHeaderAccountUser = {
  id: string
  email: string | null
  user_metadata: Record<string, unknown>
}

export type TrustedHeaderAccountState = {
  user: TrustedHeaderAccountUser | null
  isAdmin: boolean
  isResolved: boolean
}

export function canApplyHeaderAuthResolution(
  requestVersion: number,
  currentVersion: number,
) {
  return requestVersion === currentVersion
}

export function resolveHeaderAuthEvent(
  currentVersion: number,
  event: string,
  hasUser: boolean,
) {
  const changesIdentity =
    event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED"

  if (!changesIdentity) {
    return {
      version: currentVersion,
      resolveIdentity: false,
      refresh: false,
      closeDialog: null,
    }
  }

  return {
    version: currentVersion + 1,
    resolveIdentity: true,
    refresh: true,
    closeDialog: hasUser ? "login" : "account",
  }
}

export function resolveHeaderLogoutOutcome(responseOk: boolean) {
  return responseOk
    ? {
        clearIdentity: true,
        closeAccount: true,
        refresh: true,
        toast: "success",
      }
    : {
        clearIdentity: false,
        closeAccount: false,
        refresh: false,
        toast: "error",
      }
}
