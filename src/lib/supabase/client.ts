/**
 * Supabase Client Configuration
 * Uses environment variables for security
 */

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Missing Supabase credentials! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file'
  );
}

// Extract project ID from URL (e.g., https://PROJECT_ID.supabase.co)
export const projectId = supabaseUrl.replace('https://', '').split('.')[0];
export const publicAnonKey = supabaseAnonKey;

// Export configured values
export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  projectId,
} as const;