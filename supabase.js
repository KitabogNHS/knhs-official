// ========================================
// KITABOG NATIONAL HIGH SCHOOL
// SUPABASE CONNECTION
// ========================================

// Replace these two values with your own
// Supabase Project URL and Publishable Key.

const SUPABASE_URL = "https://pwrpddpqsrhircgophfj.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_9HIhgd6rE8_A0GleZ3ozwQ_6AOrR58K";

// Initialize the Supabase connection
if (
  window.supabase &&
  SUPABASE_URL !== "YOUR_SUPABASE_PROJECT_URL" &&
  SUPABASE_PUBLISHABLE_KEY !== "YOUR_SUPABASE_PUBLISHABLE_KEY"
) {
  window.knhsSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  console.log("KNHS Supabase connection initialized.");
} else {
  console.error(
    "KNHS Supabase is not configured. Check your URL, key, and library."
  );
}
