import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./TuteeWaitlist.css";
import TuteeNav from "../Nav/TuteeNav";
import FeedbackForm from "./FeedbackForm";

const FeedbackHistory = () => {
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [courses, setCourses] = useState({});
  const [archivedFeedbacks, setArchivedFeedbacks] = useState([]);

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

  // 🔹 Render stars for a given average
  const renderStars = (average) => {
    if (average === null || average === undefined) return "N/A";

    const rounded = Math.floor(Number(average)); // Round down
    const maxStars = 5;

    const stars = [];
    for (let i = 0; i < maxStars; i++) {
        if (i < rounded) {
        stars.push(<span key={i}>⭐</span>);
        } else {
        stars.push(<span key={i}> </span>);
        }
    }

    return stars;
  };


  // 🔹 Fetch Archived Feedbacks
  const fetchArchivedFeedbacks = async () => {
    if (!userId || !userRole) return;

    console.log("Fetching archived feedback...");

    // Get feedbacks this user gave
    const { data: feedbacks, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("user_id", userId);

    if (error) {
      console.error("❌ Error fetching archived feedback:", error);
      return;
    }

    console.log("✅ Archived feedback fetched:", feedbacks);

    // Get related session IDs
    const sessionIds = feedbacks.map((f) => f.session_id);
    if (sessionIds.length === 0) {
        setArchivedFeedbacks([]);
        return;
    }

    // Get matching bookings
    const { data: sessions, error: sessionsError } = await supabase
        .from("bookings_history")
        .select("*")
        .in("id", sessionIds);

    if (sessionsError) {
        console.error("❌ Error fetching sessions:", sessionsError);
        return;
    }

    console.log("📌 Related sessions fetched:", sessions);

    // Fetch participant names
    const participantIds = sessions
      .map((s) => (userRole === "tutee" ? s.tutor_id : s.tutee_id)
    );

    const { data: participants, error: participantsError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .in("id", participantIds);

    if (participantsError) {
        console.error("❌ Error fetching participant names:", participantsError);
        return;
    }

    console.log("👤 Participant names fetched:", participants);

    const nameMap = {};
    participants.forEach((p) => {
      nameMap[p.id] = `${p.first_name} ${p.last_name}`;
    });

    // 🔹 Calculate the overall rating feedback given
    const calculateAverage = (obj) => {
    if (!obj || typeof obj !== "object") return null;

    const values = Object.values(obj);
    if (values.length === 0) return null;

    const total = values.reduce((sum, val) => sum + Number(val), 0);
    return (total / values.length).toFixed(2); // 2 decimals
    };

    const formattedFeedbacks = feedbacks.map((f) => {
        const session = sessions.find((s) => s.id === f.session_id);
        if (!session) return null;

        //🔹 Format the createdAt column for Date and Time
        const createdAt = new Date(f.created_at);

        const date = createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        });

        // 🔹 Extract `HH:MM` in 24-hour time
        const hours = createdAt.getHours().toString().padStart(2, "0");
        const minutes = createdAt.getMinutes().toString().padStart(2, "0");
        const timeString = `${hours}:${minutes}`;

        // 🔹 Use your custom formatter
        const time = formatTime(timeString);

        return {
        id: f.id,
        course: `Course: ${courses[session.course_code] || session.course_code || "Unknown Course"}`,
        participant: `${nameMap[userRole === "tutee" ? session.tutor_id : session.tutee_id] ||
            "Unknown"
        }`,
        date: `Submitted at: ${date}`,
        time: time,
        comments: f.comments,
        responsesAverage: calculateAverage(f.responses)
        };
    }).filter(Boolean);
        
    
    console.log("📌 Formatted feedbacks:", formattedFeedbacks);
    setArchivedFeedbacks(formattedFeedbacks);
  };

  // 🔹 Fetch archived feedback when courses are ready
  useEffect(() => {
    if (Object.keys(courses).length > 0) {
      fetchArchivedFeedbacks();
    }
  }, [userId, userRole, courses]);

  return (
    <>
      <div className="content-wrapper">
        <div className="tutee-waitlist">
          <div className="header">
            <div className="header-text">
              <h1>Feedback History</h1>
            </div>
            <div className="header-info">
              <p>View all your feedback that you have given here.</p>
            </div>
          </div>

          <div className="waitlist-content">
            {archivedFeedbacks.length === 0 ? (
              <div className="empty-waitlist">
                <h3>No feedbacks found.</h3>
                <p>Looks like you have any feedbacks given yet.</p>
              </div>
            ) : (
              archivedFeedbacks.map((feedback) => (
                <div className="card-1" key={feedback.id}>
                  <div className="align-left-content">
                    <h2>{feedback.participant}</h2>
                    <p>{feedback.course}</p>
                    <p>Comments: {feedback.comments}</p>
                  </div>
                  <div className="align-right-content">
                    <h2>
                        {renderStars(feedback.responsesAverage)} <br />
                        Given Score: {feedback.responsesAverage || "N/A"}
                    </h2>
                    <p>
                      {feedback.date} | {feedback.time}
                    </p>
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

export default FeedbackHistory;