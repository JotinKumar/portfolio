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
  currentUserId: string | null,
  eventUserId: string | null,
) {
  const noChange = {
    version: currentVersion,
    resolveIdentity: false,
    clearIdentity: false,
    refresh: false,
    closeDialog: null,
  }
  const isSameUser =
    Boolean(currentUserId) && Boolean(eventUserId) && currentUserId === eventUserId

  if (event === "SIGNED_IN" && isSameUser) return noChange

  if (event === "USER_UPDATED" && isSameUser) {
    return {
      version: currentVersion + 1,
      resolveIdentity: true,
      clearIdentity: false,
      refresh: true,
      closeDialog: null,
    }
  }

  const changesIdentity =
    event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED"

  if (!changesIdentity) return noChange

  return {
    version: currentVersion + 1,
    resolveIdentity: true,
    clearIdentity: true,
    refresh: true,
    closeDialog: "all",
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
