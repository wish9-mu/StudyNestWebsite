import React, { useEffect, useState } from "react";
import Nav from "../Nav/Nav";
import "./Request.css";
import Select from "react-select";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const GuestRequest = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [tutor_id, setTutorId] = useState(null);
  const [session_date, setSessionDate] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loadingTutors, setLoadingTutors] = useState(false); // Track if tutors are being fetched

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

      setCourses(
        data.map((course) => ({
          value: course.course_code,
          label: course.course_name,
        }))
      );
    };

    fetchCourses();
  }, []);

  // 🔹 Get Weekday from `session_date`
  const getWeekday = (date) => {
    return new Date(date).toLocaleString("en-us", { weekday: "long" });
  };

  // 🔹 Fetch Tutors (Triggered only when all required fields are set)
  useEffect(() => {
    if (selectedCourse && session_date && start_time && end_time) {
      fetchAvailableTutors();
    }
  }, [selectedCourse, session_date, start_time, end_time]);

  const fetchAvailableTutors = async () => {
    if (!selectedCourse || !session_date || !start_time || !end_time) {
      alert("Please select course, date, and time before choosing a tutor.");
      return;
    }

    try {
      // Convert session_date to week day format (e.g., "Monday")
      const sessionDay = new Date(session_date).toLocaleString("en-us", {
        weekday: "long",
      });

      // Fetch tutor availability
      const { data: availabilityData, error: availabilityError } =
        await supabase
          .from("availability_schedule")
          .select("user_id")
          .eq("day_of_week", sessionDay)
          .lte("start_time", start_time)
          .gte("end_time", end_time);

      if (availabilityError) throw availabilityError;
      if (!availabilityData || availabilityData.length === 0) {
        setTutors([]); // No tutors available
        console.log("No tutors available for the selected time slot.");
        return;
      }

      // Extract tutor IDs
      const tutorIds = availabilityData.map((row) => row.user_id);

      // Fetch tutor details
      const { data: tutorData, error: tutorError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .in("id", tutorIds)
        .eq("role", "tutor");

      if (tutorError) throw tutorError;

      // Ensure data is always an array
      setTutors(tutorData || []);
    } catch (error) {
      console.error("❌ Error fetching tutors:", error);
      setTutors([]); // Reset if there's an error
    }
  };

  // 🔹 Handle Tutor Selection
  const handleTutorSelect = (selectedTutor) => {
    if (!selectedCourse || !session_date || !start_time || !end_time) {
      alert("Please complete the form before selecting a tutor.");
      return;
    }
    setTutorId(selectedTutor);
  };

  // 🔹 Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !selectedCourse ||
      !tutor_id ||
      !session_date ||
      !start_time ||
      !end_time
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (start_time < "07:00" || end_time > "19:00") {
      alert("Time must be between 7:00 AM and 7:00 PM.");
      return;
    }

    if (
      new Date(`1970-01-01T${end_time}`) <= new Date(`1970-01-01T${start_time}`)
    ) {
      alert("End time must be after start time.");
      return;
    }

    const newBooking = {
      tutee_id: userId,
      tutor_id: tutor_id.value,
      course_code: selectedCourse.value,
      session_date,
      start_time,
      end_time,
      notes,
    };

    try {
      const { error } = await supabase.from("bookings").insert([newBooking]);

      if (error) throw error;

      alert("Request submitted successfully!");
      resetForm();
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  // 🔹 Handle Form Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "session_date":
        setSessionDate(value);
        break;
      case "start_time":
        setStartTime(value);
        break;
      case "end_time":
        setEndTime(value);
        break;
      case "notes":
        setNotes(value);
        break;
      default:
        break;
    }
  };

  const resetForm = () => {
    setSelectedCourse(null);
    setTutorId(null);
    setSessionDate("");
    setStartTime("");
    setEndTime("");
    setNotes("");
  };

  return (
    <>
      <Nav />
      <div className="request-container">
        <div className="request-card">
          <div className="request-header">
            <h1 className="request-title">Request a Tutor</h1>
            <p className="request-subtitle">
              Fill out the form below to book your tutoring session.
            </p>
          </div>

          <form className="form-grid">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Course</label>
                <Select
                  options={courses}
                  value={selectedCourse}
                  onChange={setSelectedCourse}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Session Date</label>
                <input
                  type="date"
                  name="session_date"
                  value={session_date}
                  onChange={handleChange}
                  min={
                    new Date(new Date().setDate(new Date().getDate() + 1))
                      .toISOString()
                      .split("T")[0]
                  }
                  max={
                    new Date(new Date().setDate(new Date().getDate() + 14))
                      .toISOString()
                      .split("T")[0]
                  }
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Time:</label>
                <input
                  type="time"
                  name="start_time"
                  value={start_time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Time:</label>
                <input
                  type="time"
                  name="end_time"
                  value={end_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tutor Preference</label>
              <Select
                options={tutors}
                value={tutor_id}
                onChange={setTutorId}
                isDisabled={
                  loadingTutors ||
                  !selectedCourse ||
                  !session_date ||
                  !start_time ||
                  !end_time
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Additional Details</label>
              <textarea
                name="notes"
                value={notes}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Tell us about your learning goals..."
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              onClick={handleSubmit}
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default GuestRequest;
