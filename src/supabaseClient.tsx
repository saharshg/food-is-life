import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_APP_URL as string,
  process.env.SUPABASE_CLIENT_SECRET as string
);
