import React from "react";
import "./TuteeActivity.css";
import TuteeNav from "../Nav/TuteeNav";

const TuteeActivity = () => {
  return (
    <div className="page-container">
      <TuteeNav />
      <main className="content-wrap">
        <div className="tutee-activity">
          <div className="tutee-header">
            <div className="header-text">
              <h1>Welcome to Activity.</h1>
            </div>
            <div className="header-info">
              <p>Here in Activity, you can track your progress.</p>
            </div>
          </div>

          <div className="activity-content">
            {/* Course cards */}
            <div className="course-card">
              <div className="course-icon">
                <span className="book-icon"></span>
              </div>
              <div className="course-info">
                <h2>Course 1</h2>
                <p>Instructor Hwang Gu Tom</p>
              </div>
            </div>

            <div className="course-card">
              <div className="course-icon">
                <span className="book-icon"></span>
              </div>
              <div className="course-info">
                <h2>Course 2</h2>
                <p>Instructor Lebron James</p>
              </div>
            </div>

            <div className="course-card">
              <div className="course-icon">
                <span className="book-icon"></span>
              </div>
              <div className="course-info">
                <h2>Course 3</h2>
                <p>Instructor KathNiel</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer is rendered elsewhere in your app structure */}
    </div>
  );
};

export default TuteeActivity;
