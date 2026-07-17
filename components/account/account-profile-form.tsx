"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  getAccountProfileMetadata,
  shouldResetAccountProfile,
} from "@/lib/account-profile-state"
import { createClient } from "@/lib/supabase"

const accountProfileSchema = z.object({
  display_name: z.string().trim().max(80, "Display name must be 80 characters or fewer"),
  avatar_url: z
    .string()
    .trim()
    .max(2048, "Avatar URL is too long")
    .refine((value) => !value || URL.canParse(value), "Enter a valid avatar URL"),
  bio: z.string().trim().max(500, "Bio must be 500 characters or fewer"),
})

type AccountProfileValues = z.infer<typeof accountProfileSchema>

type AccountProfileFormProps = {
  userId: string
  email: string
  displayName: string
  avatarUrl: string
  bio: string
}

export function AccountProfileForm({
  userId,
  email,
  displayName,
  avatarUrl,
  bio,
}: AccountProfileFormProps) {
  const router = useRouter()
  const [feedback, setFeedback] = useState("")
  const initialMetadata = getAccountProfileMetadata(displayName, avatarUrl, bio)
  const lastUserIdRef = useRef(userId)
  const lastMetadataRef = useRef(initialMetadata)
  const form = useForm<AccountProfileValues>({
    resolver: zodResolver(accountProfileSchema),
    defaultValues: initialMetadata,
  })

  useEffect(() => {
    const nextMetadata = getAccountProfileMetadata(displayName, avatarUrl, bio)
    const previousMetadata = lastMetadataRef.current
    const metadataChanged =
      previousMetadata.display_name !== nextMetadata.display_name ||
      previousMetadata.avatar_url !== nextMetadata.avatar_url ||
      previousMetadata.bio !== nextMetadata.bio

    if (
      !shouldResetAccountProfile({
        currentUserId: lastUserIdRef.current,
        nextUserId: userId,
        isDirty: form.formState.isDirty,
        metadataChanged,
      })
    ) {
      return
    }

    form.reset(nextMetadata)
    lastUserIdRef.current = userId
    lastMetadataRef.current = nextMetadata
    setFeedback("")
  }, [avatarUrl, bio, displayName, form, form.formState.isDirty, userId])

  async function onSubmit(values: AccountProfileValues) {
    setFeedback("")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: values.display_name,
          avatar_url: values.avatar_url,
          bio: values.bio,
        },
      })

      if (error) {
        const message = error.message || "Unable to update your profile. Please try again."
        setFeedback(message)
        toast.error(message)
        return
      }

      const message = "Profile updated successfully"
      form.reset(values)
      setFeedback(message)
      toast.success(message)
      router.refresh()
    } catch {
      const message = "Unable to update your profile. Please try again."
      setFeedback(message)
      toast.error(message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account profile</CardTitle>
        <CardDescription>
          Manage the personal details shown for your signed-in account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <FormLabel htmlFor="account-email">Email</FormLabel>
              <Input id="account-email" type="email" value={email} readOnly aria-readonly="true" />
              <p className="type-meta text-muted-foreground">
                Your sign-in email cannot be changed here.
              </p>
            </div>

            <FormField
              control={form.control}
              name="display_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="name" placeholder="Your display name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" inputMode="url" placeholder="https://example.com/avatar.jpg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={6} placeholder="A short introduction" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {feedback ? (
              <p className="type-body text-muted-foreground" role="status" aria-live="polite">
                {feedback}
              </p>
            ) : null}

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
