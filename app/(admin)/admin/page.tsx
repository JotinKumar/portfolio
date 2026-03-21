"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";
import { isAdminEmail } from "@/lib/admin-auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    if (!hasSupabaseConfig) {
      toast.error("Authentication is not configured");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message || "Login failed");
        return;
      }

      if (authData.user) {
        if (!isAdminEmail(authData.user.email)) {
          await supabase.auth.signOut();
          toast.error("This account is not authorized for admin access");
          return;
        }
        toast.success("Login successful!");
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto flex w-full max-w-[1280px] px-4">
      <Card className="mx-auto w-full max-w-md border-border/70 bg-card/88">
        <CardHeader className="space-y-3 text-center">
          <p className="kicker text-muted-foreground">Admin Access</p>
          <CardTitle className="type-section-title text-[2rem]">Sign In</CardTitle>
          <CardDescription className="type-body text-muted-foreground">
            Enter your admin credentials to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="admin@jotin.in"
                        type="email"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
