import React from "react";
import "./TuteeRequest.css";

const TuteeRequest = () => {
  return (
    <div className="tutee-request">
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

export default TuteeRequest;
