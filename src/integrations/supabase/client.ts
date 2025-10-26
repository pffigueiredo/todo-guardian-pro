import { Database } from '@/integrations/supabase/types';
import { createClient } from '@neondatabase/neon-js';

export const supabase = createClient<Database>({
  url: import.meta.env.VITE_NEON_DATA_API_URL,
  auth: {
    tokenStore: 'cookie',
    projectId: import.meta.env.VITE_STACK_PROJECT_ID,
    publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY,
  },
});
