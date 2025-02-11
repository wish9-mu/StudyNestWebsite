import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./Request.css";

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

  const years = ["YEAR 1", "YEAR 2", "YEAR 3", "YEAR 4"];

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

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

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
              <div className="form-group">
                <label className="form-label">Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select year level</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
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
                  <input
                    type="time"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    min="09:00"
                    max="17:00"
                    step="1800" // 30-minute intervals
                    className="form-input"
                    required
                  />
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
