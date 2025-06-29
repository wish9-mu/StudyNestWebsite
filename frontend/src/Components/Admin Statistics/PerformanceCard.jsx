import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { supabase } from "../../supabaseClient";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; //
import "./PerformanceCard.css";
import defaultAvatar from "../../assets/default-avatar.png";

const PerformanceCard = ({ user, onClose }) => {
  if (!user) return null;

  console.log("📌 Opening Performance Card for:", user);

  const [courses, setCourses] = useState({});
  const [tutorCourses, setTutorCourses] = useState([]);
  const [classSchedule, setClassSchedule] = useState([]);
  const [availabilitySchedule, setAvailabilitySchedule] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [rejectedBookings, setRejectedBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [feedbackAverage, setFeedbackAverage] = useState(null);

  const [showReportModal, setShowReportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // 🔹 Track current table page
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchUserInformation = async () => {
      console.log(
        "🔍 Fetching all details for:",
        user.first_name,
        user.last_name
      );

      try {
        const [
          courseData,
          tutorCourseData,
          classScheduleData,
          availabilityScheduleData,
          pendingBookingsData,
          acceptedBookingsData,
          rejectedBookingsData,
          cancelledBookingsData,
          completedBookingsData,
          participantData,
        ] = await Promise.all([
          supabase.from("courses").select("course_code, course_name"),
          user.role === "tutor"
            ? supabase.from("tutor_courses").select("*").eq("tutor_id", user.id)
            : Promise.resolve({ data: [] }),
          supabase.from("class_schedule").select("*").eq("user_id", user.id),
          supabase
            .from("availability_schedule")
            .select("*")
            .eq("user_id", user.id),
          supabase
            .from("bookings")
            .select("*")
            .eq(user.role === "tutee" ? "tutee_id" : "tutor_id", user.id)
            .eq("status", "pending"),
          supabase
            .from("bookings")
            .select("*")
            .eq(user.role === "tutee" ? "tutee_id" : "tutor_id", user.id)
            .eq("status", "accepted"),
          supabase
            .from("bookings_history")
            .select("*")
            .eq(user.role === "tutee" ? "tutee_id" : "tutor_id", user.id)
            .eq("status", "rejected"),
          supabase
            .from("bookings_history")
            .select("*")
            .eq(user.role === "tutee" ? "tutee_id" : "tutor_id", user.id)
            .eq("status", "cancelled"),
          supabase
            .from("bookings_history")
            .select("*")
            .eq(user.role === "tutee" ? "tutee_id" : "tutor_id", user.id)
            .eq("status", "completed"),
          supabase.from("profiles").select("id, first_name, last_name"),
        ]);

        // Store Courses as { course_code: course_name }
        const courseMap = {};
        courseData.data.forEach((course) => {
          courseMap[course.course_code] = course.course_name;
        });
        setCourses(courseMap);

        // Format Tutor Courses course_name using courseMap
        const formattedTutorCourses = tutorCourseData.data.map((tc) => ({
          course_code: tc.course_code,
          course_name: courseMap[tc.course_code] || "Unknown",
        }));
        setTutorCourses(formattedTutorCourses);
        console.log("📚 Tutor Courses for User:", formattedTutorCourses);

        setClassSchedule(classScheduleData.data);
        setAvailabilitySchedule(availabilityScheduleData.data);

        // Create a mapping for participant names
        const participantMap = {};
        participantData.data.forEach((p) => {
          participantMap[p.id] = `${p.first_name} ${p.last_name}`;
        });

        // Helper Function to Format Dates (MM/DD/YYYY with no time)
        const formatDate = (date) => {
          return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        };

        // Helper Function to Format Bookings
        const formatBookings = (bookings, type) => {
          return bookings.map((booking) => ({
            id: booking.id,
            course: booking.course_code,
            // Determine participant based on role
            // If user is tutor, participant is tutee and vice versa
            participant:
              user.role === "tutor"
                ? participantMap[booking.tutee_id]
                : participantMap[booking.tutor_id],
            date: formatDate(booking.session_date),
            start_time: booking.start_time,
            end_time: booking.end_time,
            notes: booking.notes || "No additional notes.",
            status: booking.status,
            request_date: formatDate(booking.request_date),
            completed_date: formatDate(booking.completed_at) || "N/A",
            cancelled_by: booking.cancelled_by
              ? participantMap[booking.cancelled_by] || "Unknown"
              : "N/A",
          }));
        };

        setPendingBookings(formatBookings(pendingBookingsData.data, "Pending"));
        setAcceptedBookings(
          formatBookings(acceptedBookingsData.data, "Accepted")
        );
        setRejectedBookings(
          formatBookings(rejectedBookingsData.data, "Rejected")
        );
        setCancelledBookings(
          formatBookings(cancelledBookingsData.data, "Cancelled")
        );
        setCompletedBookings(
          formatBookings(completedBookingsData.data, "Completed")
        );

        // Fetch all feedback given to this user DIRECTLY
        // 1️⃣ Fetch all feedbacks
        const { data: feedbacks, error: feedbackError } = await supabase
          .from("feedback")
          .select("id, session_id, user_id, responses");

        if (feedbackError) {
          console.error("❌ Error fetching feedback:", feedbackError);
          return;
        }

        // 2️⃣ Sessions joined by session_id
        const sessionIds = feedbacks.map(f => f.session_id).filter(Boolean);
        const { data: sessions, error: sessionsError } = await supabase
          .from("bookings_history")
          .select("id, tutor_id, tutee_id")
          .in("id", sessionIds);

        if (sessionsError) {
          console.error("❌ Error fetching sessions:", sessionsError);
          return;
        }

        // 3️⃣ Map sessions for quick lookup
        const sessionMap = {};
        sessions.forEach(s => {
          sessionMap[s.id] = s;
        });

        // 4️⃣ Filter feedback that was RECEIVED by this user
        const relevantFeedbacks = feedbacks.filter(f => {
          const session = sessionMap[f.session_id];
          if (!session) return false;

          if (user.role === "tutor") {
            // Must be tutor's session, but feedback written by someone else
            return (
              session.tutor_id === user.id &&
              f.user_id !== user.id // Giver must not be same person
            );
          } else {
            return (
              session.tutee_id === user.id &&
              f.user_id !== user.id
            );
          }
        });

        // 5️⃣ Average `responses`
        const allScores = relevantFeedbacks.flatMap(f => {
          if (f.responses && typeof f.responses === "object") {
            return Object.values(f.responses).map(Number);
          }
          return [];
        });

        const feedbackAverage =
          allScores.length > 0
            ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1)
            : null;

        console.log("✅ Corrected received feedback average:", feedbackAverage);

        setFeedbackAverage(feedbackAverage);

      } catch (error) {
        console.error("❌ Error Fetching User Details:", error);
      }
    };

    fetchUserInformation();
  }, [user.id, user.role]);

  const renderStars = () => {
    if (feedbackAverage === null) return "N/A";

    const rounded = Math.floor(Number(feedbackAverage)); // Round down
    const maxStars = 5;

    // Create an array [1, 2, 3, 4, 5]
    const stars = [];
    for (let i = 0; i < maxStars; i++) {
      if (i < rounded) {
        stars.push(<span key={i}>⭐</span>); // Full star
      } else {
        stars.push(<span key={i}> </span>); // Empty star
      }
    }

    return stars;
  };

  const prepareReportData = () => {
    // Define report sections (tables)

    // If user is a tutor, include tutor courses, accepted bookings, rejected bookings,
    // class schedule, and availability schedule else do not include mentioned tables
    let pages = [];
    if (user.role === "tutor") {
      pages = [
        {
          title: "User Information",
          headers: [
            { label: "First Name", key: "first_name" },
            { label: "Last Name", key: "last_name" },
            { label: "Email", key: "email" },
            { label: "Role", key: "role" },
            { label: "Student Number", key: "student_number" },
            { label: "Program", key: "program" },
            { label: "Year", key: "year" },
          ],
          data: [
            {
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              role: user.role,
              student_number: user.student_number,
              program: user.program || "N/A",
              year: user.year || "N/A",
            },
          ],
        },
        {
          title: "Tutor Courses",
          headers: [
            { label: "Course Code", key: "course_code" },
            { label: "Course Name", key: "course_name" },
          ],
          data: tutorCourses || [],
        },
        {
          title: "Class Schedule",
          headers: [
            { label: "Day", key: "day_of_week" },
            { label: "Start Time", key: "start_time" },
            { label: "End Time", key: "end_time" },
            { label: "Course", key: "course_code" },
          ],
          data: classSchedule || [],
        },
        {
          title: "Availability Schedule",
          headers: [
            { label: "Day", key: "day_of_week" },
            { label: "Start Time", key: "start_time" },
            { label: "End Time", key: "end_time" },
          ],
          data: availabilitySchedule || [],
        },
        {
          title: "Accepted Bookings",
          headers: [
            { label: "Course", key: "course" },
            { label: "Participant", key: "participant" },
            { label: "Date", key: "date" },
            { label: "Start Time", key: "start_time" },
            { label: "End Time", key: "end_time" },
            { label: "Notes", key: "notes" },
            { label: "Request Date", key: "request_date" },
          ],
          data: acceptedBookings || [],
        },
        {
          title: "Rejected Bookings",
          headers: [
            { label: "Course", key: "course" },
            { label: "Participant", key: "participant" },
            { label: "Date", key: "date" },
            { label: "Start Time", key: "start_time" },
            { label: "End Time", key: "end_time" },
            { label: "Notes", key: "notes" },
            { label: "Request Date", key: "request_date" },
            { label: "Rejected Date", key: "completed_date" },
          ],
          data: rejectedBookings || [],
        },
        {
          title: "Pending Bookings",
          headers: [
            { label: "Course", key: "course" },
            { label: "Participant", key: "participant" },
            { label: "Date", key: "date" },
            { label: "Start Time", key: "start_time" },
            { label: "End Time", key: "end_time" },
            { label: "Notes", key: "notes" },
            { label: "Request Date", key: "request_date" },
          ],
          data: pendingBookings || [],
        },
        {
          title: "Cancelled Bookings",
          headers: [
            { label: "Course", key: "course" },
            { label: "Participant", key: "participant" },
            { label: "Date", key: "date" },
            { label: "Start Time", key: "start_time" },
            { label: "End Time", key: "end_time" },
            { label: "Notes", key: "notes" },
            { label: "Request Date", key: "request_date" },
            { label: "Cancelled Date", key: "completed_date" },
            { label: "Cancelled By", key: "cancelled_by" },
          ],
          data: cancelledBookings || [],
        },
        {
          title: "Completed Bookings",
          headers: [
            { label: "Course", key: "course" },
            { label: "Participant", key: "participant" },
            { label: "Date", key: "date" },
            { label: "Start Time", key: "start_time" },
            { label: "End Time", key: "end_time" },
            { label: "Notes", key: "notes" },
            { label: "Request Date", key: "request_date" },
            { label: "Completion Date", key: "completed_date" },
          ],
          data: completedBookings || [],
        },
      ];
    } else {
      pages = [
        {
          title: "User Information",
          headers: [
            { label: "First Name", key: "first_name" },
            { label: "Last Name", key: "last_name" },
            { label: "Email", key: "email" },
            { label: "Role", key: "role" },
            { label: "Student Number", key: "student_number" },
            { label: "Program", key: "program" },
            { label: "Year", key: "year" },
          ],
          data: [
            {
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              role: user.role,
              student_number: user.student_number,
              program: user.program || "N/A",
              year: user.year || "N/A",
            },
          ],
        },
        {
          title: "Pending Bookings",
          headers: [
            { label: "Course", key: "course" },
            { label: "Participant", key: "participant" },
            { label: "Date", key: "date" },
            { label: "Start Time", key: "start_time" },
            { label: "End Time", key: "end_time" },
            { label: "Notes", key: "notes" },
            { label: "Request Date", key: "request_date" },
          ],
          data: pendingBookings || [],
        },
        {
          title: "Cancelled Bookings",
          headers: [
            { label: "Course", key: "course" },
            { label: "Participant", key: "participant" },
            { label: "Date", key: "date" },
            { label: "Start Time", key: "start_time" },
            { label: "End Time", key: "end_time" },
            { label: "Notes", key: "notes" },
            { label: "Request Date", key: "request_date" },
            { label: "Cancelled Date", key: "completed_date" },
            { label: "Cancelled By", key: "cancelled_by" },
          ],
          data: cancelledBookings || [],
        },
        {
          title: "Completed Bookings",
          headers: [
            { label: "Course", key: "course" },
            { label: "Participant", key: "participant" },
            { label: "Date", key: "date" },
            { label: "Start Time", key: "start_time" },
            { label: "End Time", key: "end_time" },
            { label: "Notes", key: "notes" },
            { label: "Request Date", key: "request_date" },
            { label: "Completion Date", key: "completed_date" },
          ],
          data: completedBookings || [],
        },
      ];
    }

    setCsvHeaders(pages.map((page) => page.headers)); // Store headers for CSV
    setReportData(pages);
    setShowReportModal(true);
    setCurrentPage(0); // Reset to first page
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Ensure autoTable is attached to jsPDF
    if (!doc.autoTable) {
      console.error("🚨 autoTable is not attached to jsPDF!");
      return;
    }

    // Add Title
    doc.text(`User Report: ${user.first_name} ${user.last_name}`, 14, 15);

    // Generate tables for each report section
    reportData.forEach((section, index) => {
      const tableColumn = section.headers.map((header) => header.label);
      const tableRows = section.data.map((row) =>
        section.headers.map((header) => row[header.key] || "-")
      );

      // Move table down to avoid overlapping
      const startY = index === 0 ? 25 : doc.previousAutoTable.finalY + 10;

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: startY,
      });
    });

    // Save the PDF
    doc.save(`User_Report_${user.first_name}_${user.last_name}.pdf`);
  };

  return (
    <div className="overlay">
      <div className="performance-card">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <div className="profile-img">
          <img
            src={user.profile_picture || defaultAvatar}
            alt="Profile"
            className="profile-img"
          />
        </div>
        <h2>
          {user.first_name} {user.last_name}
        </h2>
        <p>User Role: {user.role}</p>
        <p>Email: {user.email}</p>
        <p>Student Number: {user.student_number}</p>
        <h2>{renderStars()}
          <br /> Rating: {feedbackAverage === null ? "N/A" : `${feedbackAverage} / 5`}
        </h2>
        <button className="download-btn" onClick={prepareReportData}>
          Generate User Report
        </button>
      </div>

      {/* 📌 Modal for Report Preview */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="close-btn"
              onClick={() => setShowReportModal(false)}
            >
              ✖
            </button>
            <h3>{reportData[currentPage].title}</h3>

            {/* Table Preview */}
            <table className="preview-table">
              <thead>
                <tr>
                  {reportData[currentPage].headers.map((header) => (
                    <th key={header.key}>{header.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Display first 7 rows */}
                {reportData[currentPage].data.slice(0, 7).map((row, index) => (
                  <tr key={index}>
                    {reportData[currentPage].headers.map((header) => (
                      <td key={header.key}>{row[header.key] || "-"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <p> Showing first 7 rows... </p>

            {/* Table Navigation */}
            <div className="modal-navigation">
              {currentPage > 0 && (
                <label
                  className="nav-btn"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  ← Back
                </label>
              )}

              {currentPage < reportData.length - 1 && (
                <label
                  className="nav-btn"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next →
                </label>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="modal-footer">
              <CSVLink
                data={reportData[currentPage].data}
                headers={reportData[currentPage].headers}
                filename={`User_Report_${user.first_name}.csv`}
                className="download-csv-btn"
              >
                Download CSV
              </CSVLink>
              <button className="generate-pdf-btn" onClick={generatePDF}>
                Generate PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceCard;
