import React, { useEffect, useState } from "react";
import TuteeNav from "../Nav/TuteeNav";
import "./Request.css";
import Select from "react-select";
import { supabase } from "../../supabaseClient";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../Modal/Modal.css";

const Request = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [session_date, setSessionDate] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loadingTutors, setLoadingTutors] = useState(false); // Track if tutors are being fetched
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [showWaitlistConfirm, setShowWaitlistConfirm] = useState(false);
  const [pendingWaitlistData, setPendingWaitlistData] = useState(null);
  const [showNoTutorModal, setShowNoTutorModal] = useState(false);
  const [suggestedTimes, setSuggestedTimes] = useState([]); // Array of objects: { session_date, start_time, end_time }
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  

  //FOR SEARCH BAR////////////////

  // Pre-select course from query param
  useEffect(() => {
    const courseParam = searchParams.get("course");
    if (courseParam && courses.length > 0) {
      const found = courses.find((c) => c.value === courseParam);
      if (found) setSelectedCourse(found);
    }
  }, [searchParams, courses]);

  ////////////////////////////////

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
      setModalMsg(
        "Please select course, date, and time before choosing a tutor."
      );
      setShowModal(true);
      return;
    }

    try {
      // Convert session_date to week day format (e.g., "Monday")
      const sessionDay = new Date(session_date).toLocaleString("en-us", {
        weekday: "long",
      });
      console.log("🔹 Converted session date to weekday:", sessionDay);

      // Fetch tutor availability
      const { data: availabilityData, error: availabilityError } =
        await supabase
          .from("availability_schedule")
          .select("user_id")
          .eq("day_of_week", sessionDay)
          .lte("start_time", start_time)
          .gte("end_time", end_time);

      if (availabilityError) {
        setModalMsg(availabilityError.message);
        showModal(true);
        throw availabilityError;
      }

      console.log("✅ Tutor availability data fetched:", availabilityData);

      if (!availabilityData || availabilityData.length === 0) {
        setTutors([]); // No tutors available
        console.log("No tutors available for the selected time slot.");
        setModalMsg("No tutors available for the selected time slot.");
        setShowModal(true);
        return;
      }

      // Extract tutor IDs
      const tutorIds = availabilityData.map((row) => row.user_id);
      console.log("🆔 Tutor IDs matching availability:", tutorIds);

      if (tutorIds.length === 0) {
        console.warn("⚠️ No tutor IDs were extracted.");
        setTutors([]);
        return;
      }

      // 🛠 Fetch tutors who teach the selected course
      const { data: tutorsTeachingCourse, error: courseError } = await supabase
        .from("tutor_courses")
        .select("tutor_id")
        .eq("course_code", selectedCourse.value)
        .in("tutor_id", tutorIds); // Filter tutors that match both availability and course

      if (courseError) {
        setModalMsg(courseError.message);
        showModal(true);
        throw courseError;
      }
      console.log("📚 Tutors who teach this course:", tutorsTeachingCourse);

      const finalTutorIds = tutorsTeachingCourse.map((t) => t.tutor_id);

      if (finalTutorIds.length === 0) {
        console.warn("⚠️ No tutors found who teach this course.");
        setModalMsg("No tutors found who teach this course.");
        setShowModal(true);
        setTutors([]);
        return;
      }

      // Exclude tutors who have active bookings at the selected time
      const { data: bookedTutors, error: bookedError } = await supabase
        .from("bookings")
        .select("tutor_id")
        .eq("session_date", session_date)
        .or(`and(start_time.lte.${end_time}, end_time.gte.${start_time})`)
        .eq("status", "accepted"); // Only consider accepted bookings

      if (bookedError) {
        setModalMsg(bookedError.message);
        setShowModal(true);
        throw bookedError;
      }
      console.log("🚫 Tutors who are already booked:", bookedTutors);

      // Remove booked tutors from the available list
      const bookedTutorIds = bookedTutors.map((b) => b.tutor_id);
      const availableTutors = finalTutorIds.filter(
        (id) => !bookedTutorIds.includes(id)
      );

      if (availableTutors.length === 0) {
        // Find alternate available slots for the same course and date
        // 1. Get all tutors who teach the course and are available on the selected day
        const { data: allTutors, error: allTutorsError } = await supabase
          .from("tutor_courses")
          .select("tutor_id")
          .eq("course_code", selectedCourse.value);

        if (allTutorsError) {
          setModalMsg("Could not fetch tutors for suggestions.");
          setShowModal(true);
          setTutors([]);
          return;
        }

        const allTutorIds = allTutors.map((t) => t.tutor_id);

        // 2. Get all availability slots for these tutors on the same weekday
        const sessionDay = new Date(session_date).toLocaleString("en-us", {
          weekday: "long",
        });

        const { data: availSlots, error: availSlotsError } = await supabase
          .from("availability_schedule")
          .select("user_id, start_time, end_time")
          .eq("day_of_week", sessionDay)
          .in("user_id", allTutorIds);

        if (availSlotsError) {
          setModalMsg("Could not fetch availability for suggestions.");
          setShowModal(true);
          setTutors([]);
          return;
        }

        // 3. For each slot, check if the tutor is already booked at that time
        const suggestions = [];
        for (const slot of availSlots) {
          // Check for accepted bookings for this tutor at this date and time
          const { data: conflicts, error: conflictError } = await supabase
            .from("bookings")
            .select("id")
            .eq("tutor_id", slot.user_id)
            .eq("session_date", session_date)
            .eq("status", "accepted")
            .or(
              `and(start_time.lte.${slot.end_time},end_time.gte.${slot.start_time})`
            );

          if (conflictError) continue;
          if (!conflicts || conflicts.length === 0) {
            // No conflict, suggest this slot
            suggestions.push({
              session_date,
              start_time: slot.start_time,
              end_time: slot.end_time,
            });
            if (suggestions.length >= 3) break;
          }
        }

        if (suggestions.length === 0) {
          setModalMsg("No alternate times found. Please try another day.");
          setShowModal(true);
          setTutors([]);
          return;
        }

        setSuggestedTimes(suggestions);
        setShowNoTutorModal(true);
        setTutors([]);
        return;
      }

      // Fetch tutor details
      const { data: tutorData, error: tutorError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .in("id", tutorIds)
        .eq("role", "tutor");

      if (tutorError) {
        setModalMsg(tutorError.message);
        showModal(true);
        throw tutorError;
      }
      console.log("✅ Tutors fetched after filtering:", tutorData);

      // Convert tutor data to react-select format
      const formattedTutors = tutorData.map((tutor) => ({
        value: tutor.id,
        label: `${tutor.first_name} ${tutor.last_name}`, // Display full name
      }));

      // Ensure data is always an array
      setTutors(formattedTutors || []);
    } catch (error) {
      console.error("❌ Error fetching tutors:", error);
      setTutors([]); // Reset if there's an error
    } finally {
      setLoadingTutors(false);
    }
  };

  // 🔹 Handle Tutor Selection
  const handleTutorSelect = (selectedTutor) => {
    if (!selectedCourse || !session_date || !start_time || !end_time) {
      setModalMsg("Please complete the form before selecting a tutor.");
      setShowModal(true);
      return;
    }
    console.log("🎯 Selected Tutor:", selectedTutor);
    setSelectedTutor(selectedTutor); // Store only the tutor ID
  };

  // 🔹 Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (start_time < "07:00" || end_time > "19:00") {
      setModalMsg("Time must be between 7:00 AM and 7:00 PM.");
      setShowModal(true);
      return;
    }

    if (
      new Date(`1970-01-01T${end_time}`) <= new Date(`1970-01-01T${start_time}`)
    ) {
      setModalMsg("End time must be after start time.");
      setShowModal(true);
      return;
    }

    if (
      !selectedCourse ||
      !selectedTutor ||
      !session_date ||
      !start_time ||
      !end_time
    ) {
      setModalMsg("Please fill in all fields.");
      setShowModal(true);
      return;
    }

    const newBooking = {
      tutee_id: userId,
      tutor_id: selectedTutor.value,
      course_code: selectedCourse.value,
      session_date,
      start_time,
      end_time,
      notes,
      status: "pending",
    };

    try {
      console.log("📤 Submitting new booking:", newBooking);

      const { error } = await supabase.from("bookings").insert([newBooking]);

      if (error) {
        setModalMsg(error.message);
        setShowModal(true);
        throw error;
      }

      setModalMsg("Request submitted successfully!");
      setShowModal(true);
      resetForm();
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  // 🔹 Handle Waitlist Confirmation
  const handleWaitlistConfirm = async (proceed) => {
    setShowWaitlistConfirm(false);
    if (proceed && pendingWaitlistData) {
      try {
        const { error } = await supabase.from("waitlist").insert([pendingWaitlistData]);
        if (error) {
          setModalMsg("Could not add to waitlist: " + error.message);
        } else {
          setModalMsg("You have been added to the waitlist.");
        }
      } catch (err) {
        setModalMsg("Could not add to waitlist: " + err.message);
      }
      setShowModal(true);
      setPendingWaitlistData(null);
    } else {
      setPendingWaitlistData(null);
    }
  };

  // 🔹 Handle Form Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "session_date":
        // If a tutor is selected, reset the tutor selection to fetch new tutors
        if (selectedTutor) setSelectedTutor(null);
        setSessionDate(value);
        break;
      case "start_time":
        if (selectedTutor) setSelectedTutor(null);
        setStartTime(value);
        break;
      case "end_time":
        if (selectedTutor) setSelectedTutor(null);
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
    setSelectedTutor(null);
    setSessionDate("");
    setStartTime("");
    setEndTime("");
    setNotes("");
  };

  return (
    <>
      <TuteeNav />
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
                  onChange={(selectedOption) => {
                    setSelectedCourse(selectedOption);
                    if (selectedTutor) setSelectedTutor(null);
                  }}
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
                value={selectedTutor}
                onChange={handleTutorSelect}
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
        {showNoTutorModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>No tutors are available for your selected slot.</h2>
              <p>What would you like to do?</p>
              <div className="modal-actions">
                <button
                  className="accept"
                  onClick={async () => {
                    // Join waitlist
                    await handleWaitlistConfirm(true);
                    setShowNoTutorModal(false);
                  }}
                >
                  Join the waitlist
                </button>
                <div style={{ margin: "12px 0" }}>
                  <label>
                    <span>Rebook for a suggested time:</span>
                    <select
                      style={{ marginLeft: "8px" }}
                      value={selectedSuggestion || ""}
                      onChange={(e) => {
                        setSelectedSuggestion(e.target.value);
                      }}
                    >
                      <option value="">Select a time</option>
                      {suggestedTimes.map((slot, i) => (
                        <option key={i} value={JSON.stringify(slot)}>
                          {`${slot.session_date} ${slot.start_time}–${slot.end_time}`}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="accept"
                    style={{ marginLeft: "12px" }}
                    disabled={!selectedSuggestion}
                    onClick={() => {
                      if (selectedSuggestion) {
                        const suggestionObj = JSON.parse(selectedSuggestion);
                        setSessionDate(suggestionObj.session_date);
                        setStartTime(suggestionObj.start_time);
                        setEndTime(suggestionObj.end_time);
                        setShowNoTutorModal(false);
                        setSelectedTutor(null);
                        setSelectedSuggestion(null);
                        setSuggestedTimes([]);
                      }
                    }}
                  >
                    Rebook
                  </button>
                </div>
                <button
                  className="reject"
                  onClick={() => {
                    setShowNoTutorModal(false);
                    setSelectedSuggestion(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <></>
      </div>
    </>
  );
};

export default Request;
