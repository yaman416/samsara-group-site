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

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const allowed = ["png", "jpg", "jpeg", "webp", "svg"];
  if (!allowed.includes(ext)) return NextResponse.json({ error: "Only PNG, JPG, WEBP or SVG allowed" }, { status: 400 });

  const path = `clubs/${clubId}/logo.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error: upErr } = await supabaseAdmin.storage
    .from("logos")
    .upload(path, bytes, { contentType: file.type, upsert: true });

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { data: { publicUrl } } = supabaseAdmin.storage.from("logos").getPublicUrl(path);

  const { error: dbErr } = await supabaseAdmin
    .from("clubs")
    .update({ logo_url: publicUrl })
    .eq("id", clubId);

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });

  return NextResponse.json({ logo_url: publicUrl });
}
