import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const BookingPreferences = () => {
  const [preferences, setPreferences] = useState({
    preferred_courses: "",
    availability_schedule: "",
    class_schedule: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("preferred_courses, availability_schedule, class_schedule")
        .eq("id", supabase.auth.user()?.id)
        .single();

      if (error) console.error("Error fetching preferences:", error);
      else setPreferences(data);

      setLoading(false);
    };

    fetchPreferences();
  }, []);

  const handleChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update(preferences)
      .eq("id", supabase.auth.user()?.id);

    if (error) console.error("Error updating preferences:", error);
    else setEditMode(false);

    setLoading(false);
  };

  return (
    <div className="profile-section">
      <h2>Booking Preferences</h2>
      <label>Preferred Courses:</label>
      <textarea name="preferred_courses" value={preferences.preferred_courses} onChange={handleChange} disabled={!editMode} />
      
      <label>Availability Schedule:</label>
      <textarea name="availability_schedule" value={preferences.availability_schedule} onChange={handleChange} disabled={!editMode} />
      
      <label>Class Schedule:</label>
      <textarea name="class_schedule" value={preferences.class_schedule} onChange={handleChange} disabled={!editMode} />

      {!editMode ? (
        <button onClick={() => setEditMode(true)}>Edit Account Information</button>
        ) : (
        <>
            <button onClick={() => setEditMode(false)}>Cancel</button>
            <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
            </button>
        </>
        )}
        
      </div>
  );
};

export default BookingPreferences;
