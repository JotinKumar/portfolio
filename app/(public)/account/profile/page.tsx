import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { AccountProfileForm } from "@/components/account/account-profile-form"
import { isAdminEmail } from "@/lib/admin-auth"
import { getUser } from "@/lib/supabase-server"

export const metadata: Metadata = {
  title: "Account profile",
  description: "Update your personal account profile.",
}

function getMetadataValue(metadata: Record<string, unknown>, key: string) {
  const value = metadata[key]
  return typeof value === "string" ? value : ""
}

export default async function AccountProfilePage() {
  const user = await getUser()

  if (!user) {
    redirect("/?login=1")
  }

  if (isAdminEmail(user.email)) {
    redirect("/admin/settings")
  }

  const userMetadata = user.user_metadata ?? {}

  return (
    <div className="mx-auto w-full max-w-2xl py-12">
      <AccountProfileForm
        email={user.email ?? ""}
        displayName={getMetadataValue(userMetadata, "display_name")}
        avatarUrl={getMetadataValue(userMetadata, "avatar_url")}
        bio={getMetadataValue(userMetadata, "bio")}
      />
    </div>
  )
}
