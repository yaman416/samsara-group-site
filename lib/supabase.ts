import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser client — safe to use in "use client" components.
// Created on first use so builds without Supabase env vars (e.g. previews) still succeed.
let client: SupabaseClient | undefined;

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    client ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
