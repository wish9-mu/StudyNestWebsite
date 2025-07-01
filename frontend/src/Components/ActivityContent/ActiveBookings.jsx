import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./TuteeWaitlist.css";
import "../Modal/Modal.css";
import TuteeNav from "../Nav/TuteeNav";
import FeedbackForm from "./FeedbackForm";

const ActiveBookings = () => {
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [courses, setCourses] = useState({});
  const [activeBookings, setActiveBookings] = useState([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [bookingStat, setBookingStat] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [showModal, setShowModal] = useState("");
  const [bookingID, setBookingID] = useState(null);
  const [message, setMessage] = useState({ show: false, status: "" });

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

      setCourses(courseMap);
    };

    fetchCourses();
  }, []);

  // 🔹 Fetch Active Bookings
  const fetchActiveBookings = async () => {
    if (!userId || !userRole || Object.keys(courses).length === 0) return;

    console.log("Fetching active bookings...");

    let query = supabase.from("bookings").select("*").eq("status", "accepted");

    if (userRole === "tutee") {
      query = query.eq("tutee_id", userId);
    } else if (userRole === "tutor") {
      query = query.eq("tutor_id", userId);
    }

    const { data: bookings, error } = await query;

    if (error) {
      console.error("❌ Error fetching active bookings:", error);
      return;
    }

    // Fetch participant names
    const participantIds = bookings
      .map((b) => (userRole === "tutee" ? b.tutor_id : b.tutee_id))
      .filter((id) => id); // Remove null values

    const { data: participantData, error: participantError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .in("id", participantIds);

    if (participantError) {
      console.error("❌ Error fetching participant name:", participantError);
      return;
    }

    const participantMap = {};
    participantData.forEach((p) => {
      participantMap[p.id] = `${p.first_name} ${p.last_name}`;
    });

    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      name: courses[booking.course_code] || booking.course_code,
      participant: `With: ${
        participantMap[booking.tutor_id] ||
        participantMap[booking.tutee_id] ||
        "Unknown"
      }`,
      date: booking.session_date,
      day: new Date(booking.session_date).toLocaleDateString("en-us", {
        weekday: "long",
      }),
      time: `${formatTime(booking.start_time)} - ${formatTime(
        booking.end_time
      )}`,
      notes: booking.notes || "No additional notes.",
      status: booking.status,
    }));
    
    setActiveBookings(formattedBookings);
  };

  const showTemporaryMessage = (status) => {
    setMessage({ show: true, status });

    setTimeout(() => {
      setMessage({ show: false, status: "" });
    }, 5000);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for AM
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // 🔹 Fetch active bookings on component mount
  useEffect(() => {
    fetchActiveBookings();
  }, [userId, userRole, courses]);

  // 🔹 Listen for real-time updates
  useEffect(() => {
    const subscription = supabase
      .channel("bookings")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bookings" },
        (payload) => {
          console.log("🔄 [Active] Booking status updated");

          const updatedBooking = payload.new;

          if (updatedBooking.status === "accepted") {
            // ✅ Add to active bookings if it was just accepted
            setActiveBookings((prevBookings) => {
              const alreadyExists = prevBookings.some(
                (b) => b.id === updatedBooking.id
              );
              if (alreadyExists) return prevBookings; // Avoid duplicates

              return [
                ...prevBookings,
                {
                  id: updatedBooking.id,
                  name:
                    courses[updatedBooking.course_code] ||
                    updatedBooking.course_code,
                  participant: "Fetching...", // Will be updated later
                  date: updatedBooking.session_date,
                  day: new Date(updatedBooking.session_date).toLocaleDateString(
                    "en-us",
                    {
                      weekday: "long",
                    }
                  ),
                  time: `${formatTime(
                    updatedBooking.start_time
                  )} - ${formatTime(updatedBooking.end_time)}`,
                  notes: updatedBooking.notes || "No additional notes.",
                },
              ];
            });
          } else if (
            updatedBooking.status === "cancelled" ||
            updatedBooking.status === "completed"
          ) {
            // ❌ Remove from active bookings if status is now cancelled or completed
            setActiveBookings((prevBookings) =>
              prevBookings.filter((booking) => booking.id !== updatedBooking.id)
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
      console.error("❌ Invalid booking ID");
      return;
    }

    console.log("🚀 Cancelling booking");

    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId)
        .eq("status", "accepted"); // Ensuring only accepted bookings are cancelled

      if (error) {
        console.error("❌ Error cancelling booking:", error);
        alert("Failed to cancel the booking. Please try again.");
        return;
      }

      console.log("✅ Booking cancelled successfully.");
      fetchActiveBookings();
      showTemporaryMessage("cancelled");
    } catch (error) {
      console.error("❌ Unexpected error cancelling booking:", error);
      alert("An error occurred while cancelling the booking.");
    }
  };

  useEffect(() => {
    if (activeBookings.length > 0) {
      setBookingStat(
        activeBookings.find((b) => b.status === "accepted")?.status || ""
      );
    }
  }, [activeBookings]);

  const markAsCompleted = async (bookingId) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "completed" })
      .eq("id", bookingId);

    if (error) {
      console.error("❌ Error updating booking status:", error);
    } else {
      fetchActiveBookings();
    }
  };

  const handleCompleteSession = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowFeedbackForm(true);
    console.log("✅ Feedback Form Active.");
  };

  const handleCloseFeedback = async () => {
    if (selectedBookingId) {
      await markAsCompleted(selectedBookingId);
    }
    setShowFeedbackForm(false);
    setSelectedBookingId(null);
    console.log("✅ Feedback Form Closed.");
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="tutee-waitlist">
          <div className="header">
            <div className="header-text">
              <h1>Active Bookings</h1>
            </div>
            <div className="header-info">
              <p>
                Here in Active Bookings, you can find your ongoing booked
                sessions.
              </p>
            </div>
          </div>

          {message.show && (
            <div className="message">
              <h3>This booking has been {message.status}.</h3>
            </div>
          )}

          <div className="waitlist-content">
            {activeBookings.length === 0 ? (
              <div className="empty-waitlist">
                <h3>You don't have any active bookings.</h3>
                <p>When you have a pending session, it will appear here.</p>
              </div>
            ) : (
              <>
                {activeBookings.map((booking) => (
                  <div className="card-1" key={booking.id}>
                    <div className="align-left-content">
                      <h2>{booking.name}</h2>
                      <p>{booking.participant}</p>
                      <p>Notes: {booking.notes}</p>
                    </div>
                    <div className="align-right-content">
                      <p>
                        {booking.date} | {booking.day}
                      </p>
                      <p>{booking.time}</p>
                      <div className="booking-buttons">
                        {bookingStat !== "completed" && (
                          <button
                            className="cancel-booking-btn"
                            onClick={() => {
                              setBookingID(booking.id);
                              setShowModal("cancel");
                            }}
                          >
                            Cancel Booking
                          </button>
                        )}
                        {userRole === "tutee" && bookingStat === "accepted" && (
                          <button
                            className="complete-booking-btn"
                            onClick={() => handleCompleteSession(booking.id)}
                          >
                            Mark as Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {showModal === "cancel" && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <h2>Are you sure you want to cancel this booking?</h2>
                      <button
                        className="accept-button"
                        onClick={() => {
                          handleCancelBooking(bookingID);
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
              </>
            )}
          </div>
          {showFeedbackForm && selectedBookingId && (
            <FeedbackForm
              userRole={userRole}
              sessionId={selectedBookingId}
              sessionType="booking"
              userId={userId}
              onClose={handleCloseFeedback}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ActiveBookings;
