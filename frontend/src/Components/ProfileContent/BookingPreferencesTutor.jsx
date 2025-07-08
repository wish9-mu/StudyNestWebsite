import React, { useState, useEffect } from "react";
import Select from "react-select";
import { supabase } from "../../supabaseClient";
import "./BookingPreferencesTutor.css"; // Import your CSS styles

const BookingPreferences = () => {
  const [selectedCourses, setSelectedCourses] = useState([]); // Selected courses
  const [courses, setCourses] = useState([]); // All available courses
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // 🔹 Fetch Available Courses from Supabase
  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("course_code, course_name");

      if (error) {
        console.error("❌ Error fetching courses:", error);
      } else {
        setCourses(
          data.map((course) => ({
            value: course.course_code,
            label: `${course.course_code} - ${course.course_name}`,
          }))
        );
      }
    };

    fetchCourses();
  }, []);

  // 🔹 Fetch Tutor's Preferred Courses from `tutor_courses`
  useEffect(() => {
    const fetchTutorCourses = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("tutor_courses")
        .select("course_code")
        .eq("tutor_id", userId);

      if (error) {
        console.error("❌ Error fetching tutor courses:", error);
      } else {
        setSelectedCourses(
          data.map((entry) => ({
            value: entry.course_code,
            label: entry.course_code, // Adjust if necessary
          }))
        );
      }
    };

    fetchTutorCourses();
  }, [userId]);

  // 🔹 Handle Course Selection
  const handleCourseChange = async (selectedOptions) => {
    setSelectedCourses(selectedOptions);

    const selectedCourseCodes = selectedOptions.map((course) => course.value);

    // 🔹 Get currently saved courses in the database
    const { data: existingData, error: fetchError } = await supabase
      .from("tutor_courses")
      .select("course_code")
      .eq("tutor_id", userId);

    if (fetchError) {
      console.error("❌ Error fetching existing courses:", fetchError);
      return;
    }

    const existingCourses = existingData.map((entry) => entry.course_code);

    // 🔹 Determine which courses to ADD and DELETE
    const coursesToAdd = selectedCourseCodes.filter(
      (code) => !existingCourses.includes(code)
    );
    const coursesToDelete = existingCourses.filter(
      (code) => !selectedCourseCodes.includes(code)
    );

    // 🔹 Insert new selected courses
    for (const courseCode of coursesToAdd) {
      const { error } = await supabase
        .from("tutor_courses")
        .insert([{ tutor_id: userId, course_code: courseCode }]);
      if (error) {
        console.error(`❌ Error adding course ${courseCode}:`, error);
      }
    }

    // 🔹 Delete unselected courses
    for (const courseCode of coursesToDelete) {
      const { error } = await supabase
        .from("tutor_courses")
        .delete()
        .eq("tutor_id", userId)
        .eq("course_code", courseCode);
      if (error)
        console.error(`❌ Error deleting course ${courseCode}:`, error);
      else console.log("✅ Removed course");
    }
  };

  return (
    <div className="booking-preferences">
      <div className="field">
        <label htmlFor="course-select">Preferred Courses:</label>
        <Select
          inputId="course-select"
          className="booking-select"
          classNamePrefix="booking"
          isMulti
          options={courses}
          value={selectedCourses}
          onChange={handleCourseChange}
          placeholder="Search and select courses..."
        />
      </div>
    </div>
  );
};

export default BookingPreferences;
