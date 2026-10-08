import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Created on first use so builds without Supabase env vars (e.g. previews) still succeed.
let client: SupabaseClient | undefined;

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    client ??= createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
