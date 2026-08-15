import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function auth(req: NextRequest) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_KEY;
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const clubId = form.get("club_id") as string | null;

  if (!file || !clubId) return NextResponse.json({ error: "Missing file or club_id" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const allowedExts = ["png", "jpg", "jpeg", "webp"];
  if (!allowedExts.includes(ext)) return NextResponse.json({ error: "Only PNG, JPG, or WEBP allowed" }, { status: 400 });

  const allowedMimes = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedMimes.includes(file.type)) return NextResponse.json({ error: "Invalid file type" }, { status: 400 });

  if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: "File must be under 2MB" }, { status: 400 });

  const path = `clubs/${clubId}/logo.${ext}`;
  const bytes = await file.arrayBuffer();

  const mimeMap: Record<string, string> = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp" };
  const { error: upErr } = await supabaseAdmin.storage
    .from("club-logos")
    .upload(path, bytes, { contentType: mimeMap[ext], upsert: true });

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { data: { publicUrl } } = supabaseAdmin.storage.from("club-logos").getPublicUrl(path);

  const { error: dbErr } = await supabaseAdmin
    .from("clubs")
    .update({ logo_url: publicUrl })
    .eq("id", clubId);

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });

  return NextResponse.json({ logo_url: publicUrl });
}
