import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Listen for authentication state changes
supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth state changed:", event, session);
    if (session) {
      localStorage.setItem("supabaseSession", JSON.stringify(session));
    } else {
      localStorage.removeItem("supabaseSession");
    }
  });