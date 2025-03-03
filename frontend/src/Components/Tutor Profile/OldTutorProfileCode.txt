import React from "react";
import "./TutorProfile.css";
import TutorNav from "../Nav/TutorNav";
const TutorProfile = () => {
  return (
    <>
      <TutorNav />
      <div className="tutor-profile">
        <div className="tutor-profile-header">
          <div className="tutor-profile-image"></div>
          <div className="tutor-profile-info">
            <h1>Juan Dela Cruz</h1>
            <div className="education-tag">
              2nd Year | Bachelor of Science in Computer Science
            </div>
            <p className="bio">
              Juan Dela Cruz is a dedicated BS Computer Science student at Mapúa
              University with a strong passion for teaching. Proficient in
              physics, he excels in simplifying complex concepts, making him an
              ideal tutor for various physics courses. With his academic
              background and teaching expertise, Juan is committed to helping
              students master physics and achieve their academic goals.
            </p>
          </div>
          <button className="edit-button">+</button>
        </div>

        <section className="availability-section">
          <h2>Set your Availability</h2>
          <p>Set your availability for tutoring.</p>
          <button className="add-button">+</button>
        </section>

        <section className="schedule-section">
          <h2>Preferred Schedule</h2>
          <p>Choose your preferred tutoring schedule for tutees to see.</p>
          <div className="schedule-placeholder"></div>
        </section>

        <section className="class-schedule-section">
          <h2>Class Schedule</h2>
          <p>Upload your class schedule here.</p>
          <button className="add-button">+</button>
        </section>
      </div>
    </>
  );
};

export default TutorProfile;
