import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";



serve(async (req) => {
    try {
        // Get Supabase environment variables
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseAnonKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Read request data
        const { tutor_id, session_date, start_time, end_time } = await req.json();

        if (!tutor_id || !session_date || !start_time || !end_time) {
            return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
        }

        // Reject all pending overlapping bookings for the tutor
        const { data, error } = await supabase
            .from("bookings")
            .update({ status: "rejected" })
            .eq("tutor_id", tutor_id)
            .eq("session_date", session_date)
            .eq("status", "pending")
            .or(`start_time.lt.${end_time},end_time.gt.${start_time}`);

        if (error) {
            throw error;
        }

        return new Response(JSON.stringify({ message: "Overlapping bookings rejected", data }), {
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
});
