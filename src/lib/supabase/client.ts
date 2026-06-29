import { createBrowserClient } from '@supabase/ssr';

/**
 * @param persist When false, the session is kept in sessionStorage instead of
 * localStorage so it doesn't survive closing the browser (used for "remember me").
 */
export const createClient = (persist: boolean = true) =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    persist
      ? undefined
      : {
          auth: {
            storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
          },
        }
  );
