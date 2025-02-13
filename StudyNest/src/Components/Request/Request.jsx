import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./Request.css";
import { Navigate, useNavigate } from "react-router-dom";

const Request = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    year: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const navigate = useNavigate();

  const [isLoggedIn, setLoggedIn] = useState(false);

  const subjects = [
    "PHYS108-2",
    "PHYS108-1",
    "CHEM107-2",
    "BIOL107-2",
    "ITS162L",
    "CSS132",
    "CSS132L",
    "Other",
  ];

  const time = ["7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM",
  "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
  };

  return (
    <>
      <Navbar />
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
              }
              else {
                alert("Please login to submit.");
                navigate("/login");
              }
            }}
          >

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Course</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
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
