import { NextResponse } from "next/server"

import { isAdminEmail } from "@/lib/admin-auth"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ user: null, isAdmin: false })
    }

    const metadata = user.user_metadata ?? {}
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email ?? null,
        user_metadata: {
          avatar_url: metadata.avatar_url,
          display_name: metadata.display_name,
          full_name: metadata.full_name,
        },
      },
      isAdmin: isAdminEmail(user.email),
    })
  } catch {
    return NextResponse.json(
      { error: "Unable to resolve account" },
      { status: 500 },
    )
  }
}
