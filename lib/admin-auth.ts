import { NextRequest, NextResponse } from "next/server";

export function checkAdminKey(req: NextRequest): NextResponse | null {
  const key = req.headers.get("x-admin-key");
  const expected = process.env.ADMIN_KEY;
  if (!expected) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }
  if (key !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
