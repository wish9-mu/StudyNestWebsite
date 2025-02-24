import React from "react";
import "./TuteeProfile.css";

const TuteeProfile = () => {
  return (
    <div className="Tutee-profile">
      <div className="Tutee-profile-header">
        <div className="Tutee-profile-image"></div>
        <div className="Tutee-profile-info">
          <h1>Juan Dela Cruz</h1>
          <div className="education-tag">
            2nd Year | Bachelor of Science in Computer Science
          </div>
          <p className="bio">
            Juan Dela Cruz is a dedicated BS Computer Science student at Mapúa
            University with a strong passion for teaching. Proficient in
            physics, he excels in simplifying complex concepts, making him an
            ideal Tutee for various physics courses. With his academic
            background and teaching expertise, Juan is committed to helping
            students master physics and achieve their academic goals.
          </p>
        </div>
        <button className="edit-button">+</button>
      </div>

      <button className="logout-button">
        <span className="logout-icon">↩</span>
        Logout
      </button>
    </div>
  );
};

export default TuteeProfile;
