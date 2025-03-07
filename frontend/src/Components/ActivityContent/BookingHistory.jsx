import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./TuteeWaitlist.css";
import TuteeNav from "../Nav/TuteeNav";

const BookingHistory = () => {
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [courses, setCourses] = useState({});
  const [archivedBookings, setArchivedBookings] = useState([]);

  // 🔹 Fetch User ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData?.user?.id) {
        console.error("❌ Error fetching user:", error || "User not found");
        return;
      }
      console.log("✅ User ID fetched:", userData.user.id);
      setUserId(userData.user.id);
    };
    fetchUser();
  }, []);

  // 🔹 Fetch User Role
  useEffect(() => {
    if (!userId) return;

    const fetchUserRole = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("❌ Error fetching user role:", error);
        return;
      }

      console.log("✅ User role fetched:", data.role);
      setUserRole(data.role);
    };
    fetchUserRole();
  }, [userId]);

  // 🔹 Fetch Courses and Store as Object { course_code: course_name }
  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("course_code, course_name");

      if (error) {
        console.error("❌ Error fetching courses:", error);
        return;
      }

      const courseMap = {};
      data.forEach((course) => {
        courseMap[course.course_code] = course.course_name;
      });

      console.log("📚 Courses fetched:", courseMap);
      setCourses(courseMap);
    };

    fetchCourses();
  }, []);

  // 🔹 Convert Time to 12-hour Format
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // 🔹 Fetch Archived Bookings
  const fetchArchivedBookings = async () => {
    if (!userId || !userRole || Object.keys(courses).length === 0) return;

    console.log("Fetching archived bookings...");

    let query = supabase.from("bookings_history").select("*");

    if (userRole === "tutee") {
      query = query.eq("tutee_id", userId);
    } else if (userRole === "tutor") {
      query = query.eq("tutor_id", userId);
    }

    const { data: bookings, error } = await query;

    if (error) {
      console.error("❌ Error fetching archived bookings:", error);
      return;
    }

    console.log("✅ Archived bookings fetched:", bookings);

    // Fetch participant + canceller names
    const participantIds = bookings
      .map((b) => (userRole === "tutee" ? b.tutor_id : b.tutee_id))
      .filter(Boolean);

    const cancellerIds = bookings
      .map((b) => b.cancelled_by)
      .filter(Boolean);

    const uniqueUserIds = [...new Set([...participantIds, ...cancellerIds])];

    console.log("👤 Fetching names for IDs:", uniqueUserIds);

    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .in("id", uniqueUserIds);

    if (userError) {
      console.error("❌ Error fetching participant/canceller names:", userError);
      return;
    }

    console.log("👤 Participant & Canceller names fetched:", userData);

    const nameMap = {};
    userData.forEach((p) => {
      nameMap[p.id] = `${p.first_name} ${p.last_name}`;
    });

    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      name: courses[booking.course_code] || booking.course_code,
      participant: `With: ${nameMap[userRole === "tutee" ? booking.tutor_id : booking.tutee_id] || "Unknown"}`,
      date: booking.session_date,
      day: new Date(booking.session_date).toLocaleDateString("en-us", { weekday: "long" }),
      time: `${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}`,
      notes: booking.notes || "No additional notes.",
      status:
        booking.status === "cancelled" && booking.cancelled_by
          ? `CANCELLED BY ${nameMap[booking.cancelled_by]?.toUpperCase() || "UNKNOWN"}`
          : booking.status.toUpperCase(),
    }));

    console.log("📌 Formatted bookings:", formattedBookings);
    setArchivedBookings(formattedBookings);
  };

  // 🔹 Fetch archived bookings when courses are ready
  useEffect(() => {
    if (Object.keys(courses).length > 0) {
      fetchArchivedBookings();
    }
  }, [userId, userRole, courses]);

  // 🔹 Listen for real-time updates in `bookings`
  useEffect(() => {
    const bookingsSubscription = supabase
      .channel("bookings")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "bookings" }, (payload) => {
        console.log("📌 Booking status changed:", payload.new);

        if (["completed", "cancelled", "rejected"].includes(payload.new.status)) {
          console.log("🔄 Booking moved to history, fetching new data...");
          fetchArchivedBookings();
        }
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "bookings" }, (payload) => {
        console.log("❌ Booking removed from active bookings:", payload.old);
        fetchArchivedBookings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsSubscription);
    };
  }, []);

  return (
    <>
      <div className="content-wrapper">
        <div className="tutee-waitlist">
          <div className="header">
            <div className="header-text">
              <h1>Booking History</h1>
            </div>
            <div className="header-info">
              <p>View all your past bookings here.</p>
            </div>
          </div>

          <div className="waitlist-content">
            {archivedBookings.length === 0 ? (
              <div className="empty-waitlist">
                <h3>No bookings found.</h3>
                <p>Looks like you haven't made any bookings yet.</p>
              </div>
            ) : (
              archivedBookings.map((booking) => (
                <div className="card-1" key={booking.id}>
                  <div className="align-left-content">
                    <h2>{booking.name}</h2>
                    <p>{booking.participant}</p>
                    <p>Notes: {booking.notes}</p>
                  </div>
                  <div className="align-right-content">
                    <p>{booking.date} | {booking.day}</p>
                    <p>{booking.time}</p>
                    <p>Status: {booking.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingHistory;
