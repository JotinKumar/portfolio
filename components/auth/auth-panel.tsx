"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import type { User } from "@supabase/supabase-js"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type LoginFormValues = z.infer<typeof loginSchema>
type SignupFormValues = z.infer<typeof signupSchema>

type AuthPanelProps = {
  onAuthenticated?: (user: User) => void
  redirectTo?: string
}

export function AuthPanel({ onAuthenticated, redirectTo }: AuthPanelProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<"login" | "signup">("login")
  const router = useRouter()

  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  })

  function finishAuthentication(user: User) {
    onAuthenticated?.(user)
    if (redirectTo) router.push(redirectTo)
    router.refresh()
  }

  function getCallbackUrl() {
    const next =
      redirectTo ??
      `${window.location.pathname}${window.location.search}${window.location.hash}`
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
  }

  async function handleEmailLogin(data: LoginFormValues) {
    if (!hasSupabaseConfig) {
      toast.error("Authentication is not configured")
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast.error(error.message || "Login failed")
        return
      }

      toast.success("Logged in successfully")
      finishAuthentication(authData.user)
    } catch {
      toast.error("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSignup(data: SignupFormValues) {
    if (!hasSupabaseConfig) {
      toast.error("Authentication is not configured")
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { emailRedirectTo: getCallbackUrl() },
      })

      if (error) {
        toast.error(error.message || "Sign up failed")
        return
      }

      if (signUpData.session) {
        toast.success("Account created successfully")
        finishAuthentication(signUpData.session.user)
        return
      }

      toast.success("Account created. Check your email to confirm your account.")
      setMode("login")
      signupForm.reset({ email: data.email, password: "", confirmPassword: "" })
    } catch {
      toast.error("An error occurred during sign up")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleLogin() {
    if (!hasSupabaseConfig) {
      toast.error("Authentication is not configured")
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: getCallbackUrl() },
      })

      if (error) toast.error(error.message || "Google login failed")
    } catch {
      toast.error("An error occurred during Google login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-semibold">
          {mode === "login" ? "User Login" : "Create Account"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {mode === "login"
            ? "Sign in to continue"
            : "Sign up with email and password"}
        </p>
      </div>

      {mode === "login" ? (
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(handleEmailLogin)}
            className="space-y-4"
          >
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="you@example.com"
                      type="email"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your password"
                      type="password"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !hasSupabaseConfig}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...signupForm}>
          <form
            onSubmit={signupForm.handleSubmit(handleSignup)}
            className="space-y-4"
          >
            <FormField
              control={signupForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="you@example.com"
                      type="email"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="At least 8 characters"
                      type="password"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Re-enter your password"
                      type="password"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !hasSupabaseConfig}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </Form>
      )}

      <div className="space-y-3">
        {mode === "login" && (
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoading || !hasSupabaseConfig}
          >
            Continue with Google
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          disabled={isLoading}
        >
          {mode === "login"
            ? "New user? Create an account"
            : "Already have an account? Login"}
        </Button>
      </div>
    </div>
  )
}
