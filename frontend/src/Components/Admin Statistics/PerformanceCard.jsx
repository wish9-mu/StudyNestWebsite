import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./PerformanceCard.css";

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

  useEffect(() => {
    const fetchUserInformation = async () => {
      console.log("🔍 Fetching all details for:", user.first_name, user.last_name);

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
          participantData
        ] = await Promise.all([
          supabase.from("courses").select("course_code, course_name"),
          user.role === "tutor" ? supabase.from("tutor_courses").select("*").eq("tutor_id", user.id) : Promise.resolve({ data: [] }),
          supabase.from("class_schedule").select("*").eq("user_id", user.id),
          supabase.from("availability_schedule").select("*").eq("user_id", user.id),
          supabase.from("bookings").select("*").eq(user.role === "tutee" ? "tutee_id" : "tutor_id", user.id).eq("status", "pending"),
          supabase.from("bookings").select("*").eq(user.role === "tutee" ? "tutee_id" : "tutor_id", user.id).eq("status", "accepted"),
          supabase.from("bookings_history").select("*").eq(user.role === "tutee" ? "tutee_id" : "tutor_id", user.id).eq("status", "rejected"),
          supabase.from("bookings_history").select("*").eq(user.role === "tutee" ? "tutee_id" : "tutor_id", user.id).eq("status", "cancelled"),
          supabase.from("bookings_history").select("*").eq(user.role === "tutee" ? "tutee_id" : "tutor_id", user.id).eq("status", "completed"),
          supabase.from("profiles").select("id, first_name, last_name")
        ]);

        // Store Courses as { course_code: course_name }
        const courseMap = {};
        courseData.data.forEach((course) => {
          courseMap[course.course_code] = course.course_name;
        });
        setCourses(courseMap);

        setTutorCourses(tutorCourseData.data);
        setClassSchedule(classScheduleData.data);
        setAvailabilitySchedule(availabilityScheduleData.data);

        // Create a mapping for participant names
        const participantMap = {};
        participantData.data.forEach((p) => {
          participantMap[p.id] = `${p.first_name} ${p.last_name}`;
        });

        // Helper Function to Format Bookings
        const formatBookings = (bookings, type) => {
          return bookings.map((booking) => ({
            id: booking.id,
            course: courseMap[booking.course_code] || booking.course_code,
            participant: participantMap[booking.tutor_id] || participantMap[booking.tutee_id] || "Unknown",
            date: booking.session_date,
            time: `${booking.start_time} - ${booking.end_time}`,
            notes: booking.notes || "No additional notes.",
            status: booking.status,
            request_date: booking.request_date,
            completed_date: booking.completed_at || "N/A",
            cancelled_by: booking.cancelled_by ? participantMap[booking.cancelled_by] || "Unknown" : "N/A",
          }));
        };

        setPendingBookings(formatBookings(pendingBookingsData.data, "Pending"));
        setAcceptedBookings(formatBookings(acceptedBookingsData.data, "Accepted"));
        setRejectedBookings(formatBookings(rejectedBookingsData.data, "Rejected"));
        setCancelledBookings(formatBookings(cancelledBookingsData.data, "Cancelled"));
        setCompletedBookings(formatBookings(completedBookingsData.data, "Completed"));
      } catch (error) {
        console.error("❌ Error Fetching User Details:", error);
      }
    };

    fetchUserInformation();
  }, [user.id, user.role]);

  // 📥 **Download Report Function (CSV)**
  const onDownloadReport = () => {
    console.log("📥 Generating CSV report for:", user.first_name, user.last_name);

    let csvContent = [
      `"User Information"`,
      `"First Name","Last Name","Email","Role","Student Number","Program","Year","Mobile","About Me"`,
      `"${user.first_name}","${user.last_name}","${user.email}","${user.role}","${user.student_number}","${user.program}","${user.year}","${user.mobile_number}","${user.about_me}"`,
    ].join("\n");

    if (user.role === "tutor") {
      // 🏫 **Tutor Courses**
      const formattedTutorCourses = tutorCourses.length > 0
        ? tutorCourses.map(tc => `"${tc.course_code}","${courses[tc.course_code] || "Unknown"}"`).join("\n")
        : `"No courses assigned","-"`;  

      csvContent += `\n\n"Tutor Courses"\n"Course Code","Course Name"\n${formattedTutorCourses}`;

      // 📅 **Class Schedule**
      csvContent += `\n\n"Class Schedule"\n"Day","Start Time","End Time","Course"\n` +
        (classSchedule.length > 0
          ? classSchedule.map(cs => `"${cs.day_of_week}","${cs.start_time}","${cs.end_time}","${cs.course_code}"`).join("\n")
          : `"No class schedule","-","-","-"`);

      // ⏳ **Availability Schedule**
      csvContent += `\n\n"Availability Schedule"\n"Day","Start Time","End Time"\n` +
        (availabilitySchedule.length > 0
          ? availabilitySchedule.map(av => `"${av.day_of_week}","${av.start_time}","${av.end_time}"`).join("\n")
          : `"No availability schedule","-","-"`);

      // ✅ **Accepted Bookings**
      csvContent += `\n\n"Accepted Bookings"\n"ID","Course","Participant","Date","Time","Notes","Request Date"\n` +
        (acceptedBookings.length > 0
          ? acceptedBookings.map(b => `"${b.id}","${b.course}","${b.participant}","${b.date}","${b.time}","${b.notes}","${b.request_date}"`).join("\n")
          : `"No accepted bookings","-","-","-","-","-","-"`);

      // ❌ **Rejected Bookings**
      csvContent += `\n\n"Rejected Bookings"\n"ID","Course","Participant","Date","Time","Notes","Request Date","Rejected Date"\n` +
        (rejectedBookings.length > 0
          ? rejectedBookings.map(b => `"${b.id}","${b.course}","${b.participant}","${b.date}","${b.time}","${b.notes}","${b.request_date}","${b.completed_date}"`).join("\n")
          : `"No rejected bookings","-","-","-","-","-","-","-"`);
        }

        // 📌 **Pending Bookings (For Both Tutors & Tutees)**
        csvContent += `\n\n"Pending Bookings"\n"ID","Course","Participant","Date","Time","Notes","Request Date"\n` +
        (pendingBookings.length > 0
            ? pendingBookings.map(b => `"${b.id}","${b.course}","${b.participant}","${b.date}","${b.time}","${b.notes}","${b.request_date}"`).join("\n")
            : `"No pending bookings","-","-","-","-","-","-"`);

        // 🚫 **Cancelled Bookings (For Both Tutors & Tutees)**
        csvContent += `\n\n"Cancelled Bookings"\n"ID","Course","Participant","Date","Time","Notes","Request Date","Cancelled Date","Cancelled By"\n` +
        (cancelledBookings.length > 0
            ? cancelledBookings.map(b => `"${b.id}","${b.course}","${b.participant}","${b.date}","${b.time}","${b.notes}","${b.request_date}","${b.completed_date}","${b.cancelled_by}"`).join("\n")
            : `"No cancelled bookings","-","-","-","-","-","-","-","-"`);

        // 🏆 **Completed Bookings (For Both Tutors & Tutees)**
        csvContent += `\n\n"Completed Bookings"\n"ID","Course","Participant","Date","Time","Notes","Request Date","Completion Date"\n` +
        (completedBookings.length > 0
            ? completedBookings.map(b => `"${b.id}","${b.course}","${b.participant}","${b.date}","${b.time}","${b.notes}","${b.request_date}","${b.completed_date}"`).join("\n")
            : `"No completed bookings","-","-","-","-","-","-","-"`);

        // 📝 **Generate and Download CSV File**
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Report_${user.first_name}_${user.last_name}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("✅ CSV report generated successfully!");
    };



  return (
    <div className="overlay">
      <div className="performance-card">
        <button className="close-btn" onClick={onClose}>✖</button>
        <div className="profile-img">
          <img src={user.profile_picture || "/default-avatar.png"} alt="Profile" className="profile-img" />
        </div>
        <h2>{user.first_name} {user.last_name}</h2>
        <p>User Role: {user.role}</p>
        <p>Email: {user.email}</p>
        <p>Student Number: {user.student_number}</p>
        <button className="download-btn" onClick={onDownloadReport}>Download Report</button>
      </div>
    </div>
  );
};

export default PerformanceCard;
