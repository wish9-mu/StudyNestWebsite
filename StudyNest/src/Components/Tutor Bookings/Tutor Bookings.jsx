import React from "react";
import "./Tutor Bookings.css";

const TutorBookings = () => {
  return (
    <div className="tutor-bookings">
      <div className="header">
        <div className="header-text">
            <h1>Manage Bookings</h1>
        </div>
        <div className="header-info">
          <p>In Manage Bookings, the tutor has the option to accept or reject bookings.</p>
        </div>
      </div>

      <div className="bookings-cards">
        <div className="booking-sample">
            <div className="profile-img"></div>
            <h3>LastName, Firstname</h3>
            <p>Course</p>
            <p>Time Slot</p>
            <button>✓</button>
            <button>✗</button>
        </div>
      </div>
    </div>
  );
};

export default TutorBookings;
