import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./AvailableCourses.css";
import "./Modal.css";

const AvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [hasDuplicate, setHasDuplicate] = useState(false);
  const [error, setError] = useState("");
  const [modalType, setModalType] = useState(null);
  const [message, setMessage] = useState("");
  const [visibleMessage, setVisibleMessage] = useState(false);
  const [isEditable, setEditable] = useState(false);
  const [selectedCourseID, setSelectedCourseID] = useState(null);

  const [formData, setFormData] = useState({
    course_name: "",
    course_code: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from("courses").select("*");

      if (error) {
        console.error("Error fetching bookings:", error);
      } else {
        setCourses(data);
      }
    };

    fetchCourses();
  }, []);

  //For adding successfuly + timeout
  useEffect(() => {
    if (visibleMessage) {
      const timer = setTimeout(() => {
        setMessage("");
        setVisibleMessage(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [visibleMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleDuplicate = async (e) => {
    e.preventDefault();

    try {
      const { data: existingCourses, error: fetchError } = await supabase
        .from("courses")
        .select("*")
        .or(
          `course_name.eq.${formData.course_name},course_code.eq.${formData.course_code}`
        );

      if (fetchError) {
        console.error("Error checking existing courses:", fetchError);
        setError("Something went wrong. Please try again.");
        return;
      }

      if (existingCourses && existingCourses.length > 0) {
        setHasDuplicate(true);
        setError("Course already existing.");
        return;
      }

      setHasDuplicate(false);
      addCourse(e);
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("Something went wrong. Please try again.");
      return;
    }
  };

  const addCourse = async (e) => {
    e.preventDefault();

    if (!error) {
      try {
        console.log("Attempting to add course...");

        const { data, error: supabaseError } = await supabase
          .from("courses")
          .insert([
            {
              course_name: formData.course_name,
              course_code: formData.course_code,
            },
          ])
          .select();

        console.log("Supabase response:", { data, error: supabaseError }); // Debugging

        if (!supabaseError) {
          console.log("Course added successfully:", data);
          setMessage(`${formData.course_code} added successfully!`);
          setVisibleMessage(true);

          setCourses((prevCourses) => [...prevCourses, ...data]);

          setFormData({
            course_name: "",
            course_code: "",
          });

          setModalType(null);
        } else {
          console.error("Error adding course:", supabaseError);
        }
      } catch (error) {
        console.error("Unexpected registration error:", error);
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const renderAddCourseForm = () => {
    return (
      <>
        {modalType === "add" && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Add Course</h2>

              {error && <p className="error-message">{error}</p>}

              <form onSubmit={handleDuplicate}>
                <div className="form-group">
                  <input
                    type="text"
                    name="course_name"
                    placeholder="Course Name"
                    value={formData.course_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="course_code"
                    placeholder="Course Code"
                    value={formData.course_code}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="button-group">
                  <button type="submit" className="submit-btn">
                    Add course
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setModalType(null);
                      setFormData({
                        course_name: "",
                        course_code: "",
                      });
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  };

  const deleteCourse = async (courseCode) => {
    if (!courseCode) {
      console.error("No course code provided for deletion");
      setError("Unable to delete: Course information is missing");
      return;
    }

    try {
      console.log("Attempting to delete course...");

      const { data, error: supabaseError } = await supabase
        .from("courses")
        .delete()
        .eq("course_code", courseCode);

      console.log("Supabase response:", { data, error: supabaseError }); // Debugging

      if (!supabaseError) {
        console.log("Course deleted successfully:", data);
        setMessage(`${courseCode} deleted successfully!`);
        setVisibleMessage(true);

        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.course_code !== courseCode)
        );

        setSelectedCourseID(null);
        setModalType(null);
      } else {
        console.error("Error deleting course:", supabaseError);
      }
    } catch (error) {
      console.error("Unexpected deletion error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  const renderDeleteConfirmation = () => {
    return (
      <>
        {modalType === "delete" && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Are you sure you want to remove this course?</h2>

              {error && <p className="error-message">{error}</p>}

              <div className="button-group">
                <button
                  className="delete-confirm-btn"
                  onClick={() => deleteCourse(selectedCourseID)}
                >
                  Yes
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setModalType(null);
                    setSelectedCourseID(null);
                    setError("");
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="course-services">
        <div className="button-container">
          <button className="course-button" onClick={() => setModalType("add")}>
            Add a Course
          </button>
          {!isEditable && (
            <button className="course-button" onClick={() => setEditable(true)}>
              Edit Courses
            </button>
          )}
        </div>

        {renderAddCourseForm()}
        {renderDeleteConfirmation()}
        {visibleMessage && <p className="message-success">{message}</p>}

        {courses.length > 0 ? (
          <div className="course-table">
            <table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  {isEditable && (
                    <th className="done-con">
                      <button
                        className="done-btn"
                        onClick={() => setEditable(false)}
                      >
                        Done
                      </button>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.course_code} className="course-row">
                    <td>{course.course_code}</td>
                    <td>{course.course_name}</td>
                    {isEditable && (
                      <td className="remove-con">
                        <button
                          className="remove-btn"
                          onClick={() => {
                            setSelectedCourseID(course.course_code);
                            setModalType("delete");
                          }}
                        >
                          ✕
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No courses available.</p>
        )}
      </div>
    </>
  );
};

export default AvailableCourses;
