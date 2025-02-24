import React from "react";
import "./TutorHome.css";
import TutorNav from "../Nav/TutorNav";

const TutorHome = () => {
  return (
    <div className="tutor-home">
      <TutorNav />

      <main className="main-content">
        <h1>Learning begins now.</h1>
        <p className="subtitle">
          StudyNest is a student-led tutoring platform exclusively for Mapúans,
          connecting knowledgeable upper-year students with those seeking
          academic support. Whether you're struggling with Calculus, Physics, or
          Engineering subjects, find a qualified peer tutor who's been in your
          shoes.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Your Schedule</h3>
            <p>Manage your tutoring availability and upcoming sessions.</p>
          </div>
          <div className="feature-card">
            <h3>Active Sessions</h3>
            <p>View and manage your current tutoring sessions.</p>
          </div>
          <div className="feature-card">
            <h3>Student Requests</h3>
            <p>Check pending tutoring requests from students.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TutorHome;
