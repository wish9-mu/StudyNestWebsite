import React from "react";
import "./TuteeHome.css";
import TuteeNav from "../Nav/TuteeNav";

const TuteeHome = () => {
  return (
    <>
      <TuteeNav />
      <div className="tutee-home">
        <div className="header">
          <div className="header-text">
            <h1>Learning begins now.</h1>
          </div>
          <div className="header-info">
            <p>Find yout tutor!</p>
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
    </>
  );
};

export default TuteeHome;
