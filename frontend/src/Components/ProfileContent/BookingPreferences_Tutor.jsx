import React, { useState, useEffect } from "react";
import Select from "react-select";
import { supabase } from "../../supabaseClient";

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
      console.log("✅ User ID:", userData.user.id);
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
        console.log("✅ Courses loaded:", data);
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
        console.log("✅ Tutor's preferred courses:", data);
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
    const coursesToAdd = selectedCourseCodes.filter((code) => !existingCourses.includes(code));
    const coursesToDelete = existingCourses.filter((code) => !selectedCourseCodes.includes(code));

    // 🔹 Insert new selected courses
    for (const courseCode of coursesToAdd) {
      const { error } = await supabase.from("tutor_courses").insert([
        { tutor_id: userId, course_code: courseCode },
      ]);
      if (error) console.error(`❌ Error adding course ${courseCode}:`, error);
      else console.log(`✅ Added course ${courseCode}`);
    }

    // 🔹 Delete unselected courses
    for (const courseCode of coursesToDelete) {
      const { error } = await supabase
        .from("tutor_courses")
        .delete()
        .eq("tutor_id", userId)
        .eq("course_code", courseCode);
      if (error) console.error(`❌ Error deleting course ${courseCode}:`, error);
      else console.log(`✅ Removed course ${courseCode}`);
    }
  };

  return (
    <div className="profile-section">
      <h2>Booking Preferences</h2>

      {/* 🔹 Preferred Courses Dropdown with Auto-Suggestions */}
      <label>Preferred Courses:</label>
      <Select
        isMulti
        options={courses} // Use Supabase courses
        value={selectedCourses}
        onChange={handleCourseChange}
        placeholder="Search and select courses..."
      />
    </div>
  );
};

export default BookingPreferences;
