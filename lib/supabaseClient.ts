import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly in dev if env vars are missing, rather than a silent broken client
  console.warn(
    'Missing Supabase env vars — check .env.local against .env.local.example'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
