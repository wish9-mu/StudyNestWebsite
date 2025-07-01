import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./TutorBookings.css";
import TutorNav from "../Nav/TutorNav";
import "../Modal/Modal.css";

const TutorBookings = () => {
  const [userId, setUserId] = useState(null);
  const [courses, setCourses] = useState({});
  const [pendingBookings, setPendingBookings] = useState([]);
  const [showModal, setShowModal] = useState("");
  const [bookingID, setBookingID] = useState("");
  const [message, setMessage] = useState({ show: false, status: "" });
  const [waitlistEntries, setWaitlistEntries] = useState([]);

  const showTemporaryMessage = (status) => {
    setMessage({ show: true, status });

    setTimeout(() => {
      setMessage({ show: false, status: "" });
    }, 5000);
  };

  // 🔹 Fetch User ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData?.user?.id) {
        console.error("❌ Error fetching user:", error || "User not found");
        return;
      }
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
      setCourses(courseMap);
    };

    fetchCourses();
  }, []);

  // 🔹 Handle Waitlist Booking Actions
  const handleAcceptWaitlist = async (entry) => {
    // Move to bookings table or update status
    const { error } = await supabase.from("bookings").insert([{
      tutee_id: entry.tutee_id,
      tutor_id: userId,
      course_code: entry.course_code,
      session_date: entry.session_date,
      start_time: entry.start_time,
      end_time: entry.end_time,
      notes: entry.notes,
      status: "pending"
    }]);
    if (!error) {
      // Remove from waitlist or update status
      await supabase.from("waitlist").update({ status: "accepted" }).eq("id", entry.id);

      // Notify the tutee
      await supabase.from("notifications").insert([{
        user_id: entry.tutee_id,
        message: `Your waitlist request for ${courses[entry.course_code] || entry.course_code} on ${entry.session_date} at ${formatTime(entry.start_time)} has been accepted by a tutor.`,
        is_read: false
      }]);

      setWaitlistEntries((prev) => prev.filter((e) => e.id !== entry.id));
    }
  };

  const handleDeclineWaitlist = async (entry) => {
    await supabase.from("waitlist").update({ status: "declined" }).eq("id", entry.id);

    // Notify the tutee
    await supabase.from("notifications").insert([{
      user_id: entry.tutee_id,
      message: `Your waitlist request for ${courses[entry.course_code] || entry.course_code} on ${entry.session_date} at ${formatTime(entry.start_time)} was declined by the tutor.`,
      is_read: false
    }]);

    setWaitlistEntries((prev) => prev.filter((e) => e.id !== entry.id));
  };


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
      time: `${formatTime(booking.start_time)} - ${formatTime(
        booking.end_time
      )}`,
      notes: booking.notes || "No additional notes.",
    }));

    setPendingBookings(formattedBookings);
  };

  // Fetch waitlist entries for courses this tutor teaches
  useEffect(() => {
    const fetchWaitlist = async () => {
      if (!userId) return;

      // Get courses this tutor teaches
      const { data: tutorCourses } = await supabase
        .from("tutor_courses")
        .select("course_code")
        .eq("tutor_id", userId);

      const courseCodes = tutorCourses.map((c) => c.course_code);

      // Fetch waitlist entries for those courses
      const { data: waitlistData } = await supabase
        .from("waitlist")
        .select("*")
        .in("course_code", courseCodes)
        .eq("status", "waiting");

      // Fetch tutee names
      const tuteeIds = (waitlistData || []).map((w) => w.tutee_id);
      let tuteeMap = {};
      if (tuteeIds.length > 0) {
        const { data: tuteeData } = await supabase
          .from("profiles")
          .select("id, first_name, last_name")
          .in("id", tuteeIds);
        tuteeData?.forEach((t) => {
          tuteeMap[t.id] = `${t.first_name} ${t.last_name}`;
        });
      }

      // Attach tutee_name to each entry
      const formattedWaitlist = (waitlistData || []).map((entry) => ({
        ...entry,
        tutee_name: tuteeMap[entry.tutee_id] || "Unknown",
      }));

      setWaitlistEntries(formattedWaitlist);
    };

    fetchWaitlist();
  }, [userId, courses]);

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
          fetchPendingBookings(); // Refetch bookings
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bookings" },
        (payload) => {

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

    // 1. Fetch the booking being accepted
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      alert("Failed to fetch booking details.");
      return;
    }

    // 2. Accept the selected booking
    const { error: acceptError } = await supabase
      .from("bookings")
      .update({ status: "accepted" })
      .eq("id", bookingId)
      .eq("status", "pending");

    if (acceptError) {
      alert("Failed to accept the booking. Please try again.");
      return;
    }

    // 3. Find all other pending bookings for the same course, date, and time
    const { data: otherBookings, error: othersError } = await supabase
      .from("bookings")
      .select("*")
      .eq("tutor_id", userId)
      .eq("course_code", booking.course_code)
      .eq("session_date", booking.session_date)
      .eq("start_time", booking.start_time)
      .eq("end_time", booking.end_time)
      .eq("status", "pending");

    if (othersError) {
      alert("Failed to fetch other bookings.");
      return;
    }

    // 4. Move other bookings to waitlist and notify tutees
    for (const other of otherBookings) {
      // Insert into waitlist
      await supabase.from("waitlist").insert([{
        tutee_id: other.tutee_id,
        course_code: other.course_code,
        session_date: other.session_date,
        start_time: other.start_time,
        end_time: other.end_time,
        notes: other.notes,
        status: "waiting"
      }]);
      // Remove or update the booking (here we update status)
      await supabase.from("bookings")
        .delete()
        .eq("id", other.id);

      // Notify the tutee (optional: if you have a notifications table)
      await supabase.from("notifications").insert([{
        user_id: other.tutee_id,
        message: `Your booking for ${courses[other.course_code] || other.course_code} at ${other.session_date} ${formatTime(other.start_time)} was moved to the waitlist because the tutor accepted another request for this slot.`,
        is_read: false
      }]);
    }

    // 5. Remove accepted and waitlisted bookings from UI
    setPendingBookings((prev) =>
      prev.filter(
        (b) =>
          b.id !== bookingId &&
          !otherBookings.some((other) => other.id === b.id)
      )
    );

    showTemporaryMessage("accepted");
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

          {message.show && (
            <div className="message">
              <h3>This booking has been {message.status}.</h3>
            </div>
          )}

          <div className="waitlist-content">
            {pendingBookings.length === 0 ? (
              <div className="empty-waitlist">
                <h3>No pending bookings.</h3>
                <p>When a student requests a session, it will appear here.</p>
              </div>
            ) : (
              pendingBookings.map((booking) => (
                <>
                  <div className="card-1" key={booking.id}>
                    <div className="align-left-content">
                      <h2>{booking.name}</h2>
                      <p>With: {booking.tutee}</p>
                      <p>Notes: {booking.notes}</p>
                    </div>

                    <div className="align-right-content">
                      <p>
                        {booking.date} | {booking.day}
                      </p>
                      <p>{booking.time}</p>
                      <button
                        className="accept-button"
                        onClick={() => {
                          setBookingID(booking.id);
                          setShowModal("accept");
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="reject-button"
                        onClick={() => {
                          setBookingID(booking.id);
                          setShowModal("reject");
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </>
              ))
            )}

            <div className="waitlist-content">
              <h2>Waitlist Requests</h2>
              {waitlistEntries.length === 0 ? (
                <div className="empty-waitlist">
                  <h3>No waitlist requests.</h3>
                  <p>When a student joins the waitlist for your courses, it will appear here.</p>
                </div>
              ) : (
                waitlistEntries.map((entry) => (
                  <div className="card-1" key={entry.id}>
                    <div className="align-left-content">
                      <h2>{courses[entry.course_code] || entry.course_code}</h2>
                      <p>
                        With: {entry.tutee_name}
                      </p>
                      <p>
                        Notes: {entry.notes || "No additional notes."}
                      </p>
                    </div>
                    <div className="align-right-content">
                      <p>
                        {entry.session_date} | {new Date(entry.session_date).toLocaleDateString("en-us", { weekday: "long" })}
                      </p>
                      <p>
                        {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                      </p>
                      <button
                        className="accept-button"
                        onClick={() => handleAcceptWaitlist(entry)}
                      >
                        Accept
                      </button>
                      <button
                        className="reject-button"
                        onClick={() => handleDeclineWaitlist(entry)}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {showModal === "accept" && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2>Are you sure you want to accept this booking?</h2>
                  <button
                    className="accept-button"
                    onClick={() => {
                      handleAcceptBooking(bookingID);
                      setShowModal("");
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => setShowModal("")}
                  >
                    No
                  </button>
                </div>
              </div>
            )}

            {showModal === "reject" && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2>Are you sure you want to reject this booking?</h2>
                  <button
                    className="accept-button"
                    onClick={() => {
                      handleRejectBooking(bookingID);
                      setShowModal("");
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => setShowModal("")}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorBookings;
