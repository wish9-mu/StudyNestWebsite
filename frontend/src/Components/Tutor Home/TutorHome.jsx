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

        <div className="tutor-home-boxes">
          <div className="box-container">
            <div className="tutor-box box-1"></div>
          </div>
          <div className="box-container">
            <div className="tutor-box box-2"></div>
          </div>
          <div className="box-container">
            <div className="tutor-box box-3"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TutorHome;
