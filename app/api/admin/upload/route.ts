import { NextResponse } from "next/server";
import { createSupabaseSecretClient } from "@/lib/supabase-secret";
import { getUser } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin-auth";

const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "site-assets";

function sanitizeFolder(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9/_-]/g, "-")
    .replace(/\/+/g, "/")
    .replace(/^\/+|\/+$/g, "");
}

function safeFileName(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9/_-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^[-_]+|[-_]+$/g, "") || "asset"
  );
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = sanitizeFolder(String(formData.get("folder") ?? "admin"));

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "File is empty" }, { status: 400 });
  }

  const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml", "application/pdf"]);
  if (!allowedTypes.has(file.type) && !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const supabase = createSupabaseSecretClient();
  const extension = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() ?? "" : "";
  const prefix = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const path = extension ? `${prefix}.${extension}` : prefix;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await supabase.storage.from(DEFAULT_BUCKET).upload(path, bytes, {
    contentType: file.type || "application/octet-stream",
    upsert: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path, bucket: DEFAULT_BUCKET });
}
