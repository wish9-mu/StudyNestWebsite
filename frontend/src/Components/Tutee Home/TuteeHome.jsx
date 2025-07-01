import React, { useState, useEffect } from "react";
import "./TuteeHome.css";
import TuteeNav from "../Nav/TuteeNav";
import { data, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const TuteeHome = () => {

  return (
    <>
      <TuteeNav />
      <div className="tutee-home">
        <div className="tutee-home-container">
          <h1 className="tutee-home-title">Learning begins now.</h1>
          <p className="tutee-home-description">
            StudyNest is a student-led tutoring platform exclusively for
            Mapúans, connecting knowledgeable upper-year students with those
            seeking academic support. Whether you’re struggling with Calculus,
            Physics, or Engineering subjects, find a qualified peer tutor who's
            been in your shoes.
          </p>
          <div className="tutee-home-boxes">
            <div className="box-container">
              <div className="tutee-box box-1"></div>
            </div>
            <div className="box-container">
              <div className="tutee-box box-2"></div>
            </div>
            <div className="box-container">
              <div className="tutee-box box-3"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TuteeHome;
