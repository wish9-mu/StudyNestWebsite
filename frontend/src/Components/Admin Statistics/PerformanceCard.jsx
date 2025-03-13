import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { supabase } from "../../supabaseClient";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // 
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

  const [showReportModal, setShowReportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // 🔹 Track current table page
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [reportData, setReportData] = useState([]);

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

  // // 📥 **Download Report Function (CSV)**
  // const onDownloadReport = () => {
  //   console.log("📥 Generating CSV report for:", user.first_name, user.last_name);

  //   let csvContent = [
  //     `"User Information"`,
  //     `"First Name","Last Name","Email","Role","Student Number","Program","Year","Mobile","About Me"`,
  //     `"${user.first_name}","${user.last_name}","${user.email}","${user.role}","${user.student_number}","${user.program}","${user.year}","${user.mobile_number}","${user.about_me}"`,
  //   ].join("\n");

  //   if (user.role === "tutor") {
  //     // 🏫 **Tutor Courses**
  //     const formattedTutorCourses = tutorCourses.length > 0
  //       ? tutorCourses.map(tc => `"${tc.course_code}","${courses[tc.course_code] || "Unknown"}"`).join("\n")
  //       : `"No courses assigned","-"`;  

  //     csvContent += `\n\n"Tutor Courses"\n"Course Code","Course Name"\n${formattedTutorCourses}`;

  //     // 📅 **Class Schedule**
  //     csvContent += `\n\n"Class Schedule"\n"Day","Start Time","End Time","Course"\n` +
  //       (classSchedule.length > 0
  //         ? classSchedule.map(cs => `"${cs.day_of_week}","${cs.start_time}","${cs.end_time}","${cs.course_code}"`).join("\n")
  //         : `"No class schedule","-","-","-"`);

  //     // ⏳ **Availability Schedule**
  //     csvContent += `\n\n"Availability Schedule"\n"Day","Start Time","End Time"\n` +
  //       (availabilitySchedule.length > 0
  //         ? availabilitySchedule.map(av => `"${av.day_of_week}","${av.start_time}","${av.end_time}"`).join("\n")
  //         : `"No availability schedule","-","-"`);

  //     // ✅ **Accepted Bookings**
  //     csvContent += `\n\n"Accepted Bookings"\n"ID","Course","Participant","Date","Time","Notes","Request Date"\n` +
  //       (acceptedBookings.length > 0
  //         ? acceptedBookings.map(b => `"${b.id}","${b.course}","${b.participant}","${b.date}","${b.time}","${b.notes}","${b.request_date}"`).join("\n")
  //         : `"No accepted bookings","-","-","-","-","-","-"`);

  //     // ❌ **Rejected Bookings**
  //     csvContent += `\n\n"Rejected Bookings"\n"ID","Course","Participant","Date","Time","Notes","Request Date","Rejected Date"\n` +
  //       (rejectedBookings.length > 0
  //         ? rejectedBookings.map(b => `"${b.id}","${b.course}","${b.participant}","${b.date}","${b.time}","${b.notes}","${b.request_date}","${b.completed_date}"`).join("\n")
  //         : `"No rejected bookings","-","-","-","-","-","-","-"`);
  //       }

  //       // 📌 **Pending Bookings (For Both Tutors & Tutees)**
  //       csvContent += `\n\n"Pending Bookings"\n"ID","Course","Participant","Date","Time","Notes","Request Date"\n` +
  //       (pendingBookings.length > 0
  //           ? pendingBookings.map(b => `"${b.id}","${b.course}","${b.participant}","${b.date}","${b.time}","${b.notes}","${b.request_date}"`).join("\n")
  //           : `"No pending bookings","-","-","-","-","-","-"`);

  //       // 🚫 **Cancelled Bookings (For Both Tutors & Tutees)**
  //       csvContent += `\n\n"Cancelled Bookings"\n"ID","Course","Participant","Date","Time","Notes","Request Date","Cancelled Date","Cancelled By"\n` +
  //       (cancelledBookings.length > 0
  //           ? cancelledBookings.map(b => `"${b.id}","${b.course}","${b.participant}","${b.date}","${b.time}","${b.notes}","${b.request_date}","${b.completed_date}","${b.cancelled_by}"`).join("\n")
  //           : `"No cancelled bookings","-","-","-","-","-","-","-","-"`);

  //       // 🏆 **Completed Bookings (For Both Tutors & Tutees)**
  //       csvContent += `\n\n"Completed Bookings"\n"ID","Course","Participant","Date","Time","Notes","Request Date","Completion Date"\n` +
  //       (completedBookings.length > 0
  //           ? completedBookings.map(b => `"${b.id}","${b.course}","${b.participant}","${b.date}","${b.time}","${b.notes}","${b.request_date}","${b.completed_date}"`).join("\n")
  //           : `"No completed bookings","-","-","-","-","-","-","-"`);

  //       // 📝 **Generate and Download CSV File**
  //       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //       const link = document.createElement("a");
  //       link.href = URL.createObjectURL(blob);
  //       link.download = `Report_${user.first_name}_${user.last_name}.csv`;
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);

  //       console.log("✅ CSV report generated successfully!");
  //   };

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
            { label: "ID", key: "id" },
            { label: "Course", key: "course" },
            { label: "Participant", key: "participant" },
            { label: "Date", key: "date" },
            { label: "Time", key: "time" },
            { label: "Notes", key: "notes" },
            { label: "Request Date", key: "request_date" },
          ],
          data: acceptedBookings || [],
        },
        {
          title: "Rejected Bookings",
          headers: [
            { label: "ID", key: "id" },
            { label: "Course", key: "course" },
            { label: "Participant", key: "participant" },
            { label: "Date", key: "date" },
            { label: "Time", key: "time" },
            { label: "Notes", key: "notes" },
            { label: "Request Date", key: "request_date" },
            { label: "Rejected Date", key: "completed_date" },
          ],
          data: rejectedBookings || [],
        },
        {
          title: "Pending Bookings",
          headers: [
            { label: "ID", key: "id" },
            { label: "Course", key: "course" },
            { label: "Participant", key: "participant" },
            { label: "Date", key: "date" },
            { label: "Time", key: "time" },
            { label: "Notes", key: "notes" },
            { label: "Request Date", key: "request_date" },
          ],
          data: pendingBookings || [],
        },
        { 
          title: "Cancelled Bookings",
          headers: [
            { label: "ID", key: "id" },
            { label: "Course", key: "course" },
            { label: "Participant", key: "participant" },
            { label: "Date", key: "date" },
            { label: "Time", key: "time" },
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
            { label: "ID", key: "id" },
            { label: "Course", key: "course" },
            { label: "Participant", key: "participant" },
            { label: "Date", key: "date" },
            { label: "Time", key: "time" },
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
            { label: "ID", key: "id" },
            { label: "Course", key: "course" },
            { label: "Participant", key: "participant" },
            { label: "Date", key: "date" },
            { label: "Time", key: "time" },
            { label: "Notes", key: "notes" },
            { label: "Request Date", key: "request_date" },
          ],
          data: pendingBookings || [],
        },
        { 
          title: "Cancelled Bookings",
          headers: [
            { label: "ID", key: "id" },
            { label: "Course", key: "course" },
            { label: "Participant", key: "participant" },
            { label: "Date", key: "date" },
            { label: "Time", key: "time" },
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
            { label: "ID", key: "id" },
            { label: "Course", key: "course" },
            { label: "Participant", key: "participant" },
            { label: "Date", key: "date" },
            { label: "Time", key: "time" },
            { label: "Notes", key: "notes" },
            { label: "Request Date", key: "request_date" },
            { label: "Completion Date", key: "completed_date" },
          ],
          data: completedBookings || [],
        },
      ];
    };

    setCsvHeaders(pages.map(page => page.headers)); // Store headers for CSV
    setReportData(pages);
    setShowReportModal(true);
    setCurrentPage(0); // Reset to first page
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    autoTable(doc);

    let yOffset = 20;
    reportData.forEach((section) => {
      doc.text(section.title, 14, yOffset);
      doc.autoTable({
        head: [section.headers.map(header => header.label)],
        body: section.data.map(row => section.headers.map(header => row[header.key] || "-")),
        startY: yOffset + 10,
      });
      yOffset = doc.lastAutoTable.finalY + 15;
    });

    doc.save(`User_Report_${user.first_name}_${user.last_name}.pdf`);
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
        <button className="download-btn" onClick={prepareReportData}>
          Generate User Report
        </button>
      </div>

      {/* 📌 Modal for Report Preview */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setShowReportModal(false)}>✖</button>
            <h3>{reportData[currentPage].title}</h3>

            {/* Table Preview */}
            <table className="preview-table">
              <thead>
                <tr>
                  {reportData[currentPage].headers.map(header => (
                    <th key={header.key}>{header.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData[currentPage].data.map((row, index) => (
                  <tr key={index}>
                    {reportData[currentPage].headers.map(header => (
                      <td key={header.key}>{row[header.key] || "-"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Navigation Buttons */}
            <div className="modal-navigation">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                ⬅ Back
              </button>
              <button
                disabled={currentPage === reportData.length - 1}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next ➡
              </button>
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
