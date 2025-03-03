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
    }, [userId]);

    // 🔹 Check for Overlapping Slots
    const isOverlapping = (day, start, end, id = null) => {
        return availability.some((slot) => {
            if (slot.day_of_week !== day || slot.id === id) return false;
    
            const slotStart = new Date(`1970-01-01T${slot.start_time}`);
            const slotEnd = new Date(`1970-01-01T${slot.end_time}`);
            const newStart = new Date(`1970-01-01T${start}`);
            const newEnd = new Date(`1970-01-01T${end}`);
    
            return (
                (newStart >= slotStart && newStart < slotEnd) || // New start falls inside existing slot
                (newEnd > slotStart && newEnd <= slotEnd) || // New end falls inside existing slot
                (newStart <= slotStart && newEnd >= slotEnd) // New slot completely covers existing slot
            );
        });
    };
    

    

    // 🔹 Handle Save (Insert or Update)
    const handleSave = async () => {
        if (!selectedDay || !startTime || !endTime) {
            alert("Please fill in all fields.");
            return;
        }
    
        if (startTime < "07:00" || endTime > "21:00") {
            alert("Time must be between 7:00 AM and 9:00 PM.");
            return;
        }
    
        if (new Date(`1970-01-01T${endTime}`) <= new Date(`1970-01-01T${startTime}`)) {
            alert("End time must be after start time.");
            return;
        }
    
        if (userId === null) {
            console.error("❌ User ID not found.");
            return;
        }
    
        // Check for overlapping slots before saving
        if (isOverlapping(selectedDay.value, startTime, endTime, editingId)) {
            alert("❌ This time slot overlaps with an existing availability slot.");
            return;
        }
    
        const newSlot = {
            user_id: userId,
            day_of_week: selectedDay.value,
            start_time: startTime,
            end_time: endTime,
        };
    
        let data, error;
        if (editingId) {
            // Update existing slot
            ({ data, error } = await supabase
                .from("availability_schedule")
                .update(newSlot)
                .eq("id", editingId)
                .eq("user_id", userId));
    
            if (!error) {
                // ✅ Replace the updated slot in the state instead of adding it
                setAvailability((prevAvailability) =>
                    prevAvailability.map((slot) =>
                        slot.id === editingId ? { ...slot, ...newSlot } : slot
                    )
                );
            }
        } else {
            // Insert new slot
            ({ data, error } = await supabase
                .from("availability_schedule")
                .insert([newSlot])
                .select());
    
            if (!error && data && data.length > 0) {
                setAvailability([...availability, { ...newSlot, id: data[0].id }]);
            }
        }
    
        if (error) {
            console.error("❌ Error saving availability:", error);
        } else {
            console.log("✅ Availability updated successfully.");
        }
    
        resetForm();
    };
    
    
    

    // 🔹 Handle Delete Confirmation
    const handleConfirmDelete = async () => {
        const { error } = await supabase
            .from("availability_schedule")
            .delete()
            .eq("id", deletingId)
            .eq("user_id", userId);

        if (error) {
            console.error("❌ Error deleting availability:", error);
        } else {
            setAvailability(availability.filter((slot) => slot.id !== deletingId));
            setShowDeleteModal(false);
        }
    };

    // 🔹 Handle Edit
    const handleEdit = (slot) => {
        setSelectedDay(weekdays.find((d) => d.value === slot.day_of_week));
        setStartTime(slot.start_time);
        setEndTime(slot.end_time);
        setEditingId(slot.id);
        setShowModal(true);
    };

    // 🔹 Reset Form
    const resetForm = () => {
        setSelectedDay(null);
        setStartTime("");
        setEndTime("");
        setEditingId(null);
        setShowModal(false);
    };

    return (
        <div>
            <label>My Availability Schedule</label>
            <button onClick={() => setShowModal(true)}>Add Availability</button>

            {/* Display Availability Slots */}
            <ul>
                {availability.map((slot) => (
                    <li key={slot.id}>
                        <strong>{slot.day_of_week}</strong>: {slot.start_time} - {slot.end_time}
                        <button onClick={() => handleEdit(slot)}>Edit</button>
                        <button onClick={() => {
                            setDeletingId(slot.id);
                            setShowDeleteModal(true);
                        }}>Remove</button>
                    </li>
                ))}
            </ul>

            {/* Modal Form for Adding / Editing Availability */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{editingId ? "Edit Availability" : "Add Availability"}</h3>
                        <Select
                            options={weekdays}
                            value={selectedDay}
                            onChange={(opt) => setSelectedDay(opt)}
                        />
                        <label>Start Time:</label>
                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

                        <label>End Time:</label>
                        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

                        <button onClick={handleSave}>Save</button>
                        <button onClick={resetForm}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to remove this slot? This action is irreversible.</p>
                        <button onClick={handleConfirmDelete}>Yes, Remove</button>
                        <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvailabilitySchedule;
