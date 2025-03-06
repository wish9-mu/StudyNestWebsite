import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./TuteeWaitlist.css";
import TuteeNav from "../Nav/TuteeNav";

const ActiveBookings = () => {
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [courses, setCourses] = useState({});
  const [activeBookings, setActiveBookings] = useState([]);

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

    console.log("✅ Active bookings fetched:", bookings);

    // Fetch participant name (only one participant)
    const participantIds = bookings.map((b) =>
      userRole === "tutee" ? b.tutor_id : b.tutee_id
    );

    const { data: participantData, error: participantError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .in("id", participantIds);

    if (participantError) {
      console.error("❌ Error fetching participant name:", participantError);
      return;
    }

    console.log("👤 Participant name fetched:", participantData);

    const participantMap = {};
    participantData.forEach((p) => {
      participantMap[p.id] = `${p.first_name} ${p.last_name}`;
    });

    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      name: courses[booking.course_code] || booking.course_code,
      participant:
        participantMap[userRole === "tutee" ? booking.tutor_id : booking.tutee_id] ||
        "Unknown",
      date: booking.session_date,
      day: new Date(booking.session_date).toLocaleDateString("en-us", {
        weekday: "long",
      }),
      time: `${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}`,
      notes: booking.notes || "No additional notes.",
    }));

    console.log("📌 Formatted bookings:", formattedBookings);
    setActiveBookings(formattedBookings);
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
        { event: "INSERT", schema: "public", table: "bookings" },
        (payload) => {
          console.log("🆕 New booking detected:", payload.new);
          setActiveBookings((prevBookings) => [
            ...prevBookings,
            {
              id: payload.new.id,
              name: courses[payload.new.course_code] || payload.new.course_code,
              participant: "Unknown", // Will update later
              date: payload.new.session_date,
              day: new Date(payload.new.session_date).toLocaleDateString("en-us", {
                weekday: "long",
              }),
              time: `${formatTime(payload.new.start_time)} - ${formatTime(
                payload.new.end_time
              )}`,
              notes: payload.new.notes || "No additional notes.",
            },
          ]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bookings", filter: "status=eq.accepted" },
        (payload) => {
          console.log("🆕 Booking status updated:", payload.new);
  
          // If status is now "accepted", add to UI
          if (payload.new.status === "accepted") {
            setActiveBookings((prevBookings) => [
              ...prevBookings,
              {
                id: payload.new.id,
                name: courses[payload.new.course_code] || payload.new.course_code,
                participant: "Unknown", // Will update later
                date: payload.new.session_date,
                day: new Date(payload.new.session_date).toLocaleDateString("en-us", {
                  weekday: "long",
                }),
                time: `${formatTime(payload.new.start_time)} - ${formatTime(payload.new.end_time)}`,
                notes: payload.new.notes || "No additional notes.",
              },
            ]);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "bookings" },
        (payload) => {
          console.log("❌ Booking deleted:", payload.old);
          setActiveBookings((prevBookings) =>
            prevBookings.filter((booking) => booking.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [courses]);

  return (
    <>
      <TuteeNav />
      <div className="content-wrapper">
        <div className="tutee-waitlist">
          <div className="header">
            <div className="header-text">
              <h1>Active Bookings</h1>
            </div>
            <div className="header-info">
              <p>
                Here in Active Bookings, you can find your ongoing booked sessions.
              </p>
            </div>
          </div>

          <div className="waitlist-content">
            {activeBookings.length === 0 ? (
              <div className="empty-waitlist">
                <h3>You don't have any active bookings.</h3>
                <p>When you book a session, it will appear here.</p>
              </div>
            ) : (
              activeBookings.map((booking) => (
                <div className="card-1" key={booking.id}>
                  <div className="align-left-content">
                    <h2>{booking.name}</h2>
                    <p>With: {booking.participant}</p>
                    <p>
                      Notes:
                      <p>{booking.notes}</p>
                    </p>
                  </div>
                  <div className="align-right-content">
                    <p>
                      {booking.date} | {booking.day}
                    </p>
                    <p>{booking.time}</p>
                    <button className="leave-waitlist-btn">Cancel Booking</button>
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

export default ActiveBookings;
