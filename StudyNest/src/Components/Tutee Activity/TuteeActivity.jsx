import React from "react";
import "./TuteeActivity.css";

const TuteeActivity = () => {
  return (
    <div className="tutee-activity">
      <div className="header">
        <div className="header-text">
            <h1>Welcome to Activity.</h1>
        </div>
        <div className="header-info">
          <p>Here in Activity, you can track your progress.</p>
        </div>
      </div>

      <div className="activity-content">
        <div className="book-image-logo"></div>
        <div className="card-1">
            <h2>Course</h2>
            <p>Instructor Name</p>
        </div>
      </div>
    </div>
  );
};

export default TuteeActivity;
