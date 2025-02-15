import React from "react";
import "./TuteeHome.css";

const TuteeHome = () => {
  return (
    <div className="tutee-home">
      <div className="header">
        <div className="header-text">
            <h1>Learning begins now.</h1>
        </div>
        <div className="header-info">
          <p>StudyNest is a student-led tutoring platform exclusively for Mapúans, connecting knowledgeable upper-year students 
            with those seeking academic support. Whether you're struggling with Calculus, Physics, or Engineering subjects, find 
            a qualified peer tutor who's been in your shoes.
            </p>
        </div>
      </div>

      <div className="box-placeholders">
        <div className="card-1">
            <p>Card 1</p>
        </div>
        <div className="card-2">
            <p>Card 2</p>
        </div>
        <div className="card-3">
            <p>Card 3</p>
        </div>
      </div>
    </div>
  );
};

export default TuteeHome;
