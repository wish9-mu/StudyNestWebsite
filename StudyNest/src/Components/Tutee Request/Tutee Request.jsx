import React from "react";
import "./Tutee Home.css";

const TuteeHome = () => {
  return (
    <div className="tutee-home">
      <div className="center">
        <h1>Find your tutor.</h1>
        <input type="text" className="search-box" 
        placeholder="Search by Course code or Tutor..."></input>

        {//After search, redirect to request page, if available
        }
      </div>
    </div>
  );
};

export default TuteeHome;
