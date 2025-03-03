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

const ClassSchedule = () => {
    const [userId, setUserId] = useState(null);
    const [classSchedule, setClassSchedule] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [selectedCourse, setSelectedCourse] = useState(null);
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

    // 🔹 Fetch Courses Schedule
    // 🔹 Fetch Available Courses from Supabase
    useEffect(() => {
        const fetchCourses = async () => {
            const { data, error } = await supabase
                .from("courses")
                .select("course_code, course_name");
    
            if (error) {
                console.error("❌ Error fetching courses:", error);
                return;
            }
    
            // Ensure data is mapped correctly
            setCourses(data.map(course => ({ value: course.course_code, label: course.course_name })));
        };
    
        fetchCourses();
    }, []);
    

    // 🔹 Fetch Class Schedule with Course Names
    useEffect(() => {
        const fetchClassSchedule = async () => {
            if (!userId) return;

            const { data, error } = await supabase
                .from("class_schedule")
                .select(`
                    id,
                    user_id,
                    day_of_week,
                    start_time,
                    end_time,
                    course_code,
                    courses (course_name)
                `)
                .eq("user_id", userId);

            if (error) {
                console.error("❌ Error fetching class schedule:", error);
                return;
            }

            // Transform data to include course_name
            const formattedData = data.map(slot => ({
                ...slot,
                course_name: slot.courses ? slot.courses.course_name : "Unknown Course"
            }));

            setClassSchedule(formattedData);
        };
        fetchClassSchedule();
    }, [userId]);


    // 🔹 Handle Save (Insert or Update)
    const handleSave = async () => {
        if (!selectedDay || !startTime || !endTime || !selectedCourse) {
            alert("Please fill in all fields.");
            return;
        }

        if (startTime < "07:00" || endTime > "19:00") {
            alert("Time must be between 7:00 AM and 7:00 PM.");
            return;
        }

        if (new Date(`1970-01-01T${endTime}`) <= new Date(`1970-01-01T${startTime}`)) {
            alert("End time must be after start time.");
            return;
        }

        const newSlot = {
            user_id: userId,
            day_of_week: selectedDay.value,
            start_time: startTime,
            end_time: endTime,
            course_code: selectedCourse.value,
        };

        try {
            let data, error;
            if (editingId) {
                ({ data, error } = await supabase
                    .from("class_schedule")
                    .update(newSlot)
                    .eq("id", editingId)
                    .eq("user_id", userId));
                
                if (!error) {
                    setClassSchedule((prev) =>
                        prev.map((slot) =>
                            slot.id === editingId ? { ...slot, ...newSlot } : slot
                        )
                    );
                }
            } else {
                ({ data, error } = await supabase
                    .from("class_schedule")
                    .insert([newSlot])
                    .select());

                if (!error && data.length > 0) {
                    setClassSchedule([...classSchedule, { ...newSlot, id: data[0].id }]);
                }
            }

            if (error) {
                throw error;
            }

            console.log("✅ Class Schedule updated successfully.");
            resetForm();
        } catch (err) {
            console.error("❌ Database error:", err);
            alert(err.message || "❌ This time slot conflicts with an existing schedule.");
        }
    };

    // 🔹 Handle Delete Confirmation
    const handleConfirmDelete = async () => {
        try {
            const { error } = await supabase
                .from("class_schedule")
                .delete()
                .eq("id", deletingId)
                .eq("user_id", userId);

            if (error) throw error;

            setClassSchedule(classSchedule.filter((slot) => slot.id !== deletingId));
            setShowDeleteModal(false);
            console.log("✅ Class Schedule slot deleted successfully.");
        } catch (err) {
            console.error("❌ Error deleting class schedule:", err);
            alert("❌ Failed to delete slot.");
        }
    };

    // 🔹 Handle Edit
    const handleEdit = async (slot) => {
        setSelectedDay(weekdays.find((d) => d.value === slot.day_of_week));
        setStartTime(slot.start_time);
        setEndTime(slot.end_time);
    
        // Ensure courses are available before setting the selected course
        if (courses.length > 0) {
            const foundCourse = courses.find((c) => c.value === slot.course_id);
            setSelectedCourse(foundCourse || null);
        }
    
        setEditingId(slot.id);
        setShowModal(true);
    };
       

    // 🔹 Reset Form
    const resetForm = () => {
        setSelectedDay(null);
        setStartTime("");
        setEndTime("");
        setSelectedCourse(null);
        setEditingId(null);
        setShowModal(false);
    };

    return (
        <div>
            <label>My Class Schedule</label>
            <button onClick={() => setShowModal(true)}>Add Class Schedule</button>

            {/* Display Class Schedule Slots */}
            <ul>
                {classSchedule.map((slot) => (
                    <li key={slot.id}>
                        <strong>{slot.day_of_week}</strong>: {slot.start_time} - {slot.end_time} 
                        (<span>{slot.course_name || "Unknown Course"}</span>)
                        <button onClick={() => handleEdit(slot)}>Edit</button>
                        <button onClick={() => {
                            setDeletingId(slot.id);
                            setShowDeleteModal(true);
                        }}>Remove</button>
                    </li>
                ))}
            </ul>


            {/* Modal Form for Adding / Editing Class Schedule */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{editingId ? "Edit Class Schedule" : "Add Class Schedule"}</h3>
                        <label>Day:</label>
                        <Select options={weekdays} value={selectedDay} onChange={setSelectedDay} />

                        <label>Start Time:</label>
                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

                        <label>End Time:</label>
                        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

                        <label>Course:</label>
                        <Select options={courses} value={selectedCourse} onChange={setSelectedCourse} />

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
                        <p>Are you sure you want to remove this class slot? This action is irreversible.</p>
                        <button onClick={handleConfirmDelete}>Yes, Remove</button>
                        <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassSchedule;
