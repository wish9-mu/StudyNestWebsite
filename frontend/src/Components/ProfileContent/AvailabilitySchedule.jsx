import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Select from "react-select";
import "./AvailabilitySchedule.css";

const weekdays = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
];

const AvailabilitySchedule = () => {
  const [userId, setUserId] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

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

  // 🔹 Fetch availability slots from Supabase
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("availability_schedule")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("❌ Error fetching availability:", error);
        return;
      }

      setAvailability(data);
    };

    fetchAvailability();

    // Listen for database changes (optional real-time updates)
    const subscription = supabase
      .channel("availability_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "availability_schedule" },
        fetchAvailability
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  // 🔹 Handle Save (Insert or Update)
  const handleSave = async () => {
    if (!selectedDay || !startTime || !endTime) {
      alert("Please fill in all fields.");
      return;
    }

    if (startTime < "07:00" || endTime > "19:00") {
      alert("Time must be between 7:00 AM and 7:00 PM.");
      return;
    }

    if (
      new Date(`1970-01-01T${endTime}`) <= new Date(`1970-01-01T${startTime}`)
    ) {
      alert("End time must be after start time.");
      return;
    }

    if (userId === null) {
      console.error("❌ User ID not found.");
      return;
    }

    const newSlot = {
      user_id: userId,
      day_of_week: selectedDay.value,
      start_time: startTime,
      end_time: endTime,
    };

    try {
      let data, error;
      if (editingId) {
        // Attempt to update an existing slot
        ({ data, error } = await supabase
          .from("availability_schedule")
          .update(newSlot)
          .eq("id", editingId)
          .eq("user_id", userId));

        if (!error) {
          setAvailability((prevAvailability) =>
            prevAvailability.map((slot) =>
              slot.id === editingId ? { ...slot, ...newSlot } : slot
            )
          );
        }
      } else {
        // Attempt to insert a new slot
        ({ data, error } = await supabase
          .from("availability_schedule")
          .insert([newSlot])
          .select());

        if (!error && data && data.length > 0) {
          setAvailability([...availability, { ...newSlot, id: data[0].id }]);
        }
      }

      if (error) {
        throw error;
      }

      console.log("✅ Availability updated successfully.");
      resetForm();
    } catch (err) {
      console.error("❌ Database error:", err);
      alert(
        "❌ This time slot conflicts with an existing availability or class schedule slot."
      );
    }
  };

  // 🔹 Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    try {
      const { error } = await supabase
        .from("availability_schedule")
        .delete()
        .eq("id", deletingId)
        .eq("user_id", userId);

      if (error) throw error;

      // Update UI to remove the deleted slot
      setAvailability(availability.filter((slot) => slot.id !== deletingId));
      setShowDeleteModal(false);

      console.log("✅ Availability slot deleted successfully.");
    } catch (err) {
      console.error("❌ Error deleting availability:", err);
      alert("❌ Failed to delete slot.");
    }
  };

  // 🔹 Handle Edit
  const handleEdit = async (slot) => {
    setSelectedDay(weekdays.find((d) => d.value === slot.day_of_week));
    setStartTime(slot.start_time);
    setEndTime(slot.end_time);
    setEditingId(slot.id);
    setShowModal(true);

    // Fetch latest slot data from Supabase
    const { data, error } = await supabase
      .from("availability_schedule")
      .select("*")
      .eq("id", slot.id)
      .single();

    if (!error && data) {
      setStartTime(data.start_time);
      setEndTime(data.end_time);
    }
  };

  // 🔹 Reset Form
  const resetForm = () => {
    setSelectedDay(null);
    setStartTime("");
    setEndTime("");
    setEditingId(null);
    setShowModal(false);
  };

  // Format time for display (HH:MM:SS to HH:MM)
  const formatTime = (time) => {
    return time.substring(0, 5);
  };

  return (
    <div className="availability-container">
      <div className="availability-header">
        <h2>My Availability Schedule</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Availability
        </button>
      </div>

      {/* Display Availability Slots */}
      {availability.length > 0 ? (
        <ul className="availability-list">
          {availability.map((slot) => (
            <li key={slot.id} className="availability-item">
              <div className="slot-details">
                <span className="day-label">{slot.day_of_week}:</span>
                <span className="time-label">
                  {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                </span>
              </div>
              <div className="slot-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(slot)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setDeletingId(slot.id);
                    setShowDeleteModal(true);
                  }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          No availability slots set up yet. Add your first slot to get started.
        </p>
      )}

      {/* Modal Form for Adding / Editing Availability */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingId ? "Edit Availability" : "Add Availability"}</h3>

            <div className="form-group">
              <label>Day of Week</label>
              <Select
                options={weekdays}
                value={selectedDay}
                onChange={(opt) => setSelectedDay(opt)}
                placeholder="Select day..."
                className="day-select"
              />
            </div>

            <div className="form-group">
              <label>Start Time:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="time-input"
                min="07:00"
                max="19:00"
              />
            </div>

            <div className="form-group">
              <label>End Time:</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="time-input"
                min="07:00"
                max="19:00"
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to remove this slot? This action is
              irreversible.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilitySchedule;
