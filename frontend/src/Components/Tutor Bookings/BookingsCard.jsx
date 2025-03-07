import React, { useEffect, useState } from "react";
import "./TutorBookings.css";
import { supabase } from "../../supabaseClient";

const BookingsCard = ({ setAcceptedBList }) => {
  const [bookingsList, setBookingsList] = useState([]);

  // 🔹 Fetch pending bookings from Supabase
  const fetchPendingBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("status", "pending"); // ✅ Fetch only pending bookings

    if (error) {
      console.error("❌ Error fetching bookings:", error);
      return;
    }

    console.log("✅ Pending bookings fetched:", data);
    
    // Fetch tutee names
    const tuteeIds = data.map((b) => b.tutee_id);
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

    const formattedBookings = data.map((booking) => ({
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


  useEffect(() => {
    fetchPendingBookings();
  }, []);

  // 🔹 Listen for real-time updates
  useEffect(() => {
    const subscription = supabase
      .channel("bookings")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings" },
        (payload) => {
          console.log("🆕 New booking request detected:", payload.new);
          setBookingsList((prev) => [...prev, payload.new]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bookings" },
        (payload) => {
          console.log("🔄 Booking status updated:", payload.new);
          // Remove from UI if status changes to accepted/rejected
          if (["accepted", "rejected"].includes(payload.new.status)) {
            setBookingsList((prev) =>
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
  const handleAccept = async (id) => {
    console.log("✔️ Accepting booking:", id);

    const { error } = await supabase
      .from("bookings")
      .update({ status: "accepted" })
      .eq("id", id)
      .eq("status", "pending");

    if (error) {
      console.error("❌ Error accepting booking:", error);
      return;
    }

    console.log("✅ Booking accepted.");
    setBookingsList((prev) => prev.filter((booking) => booking.id !== id));
    setAcceptedBList((prev) => [...prev, bookingsList.find((b) => b.id === id)]);
  };

  // 🔹 Handle Reject Booking
  const handleReject = async (id) => {
    console.log("❌ Rejecting booking:", id);

    const { error } = await supabase
      .from("bookings")
      .update({ status: "rejected" })
      .eq("id", id)
      .eq("status", "pending");

    if (error) {
      console.error("❌ Error rejecting booking:", error);
      return;
    }

    console.log("✅ Booking rejected.");
    setBookingsList((prev) => prev.filter((booking) => booking.id !== id));
  };

  return (
    <>
      {bookingsList.length > 0 ? (
        bookingsList.map((booking) => (
          <div key={booking.id} className={`booking-card ${booking.status}`}>
            <h3>{booking.tutee}</h3> {/* ✅ Displays tutee name */}
            <p><strong>Course:</strong> {booking.name}</p>
            <p><strong>Date:</strong> {booking.date} | {booking.day}</p>
            <p><strong>Time:</strong> {booking.time}</p>
            <p><strong>Notes:</strong> {booking.notes}</p>

            {booking.status === "pending" ? (
              <>
                <button className="accept-button" onClick={() => handleAccept(booking.id)}>Accept</button>
                <button className="reject-button" onClick={() => handleReject(booking.id)}>Reject</button>
              </>
            ) : (
              <p className={`status ${booking.status}`}>
                This booking has been {booking.status}.
              </p>
            )}
          </div>
        ))
      ) : (
        <p>No pending bookings.</p>
      )}
    </>
  );
};

export default BookingsCard;
