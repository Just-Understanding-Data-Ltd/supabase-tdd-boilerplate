import { createClient } from '@supabase/supabase-js';
/**
 * Creates a typed Supabase client instance.
 *
 * @example
 * ```typescript
 * // Using environment variables
 * const supabase = createSupabaseClient({
 *   supabaseUrl: process.env.SUPABASE_URL!,
 *   supabaseKey: process.env.SUPABASE_ANON_KEY!
 * });
 *
 * // Using custom credentials
 * const supabase = createSupabaseClient({
 *   supabaseUrl: 'https://your-project.supabase.co',
 *   supabaseKey: 'your-anon-key'
 * });
 * ```
 *
 * @throws {Error} If supabaseUrl or supabaseKey is missing
 */
const createSupabaseClient = ({ supabaseUrl, supabaseKey, }) => {
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase credentials');
    }
    return createClient(supabaseUrl, supabaseKey);
};
export { createSupabaseClient };
