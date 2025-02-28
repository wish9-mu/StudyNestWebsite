import React from "react";
import "./TuteeProfile.css";
import TuteeNav from "../Nav/TuteeNav";

const TuteeProfile = () => {
  return (
    <>
      <TuteeNav />
      <div className="tutee-profile">
        <div className="tutee-profile-header">
          <div className="tutee-profile-image"></div>
          <div className="tutee-profile-info">
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
      </div>
    </>
  );
};

export default TuteeProfile;
