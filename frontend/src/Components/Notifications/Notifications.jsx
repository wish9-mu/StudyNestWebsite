import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./Notifications.css"; // Add CSS for styling

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false); // For dropdown visibility

  // Fetch notifications from Supabase
  useEffect(() => {
    if (!userId) return; // Prevent fetching if userId is null

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .eq("is_read", false) // Only get unread notifications
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching notifications:", error);
      } else {
        setNotifications(data);
      }
    };

    fetchNotifications();
  }, [userId]);

  // Listen for real-time notifications
  useEffect(() => {
    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {

          setNotifications((prev) => {
            // Prevent duplicate notifications
            if (!prev.find((n) => n.id === payload.new.id)) {
              return [payload.new, ...prev];
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // 🔹 Mark as Read & Remove from UI
  const markAsRead = async (id) => {
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      // Remove from UI only if successful
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
    }
  };

  return (
    <div className="notifications-container">
      <button
        className="notifications-button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        🔔{" "}
        {notifications.length > 0 && (
          <span className="notif-count">{notifications.length}</span>
        )}
      </button>

      {dropdownOpen && (
        <div className="notifications-dropdown">
          {notifications.map((note) => (
            <div
              key={note.id}
              className="notification-item"
              onClick={() => markAsRead(note.id)}
            >
              <p>{note.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
