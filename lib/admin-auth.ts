import { NextRequest, NextResponse } from "next/server";

export function checkAdminKey(req: NextRequest): NextResponse | null {
  const key = req.headers.get("x-admin-key");
  const expected = process.env.ADMIN_KEY;
  // If ADMIN_KEY not set in env, allow (dev mode). Set it before launch.
  if (expected && key !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
