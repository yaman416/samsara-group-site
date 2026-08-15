import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return new NextResponse("Invalid link.", { status: 400 });

  const { error } = await supabaseAdmin
    .from("subscribers")
    .delete()
    .eq("unsubscribe_token", token);

  if (error) return new NextResponse("Something went wrong.", { status: 500 });

  return new NextResponse(
    `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;max-width:500px;margin:80px auto;text-align:center;">
<h2>You've been unsubscribed.</h2>
<p style="color:#666;">You won't receive any more emails from Samsara Premier League.</p>
</body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
