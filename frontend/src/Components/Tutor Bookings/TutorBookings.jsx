import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./TutorBookings.css";
import TutorNav from "../Nav/TutorNav";

const TutorBookings = () => {
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

  // 🔹 Fetch Pending Bookings
  const fetchPendingBookings = async () => {
    if (!userId || Object.keys(courses).length === 0) return;

    console.log("Fetching pending bookings...");

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("tutor_id", userId)
      .eq("status", "pending");

    if (error) {
      console.error("❌ Error fetching pending bookings:", error);
      return;
    }

    console.log("✅ Pending bookings fetched:", bookings);

    // Fetch tutee names
    const tuteeIds = bookings.map((b) => b.tutee_id);
    const { data: tuteeData, error: tuteeError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .in("id", tuteeIds);

    if (tuteeError) {
      console.error("❌ Error fetching tutee names:", tuteeError);
      return;
    }

    console.log("👤 Tutee names fetched:", tuteeData);

    const tuteeMap = {};
    tuteeData.forEach((t) => {
      tuteeMap[t.id] = `${t.first_name} ${t.last_name}`;
    });

    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      name: courses[booking.course_code] || booking.course_code,
      tutee: tuteeMap[booking.tutee_id] || "Unknown",
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

  // 🔹 Format Time
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for AM
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // 🔹 Fetch pending bookings on component mount
  useEffect(() => {
    fetchPendingBookings();
  }, [userId, courses]);

  // 🔹 Listen for real-time updates
  useEffect(() => {
    const subscription = supabase
      .channel("bookings")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings" },
        (payload) => {
          console.log("🆕 New pending booking detected:", payload.new);
          fetchPendingBookings(); // Refetch bookings
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bookings" },
        (payload) => {
          console.log("🔄 Pending booking status updated:", payload.new);

          if (["accepted", "rejected"].includes(payload.new.status)) {
            // ✅ Remove from UI if status is changed
            setPendingBookings((prev) =>
              prev.filter((booking) => booking.id !== payload.new.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // 🔹 Handle Accept Booking
  const handleAcceptBooking = async (bookingId) => {
    console.log("✔️ Accepting booking:", bookingId);

    const { error } = await supabase
      .from("bookings")
      .update({ status: "accepted" })
      .eq("id", bookingId)
      .eq("status", "pending");

    if (error) {
      console.error("❌ Error accepting booking:", error);
      alert("Failed to accept the booking. Please try again.");
      return;
    }

    console.log("✅ Booking accepted.");
    setPendingBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
  };

  // 🔹 Handle Reject Booking
  const handleRejectBooking = async (bookingId) => {
    console.log("❌ Rejecting booking:", bookingId);

    const { error } = await supabase
      .from("bookings")
      .update({ status: "rejected" })
      .eq("id", bookingId)
      .eq("status", "pending");

    if (error) {
      console.error("❌ Error rejecting booking:", error);
      alert("Failed to reject the booking. Please try again.");
      return;
    }

    console.log("✅ Booking rejected.");
    setPendingBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
  };

  return (
    <>
      <TutorNav />
      <div className="content-wrapper">
        <div className="tutor-bookings">
          <div className="header">
            <div className="header-text">
              <h1>Manage Bookings</h1>
            </div>
            <div className="header-info">
              <p>Here, you can accept or reject tutoring requests.</p>
            </div>
          </div>

          <div className="waitlist-content">
            {pendingBookings.length === 0 ? (
              <div className="empty-waitlist">
                <h3>No pending bookings.</h3>
                <p>When a student requests a session, it will appear here.</p>
              </div>
            ) : (
              pendingBookings.map((booking) => (
                <div className="card-1" key={booking.id}>
                  <div className="align-left-content">
                    <h2>{booking.name}</h2>
                    <p>With: {booking.tutee}</p>
                    <p>Notes: {booking.notes}</p>
                  </div>
                  <div className="align-right-content">
                    <p>{booking.date} | {booking.day}</p>
                    <p>{booking.time}</p>
                    <button className="accept-button" onClick={() => handleAcceptBooking(booking.id)}>Accept</button>
                    <button className="reject-button" onClick={() => handleRejectBooking(booking.id)}>Reject</button>
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

export default TutorBookings;
