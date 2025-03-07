import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./TuteeWaitlist.css";
import TuteeNav from "../Nav/TuteeNav";

const Waitlist_ForTutee = () => {
  const [userId, setUserId] = useState(null);
  const [courses, setCourses] = useState({});
  const [pendingBookings, setPendingBookings] = useState([]);

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

  // 🔹 Fetch Courses
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

  // 🔹 Fetch Pending Bookings
  const fetchPendingBookings = async () => {
    if (!userId || Object.keys(courses).length === 0) return;

    console.log("Fetching pending bookings...");

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("tutee_id", userId)
      .eq("status", "pending");

    if (error) {
      console.error("❌ Error fetching pending bookings:", error);
      return;
    }

    console.log("✅ Pending bookings fetched:", bookings);

    // Fetch tutor names
    const tutorIds = bookings.map((b) => b.tutor_id);
    const { data: tutorData, error: tutorError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .in("id", tutorIds);

    if (tutorError) {
      console.error("❌ Error fetching tutor names:", tutorError);
      return;
    }

    console.log("👤 Tutor names fetched:", tutorData);

    const tutorMap = {};
    tutorData.forEach((t) => {
      tutorMap[t.id] = `${t.first_name} ${t.last_name}`;
    });

    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      name: courses[booking.course_code] || booking.course_code,
      tutor: tutorMap[booking.tutor_id] || "Unknown",
      date: booking.session_date,
      day: new Date(booking.session_date).toLocaleDateString("en-us", {
        weekday: "long",
      }),
      time: `${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}`,
      notes: booking.notes || "No additional notes.",
    }));

    console.log("📌 Formatted bookings:", formattedBookings);
    setPendingBookings(formattedBookings);
  };

  // 🔹 Fetch pending bookings when `userId` and `courses` are ready
  useEffect(() => {
    if (userId && Object.keys(courses).length > 0) {
      fetchPendingBookings();
    }
  }, [userId, courses]);

  // 🔹 Listen for real-time updates in `bookings`
  useEffect(() => {
    const subscription = supabase
      .channel("bookings")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings" },
        (payload) => {
          console.log("🆕 New pending booking detected:", payload.new);
          
          // Add new pending booking to the UI without refetching everything
          setPendingBookings((prevBookings) => [
            ...prevBookings,
            {
              id: payload.new.id,
              name: courses[payload.new.course_code] || payload.new.course_code,
              tutor: "Loading...", // Fetch tutor name below
              date: payload.new.session_date,
              day: new Date(payload.new.session_date).toLocaleDateString("en-us", {
                weekday: "long",
              }),
              time: `${formatTime(payload.new.start_time)} - ${formatTime(payload.new.end_time)}`,
              notes: payload.new.notes || "No additional notes.",
            },
          ]);

          // Fetch tutor name separately
          supabase
            .from("profiles")
            .select("id, first_name, last_name")
            .eq("id", payload.new.tutor_id)
            .single()
            .then(({ data, error }) => {
              if (!error && data) {
                setPendingBookings((prevBookings) =>
                  prevBookings.map((b) =>
                    b.id === payload.new.id ? { ...b, tutor: `${data.first_name} ${data.last_name}` } : b
                  )
                );
              }
            });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bookings" },
        (payload) => {
          console.log("🆕 Pending booking status updated:", payload.new);

          // Remove from UI if status changes from "pending" to "accepted" or "rejected"
          if (["rejected"].includes(payload.new.status)) {
            console.log("❌ Booking moved to history, removing from UI...");
            setPendingBookings((prevBookings) =>
              prevBookings.filter((booking) => booking.id !== payload.new.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [courses]);

  // 🔹 Handle Cancel Booking
  const handleCancelBooking = async (bookingId) => {
    if (!bookingId) {
      console.error("❌ Invalid booking ID:", bookingId);
      return;
    }

    console.log("🚀 Cancelling booking:", bookingId);

    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId)
        .eq("status", "pending");

      if (error) {
        console.error("❌ Error cancelling booking:", error);
        alert("Failed to cancel the booking. Please try again.");
        return;
      }

      console.log("✅ Booking cancelled successfully.");
      setPendingBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingId)
      );

      alert("Booking has been cancelled successfully.");
    } catch (error) {
      console.error("❌ Unexpected error cancelling booking:", error);
      alert("An error occurred while cancelling the booking.");
    }
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="tutee-waitlist">
          <div className="header">
            <div className="header-text">
              <h1>Pending Bookings</h1>
            </div>
            <div className="header-info">
              <p>Here, you can see your pending booking requests.</p>
            </div>
          </div>

          <div className="waitlist-content">
            {pendingBookings.length === 0 ? (
              <div className="empty-waitlist">
                <h3>You don't have any pending bookings.</h3>
                <p>Once you request a tutor, your booking will appear here.</p>
              </div>
            ) : (
              pendingBookings.map((booking) => (
                <div className="card-1" key={booking.id}>
                  <div className="align-left-content">
                    <h2>{booking.name}</h2>
                    <p>With: {booking.tutor}</p>
                    <p>Notes: {booking.notes}</p>
                  </div>
                  <div className="align-right-content">
                    <p>{booking.date} | {booking.day}</p>
                    <p>{booking.time}</p>
                    <button onClick={() => handleCancelBooking(booking.id)}>Cancel Booking</button>
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

export default Waitlist_ForTutee;
