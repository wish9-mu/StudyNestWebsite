import React from "react";
import "./TuteeWaitlist.css";

const TuteeWaitlist = () => {
  return (
    <div className="tutee-waitlist">
      <div className="header">
        <div className="header-text">
            <h1>Welcome to Waitlist.</h1>
        </div>
        <div className="header-info">
          <p>Here in Waitlist, you can find your courses that are in wait list.</p>
        </div>
      </div>

      <div className="waitlist-content">
        <div className="book-image-logo"></div>
        <div className="card-1">
            <div className="align-left-content">
                <h2>Course</h2>
                <p>Instructor Name</p>
            </div>
            <div className="align-right-content">
                <p>February 14, 2025 | Friday</p>
                <p>10:30-12:00</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TuteeWaitlist;
