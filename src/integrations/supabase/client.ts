import { Database } from '@/integrations/supabase/types';
import { createClient } from '@neondatabase/neon-js';

export const supabase = createClient<Database>({
  url: import.meta.env.VITE_NEON_DATA_API_URL,
  auth: {
    baseURL: import.meta.env.VITE_NEON_AUTH_URL,
  },
});
