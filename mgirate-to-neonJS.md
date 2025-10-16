## Migrating from SupabaseJS to NeonJS


1. Create a Neon Project and Enable Data API

2. Run SQL migrations in the Neon database   

3. Replace `@supabase/supabase-js` with `neon-js` in your project.
   
```diff
- "@supabase/supabase-js": "^2.74.0",
+ "neon-js": "file:../../neon/neon-js"
```

4. Grab .env variables from Neon dashboard.

```env
VITE_NEON_DATA_API_URL=
VITE_STACK_PROJECT_ID=
VITE_STACK_PUBLISHABLE_CLIENT_KEY=
```

5. Update the client configuration to use NeonJS.
```ts
import { createClient } from 'neon-js';

export const supabase = createClient({
  url: import.meta.env.VITE_NEON_DATA_API_URL,
  auth: {
    tokenStore: 'cookie',
    projectId: import.meta.env.VITE_STACK_PROJECT_ID,
    publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY,
  },
});
```

