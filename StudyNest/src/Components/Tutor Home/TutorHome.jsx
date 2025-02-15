import React from "react";
import "./TutorHome.css";

const TutorHome = () => {
  return (
    <div className="tutor-home">
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">StudyNest</div>
        </div>
        <div className="nav-right">
          <a href="/request">Request</a>
          <a href="/activity">Activity</a>
          <a href="/waitlist">Waitlist</a>
          <div className="user-profile">
            <span>Juan Student</span>
          </div>
        </div>
      </nav>

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

      <footer>© StudyNest 2025. All Rights Reserved.</footer>
    </div>
  );
};

export default TutorHome;
