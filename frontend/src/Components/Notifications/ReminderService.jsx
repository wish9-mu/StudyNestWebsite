import { useEffect } from "react";
import { supabase } from "../../supabaseClient";

const ReminderService = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      const from = new Date(now.getTime() + 30 * 60000);      // 30 mins from now
      const to = new Date(now.getTime() + 31 * 60000);        // small buffer

      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("id, tutor_id, tutee_id, session_start")
        .eq("status", "accepted")
        .gte("session_start", from.toISOString())
        .lt("session_start", to.toISOString());

      if (error) {
        console.error("Reminder fetch error:", error);
        return;
      }

      for (const booking of bookings) {
        const time = new Date(booking.session_start).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Check if reminder already sent (optional but avoids duplicates)
        const { data: existing, error: existsErr } = await supabase
          .from("notifications")
          .select("id")
          .eq("user_id", booking.tutee_id)
          .ilike("message", `%Reminder: Your session is at ${time}%`);

        if (existing?.length > 0) continue;

        // Insert reminder for both tutor and tutee
        await supabase.from("notifications").insert([
          {
            user_id: booking.tutee_id,
            message: `⏰ Reminder: Your session is at ${time}`,
            is_read: false,
          },
          {
            user_id: booking.tutor_id,
            message: `⏰ Reminder: You have a session at ${time}`,
            is_read: false,
          },
        ]);
      }
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default ReminderService;
