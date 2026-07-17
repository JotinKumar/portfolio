"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
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
import { isAdminEmail } from "@/lib/admin-auth"
import { resolveHeaderAccountView } from "@/lib/header-account-state"
import { createClient } from "@/lib/supabase"

function getAccountLabel(user: User) {
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
  const [user, setUser] = useState<User | null>(null)
  const [isAuthResolved, setIsAuthResolved] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    let isMounted = true

    try {
      const supabase = createClient()
      void supabase.auth
        .getUser()
        .then(({ data }) => {
          if (isMounted) {
            setUser(data.user)
            setIsAuthResolved(true)
          }
        })
        .catch(() => {
          if (isMounted) {
            setUser(null)
            setIsAuthResolved(true)
          }
        })

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (isMounted) {
          setUser(session?.user ?? null)
          setIsAuthResolved(true)
        }
      })

      return () => {
        isMounted = false
        data.subscription.unsubscribe()
      }
    } catch {
      setUser(null)
      setIsAuthResolved(true)
      return () => {
        isMounted = false
      }
    }
  }, [])

  const view = resolveHeaderAccountView(
    user?.email ?? null,
    isAdminEmail(user?.email),
    isAuthResolved,
  )
  const accountLabel = user ? getAccountLabel(user) : "Account"
  const avatarUrl =
    typeof user?.user_metadata.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : undefined

  function handleAuthenticated(authenticatedUser: User) {
    setUser(authenticatedUser)
    setLoginOpen(false)
    router.refresh()
  }

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })
      if (!response.ok) throw new Error("Logout failed")

      setUser(null)
      setAccountOpen(false)
      router.refresh()
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
