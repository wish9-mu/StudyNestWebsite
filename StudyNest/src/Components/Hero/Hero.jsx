import React from "react";
import "./Hero.css";
import { Link } from "react-router-dom";

const Hero = () => {
  console.log("Hero component rendered");
  return (
    <div className="hero">
      <div className="hero-text">
        <h1>Your Study Partner.</h1>
        <p>
          StudyNest is a student-led tutoring platform exclusively for Mapúans,
          connecting knowledgeable upper-year students with those seeking
          academic support. Whether you're struggling with Calculus, Physics, or
          Engineering subjects, find a qualified peer tutor who's been in your
          shoes.
        </p>
        <Link to="/request" className="nav-links">
          <button className="btn">Find a Tutor</button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
