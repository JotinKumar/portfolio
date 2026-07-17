"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, LogOut, Settings, UserRound } from "lucide-react"
import { toast } from "sonner"

import { AuthPanel } from "@/components/auth/auth-panel"
import { HeaderAccountBranch } from "@/components/layout/header-account-branch"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { resolveHeaderAccountView } from "@/lib/header-account-state"
import {
  canApplyHeaderAuthResolution,
  resolveHeaderAuthEvent,
  resolveHeaderLogoutOutcome,
  type TrustedHeaderAccountState,
  type TrustedHeaderAccountUser,
} from "@/lib/header-auth-lifecycle"
import { createClient } from "@/lib/supabase"

function getAccountLabel(user: TrustedHeaderAccountUser) {
  const metadata = user.user_metadata
  const label = metadata.display_name || metadata.full_name || user.email
  return typeof label === "string" && label.trim() ? label : "Account"
}

function getInitials(label: string) {
  const words = label.trim().split(/\s+/).filter(Boolean)
  if (words.length > 1) return `${words[0][0]}${words[1][0]}`.toUpperCase()
  return label.slice(0, 2).toUpperCase()
}

export function HeaderAccountControl() {
  const router = useRouter()
  const [authState, setAuthState] = useState<TrustedHeaderAccountState>({
    user: null,
    isAdmin: false,
    isResolved: false,
  })
  const authVersionRef = useRef(0)
  const [loginOpen, setLoginOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function resolveTrustedIdentity(requestVersion: number) {
      try {
        const response = await fetch("/api/auth/header-account", {
          cache: "no-store",
        })
        if (!response.ok) throw new Error("Unable to resolve account")

        const result = (await response.json()) as Omit<
          TrustedHeaderAccountState,
          "isResolved"
        >
        if (
          !isMounted ||
          !canApplyHeaderAuthResolution(requestVersion, authVersionRef.current)
        ) {
          return
        }

        setAuthState({ ...result, isResolved: true })
      } catch {
        // Keep the control pending when trusted identity or role cannot be resolved.
      }
    }

    void resolveTrustedIdentity(authVersionRef.current)

    let unsubscribe: (() => void) | undefined
    try {
      const supabase = createClient()
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (!isMounted) return
        if (event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") return

        const transition = resolveHeaderAuthEvent(
          authVersionRef.current,
          event,
          Boolean(session?.user),
        )
        if (!transition.resolveIdentity) return

        authVersionRef.current = transition.version
        setAuthState({ user: null, isAdmin: false, isResolved: false })
        if (transition.closeDialog === "login") setLoginOpen(false)
        if (transition.closeDialog === "account") setAccountOpen(false)
        if (transition.refresh) router.refresh()
        void resolveTrustedIdentity(transition.version)
      })
      unsubscribe = () => data.subscription.unsubscribe()
    } catch {
      // The trusted endpoint can still resolve logged-out state without a browser client.
    }

    return () => {
      isMounted = false
      unsubscribe?.()
    }
  }, [router])

  const view = resolveHeaderAccountView(
    authState.user?.email ?? null,
    authState.isAdmin,
    authState.isResolved,
  )
  const accountLabel = authState.user ? getAccountLabel(authState.user) : "Account"
  const avatarUrl =
    typeof authState.user?.user_metadata.avatar_url === "string"
      ? authState.user.user_metadata.avatar_url
      : undefined

  function handleAuthenticated() {
    setLoginOpen(false)
    router.refresh()
  }

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })
      const outcome = resolveHeaderLogoutOutcome(response.ok)

      if (!outcome.clearIdentity) {
        toast.error("Unable to log out. Please try again.")
        return
      }

      authVersionRef.current += 1
      if (outcome.clearIdentity) {
        setAuthState({ user: null, isAdmin: false, isResolved: true })
      }
      if (outcome.closeAccount) setAccountOpen(false)
      if (outcome.refresh) router.refresh()
      toast.success("Logged out successfully")
    } catch {
      toast.error("Unable to log out. Please try again.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <HeaderAccountBranch
      view={view}
      login={
        <div data-auth-state="logged-out">
          <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
            <DialogTrigger asChild>
              <Button
                data-account-state="logged-out"
                variant="outline"
                size="icon"
                className="rounded-none"
                aria-label="Login"
              >
                <UserRound className="size-5" />
                <span className="sr-only">Login</span>
              </Button>
            </DialogTrigger>
            <div data-dialog-purpose="login">
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Login</DialogTitle>
                  <DialogDescription>
                    Sign in or create an account to continue.
                  </DialogDescription>
                </DialogHeader>
                <AuthPanel onAuthenticated={handleAuthenticated} />
              </DialogContent>
            </div>
          </Dialog>
        </div>
      }
      account={
        <div data-auth-state="authenticated">
          <Dialog open={accountOpen} onOpenChange={setAccountOpen}>
            <DialogTrigger asChild>
              <Button
                data-account-state="authenticated"
                variant="outline"
                size="icon"
                className="rounded-none"
                aria-label="Open account menu"
              >
                {avatarUrl ? (
                  <span data-account-avatar-image="true" className="size-7 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${JSON.stringify(avatarUrl)})` }}
                    role="img"
                    aria-label={`${accountLabel} avatar`}
                  />
                ) : (
                  <span data-account-avatar-image="true" className="flex size-7 items-center justify-center rounded-full bg-primary/12 text-xs font-semibold"
                    aria-hidden="true"
                  >
                    {getInitials(accountLabel)}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <div data-dialog-purpose="account">
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Account</DialogTitle>
                  <DialogDescription>{accountLabel}</DialogDescription>
                </DialogHeader>

                <div className="grid gap-2">
                  <div data-account-role="admin" className="grid gap-2">
                    {view.role === "admin" ? (
                      <>
                        {view.actions.includes("admin-dashboard") ? (
                          <Button variant="outline" asChild>
                            <Link href="/admin/dashboard" onClick={() => setAccountOpen(false)}>
                              <LayoutDashboard />
                              Admin dashboard
                            </Link>
                          </Button>
                        ) : null}
                        {view.actions.includes("edit-site-profile") ? (
                          <Button variant="outline" asChild>
                            <Link href="/admin/settings" onClick={() => setAccountOpen(false)}>
                              <Settings />
                              Site settings
                            </Link>
                          </Button>
                        ) : null}
                      </>
                    ) : null}
                  </div>

                  <div data-account-role="regular">
                    {view.role === "regular" && view.actions.includes("edit-profile") ? (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/account/profile" onClick={() => setAccountOpen(false)}>
                          <UserRound />
                          Edit profile
                        </Link>
                      </Button>
                    ) : null}
                  </div>

                  {view.actions.includes("logout") ? (
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      <LogOut />
                      {isLoggingOut ? "Logging out..." : "Log out"}
                    </Button>
                  ) : null}
                </div>
              </DialogContent>
            </div>
          </Dialog>
        </div>
      }
    />
  )
}
