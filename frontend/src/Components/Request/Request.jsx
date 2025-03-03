import React, { useEffect, useState } from "react";
import Nav from "../Nav/Nav";
import "./Request.css";
import { Navigate, useNavigate } from "react-router-dom";

const Request = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    year: "",
    course: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const navigate = useNavigate();

  const [isLoggedIn, setLoggedIn] = useState(false);

  const [tutee, setTutee] = useState(null);

  useEffect(() => {
    //To check if user is logged in
    const user = null; //JSON parse to get user data

    if (user) {
      setLoggedIn(true);
      fetchTuteeDetails(user.id); //gets user id
    }
  }, []);

  const fetchTuteeDetails = async (tuteeID) => {
    try {
      //add fetch url here
      const response = await fetch();

      if (response.ok) {
        const data = await response;
        setTutee(data);

        setFormData((prevState) => ({
          ...prevState,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          year: data.year,
        }));
      } else {
        console.error("Failed to fetch tutee details.");
      }
    } catch (error) {
      console.error("Error fetching tutee details:", error);
    }
  };

  const courses = [
    "PHYS108-2",
    "PHYS108-1",
    "CHEM107-2",
    "BIOL107-2",
    "ITS162L",
    "CSS132",
    "CSS132L",
    "Other",
  ];

  const time = [
    "7:00 AM",
    "7:30 AM",
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("Please login to submit.");
      navigate("/login");
    }

    const requestData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      year: formData.year,
      course: formData.course,
      date: formData.preferredDate,
      time: formData.preferredTime,
      message: formData.message,
    };

    try {
      //add fetch url here
      const response = await fetch(null, {
        method: "POST",
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert("Request submitted successfully!");
        setFormData({
          course: "",
          preferredDate: "",
          preferredTime: "",
          message: "",
        });
      } else {
        alert("Failed to submit request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("An error occured. Please try again later.");
    }
  };

  return (
    <>
      <Nav />
      <div className="request-container">
        <div className="request-card">
          <div className="request-header">
            <h1 className="request-title">Request a Tutor</h1>
            <p className="request-subtitle">
              Fill out the form below and we'll match you with the perfect tutor
            </p>
          </div>

          <form
            className="form-grid"
            onSubmit={(e) => {
              e.preventDefault();
              //no setLoggedIn yet, so always false isLoggedIn
              if (isLoggedIn == true) {
                handleSubmit();
              } else {
                alert("Please login to submit.");
                navigate("/login");
              }
            }}
          >
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Course</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Preferred Start Date</label>
                <div className="date-input-container">
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
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

              <div className="form-group">
                <label className="form-label">Preferred Time</label>
                <div className="time-input-container">
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value=""> Select time schedule</option>
                    {time.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <small className="helper-text">
                    Available hours: 7:00 AM - 7:00 PM
                  </small>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Additional Details</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Tell us about your learning goals and any specific requirements..."
              />
            </div>

            <button type="submit" className="submit-button">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Request;
